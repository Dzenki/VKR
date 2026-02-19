// Универсальный сервер 3в1: статика + WebSocket сигналинг + менеджмент-контроль
// Функциональный подход, упрощенная версия

import fs from 'fs'
import http from 'http'
import https from 'https'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { WebSocket, WebSocketServer } from 'ws'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Конфигурация
const PORT = 6200
const WS_PATH = '/ws'
const HOST = 'localhost'
const STATIC_DIR = join(__dirname, './build')
const LOG_LEVEL = 'info'
// Очистка неактивных пользователей
const INACTIVE_USER_TTL_MS = 1000 * 60 * 1 // 30 минут
const CLEANUP_INTERVAL_MS = 1000 * 60 * 1 // каждые 5 минут

console.log('Server started on', `${HOST}:${PORT}`)

// Логирование
const log = (...args) => LOG_LEVEL !== 'error' && console.log('[server]', ...args)
const logError = (...args) => console.error('[server]', ...args)

// Утилиты
const safeJsonParse = (data) => {
	try { return JSON.parse(data) } catch { return null }
}

const send = (ws, payload) => {
	try { ws.send(JSON.stringify(payload)) } catch (e) { logError('Send error:', e) }
}

const isWebSocketOpen = (ws) => ws && ws.readyState === WebSocket.OPEN

// ===== ГЛОБАЛЬНОЕ СОСТОЯНИЕ =====
const state = {
	// clientId (userName) -> { clientId, userName, isOnline, ws, roomId, joinedAt, lastSeen }
	users: new Map(),
	// roomId -> Set<clientId>
	rooms: new Map(),
	// clientId (userName) -> WebSocket
	connections: new Map()
}

// ===== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ =====
const createUser = (clientId, userName = null) => {
	const user = {
		clientId,
		userName: userName || clientId,
		isOnline: false,
		ws: null,
		roomId: null,
		joinedAt: Date.now(),
		lastSeen: Date.now()
	}

	state.users.set(clientId, user)
	// clientId и userName теперь одинаковые, поэтому не нужно дублировать в usersByName
	log(`User created: ${user.userName}`)
	return user
}

const updateUser = (clientId, updates) => {
	const user = state.users.get(clientId)
	if (!user) return null

	Object.assign(user, updates)
	return user
}

const setUserOnline = (clientId, ws) => {
	const user = state.users.get(clientId)
	if (user) {
		user.isOnline = true
		user.ws = ws
		user.lastSeen = Date.now()
		state.connections.set(clientId, ws)
	}
}

const setUserOffline = (clientId) => {
	const user = state.users.get(clientId)
	if (user) {
		user.isOnline = false
		user.ws = null
		user.lastSeen = Date.now()
		state.connections.delete(clientId)

		// Удаляем из комнаты
		if (user.roomId) {
			leaveRoom(user.roomId, clientId)
		}
	}
}

const getUserByName = (userName) => {
	return state.users.get(userName)
}

// ===== УПРАВЛЕНИЕ КОМНАТАМИ =====
const joinRoom = (roomId, clientId) => {
	if (!state.rooms.has(roomId)) {
		state.rooms.set(roomId, new Set())
		log(`Room created: ${roomId}`)
	}

	// Покидаем предыдущую комнату
	const user = state.users.get(clientId)
	if (user && user.roomId && user.roomId !== roomId) {
		leaveRoom(user.roomId, clientId)
	}

	state.rooms.get(roomId).add(clientId)
	updateUser(clientId, { roomId })
	log(`User ${clientId} joined room ${roomId}`)
}

const leaveRoom = (roomId, clientId) => {
	const room = state.rooms.get(roomId)
	if (!room) return

	room.delete(clientId)
	updateUser(clientId, { roomId: null })

	if (room.size === 0) {
		state.rooms.delete(roomId)
		log(`Room ${roomId} deleted (empty)`)
	} else {
		log(`User ${clientId} left room ${roomId} (${room.size} remaining)`)
	}
}

const getRoomParticipants = (roomId) => {
	const room = state.rooms.get(roomId)
	if (!room) return []

	return Array.from(room).map(clientId => {
		const user = state.users.get(clientId)
		return user ? {
			clientId: user.clientId,
			userName: user.userName,
			isOnline: user.isOnline
		} : null
	}).filter(Boolean)
}

// ===== СИГНАЛИНГ =====
const broadcastToRoom = (roomId, payload, exceptClientId = null) => {
	const room = state.rooms.get(roomId)
	if (!room) return

	room.forEach(clientId => {
		if (clientId === exceptClientId) return
		const ws = state.connections.get(clientId)
		if (ws && isWebSocketOpen(ws)) {
			send(ws, payload)
		}
	})
}

const sendToUser = (clientId, payload) => {
	const ws = state.connections.get(clientId)
	if (ws && isWebSocketOpen(ws)) {
		send(ws, payload)
	}
}

const sendToUserByName = (userName, payload) => {
	const user = getUserByName(userName)
	if (user && user.isOnline) {
		sendToUser(user.clientId, payload)
	}
}

const broadcastToAll = (payload, exceptClientId = null) => {
	state.connections.forEach((ws, clientId) => {
		if (clientId === exceptClientId) return
		if (ws && isWebSocketOpen(ws)) {
			send(ws, payload)
		}
	})
}

const handleMessage = (ws, message) => {
	const msg = safeJsonParse(message)
	if (!msg || typeof msg !== 'object') return

	// Для регистрации не требуется существующий пользователь
	if (msg.type === 'register') {
		// Обрабатываем регистрацию отдельно
	} else {
		// Для всех остальных сообщений требуется зарегистрированный пользователь
		if (!ws.clientId) {
			send(ws, { type: 'error', error: 'User not registered' })
			return
		}
	}

	const clientId = ws.clientId
	const user = state.users.get(clientId)
	if (user) user.lastSeen = Date.now()
	const roomId = msg.roomId || (user ? user.roomId : null)

	switch (msg.type) {
		case 'ping':
			if (user) user.lastSeen = Date.now()
			sendToUser(clientId, { type: 'pong', t: msg.t || Date.now() })
			break

		case 'register':
			const requestedUserName = msg.userName?.trim()
			if (!requestedUserName) {
				send(ws, { type: 'error', error: 'Username is required' })
				break
			}

			// Проверяем, занято ли имя другим пользователем
			const existingUser = state.users.get(requestedUserName)
			if (existingUser && existingUser.isOnline) {
				send(ws, { type: 'error', error: 'Username is already taken' })
				break
			}

			// Устанавливаем clientId как имя пользователя
			ws.clientId = requestedUserName

			// Создаем пользователя с именем как clientId
			createUser(requestedUserName, requestedUserName)
			setUserOnline(requestedUserName, ws)
			updateUser(requestedUserName, { lastSeen: Date.now() })

			send(ws, {
				type: 'registered',
				clientId: requestedUserName,
				userName: requestedUserName
			})

			// Уведомляем всех о том, что пользователь появился онлайн
			broadcastToAll({
				type: 'user-online',
				clientId: requestedUserName,
				userName: requestedUserName
			}, requestedUserName)
			break

		case 'join':
			if (!roomId) {
				sendToUser(clientId, { type: 'error', error: 'roomId required' })
				break
			}

			joinRoom(roomId, clientId)
			const participants = getRoomParticipants(roomId)

			sendToUser(clientId, {
				type: 'joined',
				roomId,
				clientId,
				participants,
				participantsCount: participants.length
			})

			broadcastToRoom(roomId, {
				type: 'peer-join',
				roomId,
				clientId,
				userName: user.userName,
				participants,
				participantsCount: participants.length
			}, clientId)
			break

		case 'leave':
			if (user.roomId) {
				leaveRoom(user.roomId, clientId)
				broadcastToRoom(user.roomId, {
					type: 'peer-leave',
					roomId: user.roomId,
					clientId,
					userName: user.userName,
					participantsCount: state.rooms.get(user.roomId)?.size || 0
				})
			}
			break

		case 'offer':
		case 'answer':
		case 'candidate':
		case 'ice-complete':
		case 'call-rejected':
		case 'call-ended':
			const payload = { ...msg, from: clientId, fromUserName: user.userName }

			if (msg.to) {
				sendToUser(msg.to, payload)
			} else {
				sendToUser(clientId, { type: 'error', error: 'to field required for WebRTC messages' })
			}
			break

		case 'media-state':
			// Обрабатываем media-state как WebRTC сообщение
			const mediaPayload = { ...msg, from: clientId, fromUserName: user.userName }

			if (msg.to) {
				sendToUser(msg.to, mediaPayload)
			} else {
				sendToUser(clientId, { type: 'error', error: 'to field required for media-state messages' })
			}
			break

		case 'invite':
			if (!msg.targetUser || !msg.fromUser) {
				sendToUser(clientId, { type: 'error', error: 'invite requires targetUser and fromUser' })
				break
			}

			sendToUserByName(msg.targetUser, {
				type: 'invite',
				fromUser: msg.fromUser,
				message: msg.message || `Пользователь ${msg.fromUser} приглашает вас в диалог`
			})
			break

		case 'invite-response':
			if (!msg.to || typeof msg.accepted !== 'boolean') {
				sendToUser(clientId, { type: 'error', error: 'invite-response requires to and accepted fields' })
				break
			}

			sendToUser(msg.to, {
				type: 'invite-response',
				from: clientId,
				fromUserName: user.userName,
				accepted: msg.accepted,
				message: msg.message || `Пользователь ${user.userName} ${msg.accepted ? 'принял' : 'отклонил'} приглашение`
			})
			break

		default:
			log(`Unknown message type: ${msg.type}`)
	}
}

// ===== СТАТИЧЕСКИЙ СЕРВЕР =====
const getContentType = (filePath) => {
	const ext = filePath.toLowerCase().split('.').pop()
	const types = {
		'html': 'text/html; charset=utf-8',
		'js': 'application/javascript; charset=utf-8',
		'css': 'text/css; charset=utf-8',
		'json': 'application/json; charset=utf-8',
		'png': 'image/png',
		'jpg': 'image/jpeg',
		'jpeg': 'image/jpeg',
		'gif': 'image/gif',
		'webp': 'image/webp',
		'svg': 'image/svg+xml',
		'ico': 'image/x-icon',
		'woff': 'font/woff',
		'woff2': 'font/woff2'
	}
	return types[ext] || 'application/octet-stream'
}

const isAssetPath = (pathname) => pathname.startsWith('/assets/') || /\.[a-zA-Z0-9]+$/.test(pathname)

const safeJoin = (base, target) => {
	if (!base || !target) return base || ''
	const targetPath = decodeURIComponent(target.split('?')[0].split('#')[0] || '/')
	const safePath = targetPath.replace(/\\+/g, '/').replace(/\.\.+/g, '.')
	return `${base}/${safePath}`.replace(/\/+/g, '/')
}

const trySendFile = (res, filePath, cacheControl) => {
	try {
		if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false

		const stream = fs.createReadStream(filePath)
		res.writeHead(200, {
			'Content-Type': getContentType(filePath),
			'Cache-Control': cacheControl,
			'Access-Control-Allow-Origin': '*'
		})
		stream.pipe(res)
		return true
	} catch (e) {
		return false
	}
}

// ===== REST API =====
const handleApiRequest = (req, res, url) => {
	const path = url.pathname
	const method = req.method

	// CORS
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

	if (method === 'OPTIONS') {
		res.writeHead(200)
		res.end()
		return
	}

	try {
		if (path === '/api/health') {
			res.writeHead(200, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify({ status: 'ok', timestamp: Date.now(), wsPath: WS_PATH }))
			return
		}

		if (path === '/api/stats') {
			const users = Array.from(state.users.values())
			const stats = {
				users: {
					total: users.length,
					online: users.filter(u => u.isOnline).length
				},
				rooms: {
					total: state.rooms.size,
					totalParticipants: Array.from(state.rooms.values()).reduce((sum, room) => sum + room.size, 0)
				},
				server: {
					uptime: process.uptime(),
					memory: process.memoryUsage(),
					timestamp: Date.now()
				}
			}

			res.writeHead(200, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify(stats))
			return
		}

		if (path === '/api/users') {
			const users = Array.from(state.users.values()).map(user => ({
				clientId: user.clientId,
				userName: user.userName,
				isOnline: user.isOnline,
				joinedAt: user.joinedAt,
				roomId: user.roomId
			}))

			res.writeHead(200, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify(users))
			return
		}

		if (path.startsWith('/api/users/')) {
			const clientId = path.split('/')[3]
			const user = state.users.get(clientId)

			if (!user) {
				res.writeHead(404, { 'Content-Type': 'application/json' })
				res.end(JSON.stringify({ error: 'User not found' }))
				return
			}

			if (method === 'GET') {
				const userInfo = {
					clientId: user.clientId,
					userName: user.userName,
					isOnline: user.isOnline,
					joinedAt: user.joinedAt,
					roomId: user.roomId
				}

				res.writeHead(200, { 'Content-Type': 'application/json' })
				res.end(JSON.stringify(userInfo))
				return
			}

			if (method === 'DELETE') {
				state.users.delete(clientId)
				state.usersByName.delete(user.userName)
				state.connections.delete(clientId)
				if (user.roomId) leaveRoom(user.roomId, clientId)

				res.writeHead(200, { 'Content-Type': 'application/json' })
				res.end(JSON.stringify({ message: 'User deleted' }))
				return
			}
		}

		if (path === '/api/rooms') {
			const rooms = Array.from(state.rooms.entries()).map(([roomId, participants]) => ({
				roomId,
				participantsCount: participants.size,
				participants: Array.from(participants)
			}))

			res.writeHead(200, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify(rooms))
			return
		}

		if (path.startsWith('/api/rooms/')) {
			const roomId = path.split('/')[3]
			const room = state.rooms.get(roomId)

			if (!room) {
				res.writeHead(404, { 'Content-Type': 'application/json' })
				res.end(JSON.stringify({ error: 'Room not found' }))
				return
			}

			if (method === 'GET') {
				const roomInfo = {
					roomId,
					participantsCount: room.size,
					participants: Array.from(room)
				}

				res.writeHead(200, { 'Content-Type': 'application/json' })
				res.end(JSON.stringify(roomInfo))
				return
			}

			if (method === 'DELETE') {
				// Удаляем всех участников
				Array.from(room).forEach(clientId => {
					updateUser(clientId, { roomId: null })
				})
				state.rooms.delete(roomId)

				res.writeHead(200, { 'Content-Type': 'application/json' })
				res.end(JSON.stringify({ message: 'Room deleted' }))
				return
			}
		}

		// 404
		res.writeHead(404, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ error: 'API endpoint not found' }))

	} catch (error) {
		logError('API Error:', error)
		res.writeHead(500, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ error: 'Internal server error' }))
	}
}

// ===== ОСНОВНОЙ HTTP СЕРВЕР =====
const requestHandler = (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`)

	// API endpoints
	if (url.pathname.startsWith('/api/')) {
		handleApiRequest(req, res, url)
		return
	}

	// Health check
	if (url.pathname === '/health') {
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ status: 'ok', wsPath: WS_PATH, timestamp: Date.now() }))
		return
	}

	// Статические файлы
	const method = req.method.toUpperCase()
	if (method !== 'GET' && method !== 'HEAD') {
		res.writeHead(405)
		res.end()
		return
	}

	const isAsset = isAssetPath(url.pathname)
	const base = STATIC_DIR

	// 1) Статический файл
	if (isAsset) {
		const filePath = safeJoin(base, url.pathname)
		if (trySendFile(res, filePath, 'public, max-age=31536000, immutable')) return
		res.writeHead(404)
		res.end()
		return
	}

	// 2) SPA fallback
	const indexPath = join(base, 'index.html')
	if (trySendFile(res, indexPath, 'no-cache')) return

	res.writeHead(404)
	res.end()
}

// ===== SSL/TLS =====
const loadTlsOptions = () => {
	const keyPath = join(__dirname, 'ssl', 'paxio.key')
	const certPath = join(__dirname, 'ssl', 'paxio.crt')
	const caPath = join(__dirname, 'ssl', 'paxio.chain.crt')

	if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) return null

	const opts = {
		key: fs.readFileSync(keyPath),
		cert: fs.readFileSync(certPath)
	}

	if (fs.existsSync(caPath)) {
		opts.ca = fs.readFileSync(caPath)
	}

	return opts
}

// ===== ЗАПУСК СЕРВЕРА =====
const tlsOptions = loadTlsOptions()
const isHttps = !!tlsOptions

const server = isHttps ? https.createServer(tlsOptions, requestHandler) : http.createServer(requestHandler)
const wss = new WebSocketServer({ server, path: WS_PATH })

wss.on('connection', (ws) => {
	// clientId будет установлен при регистрации
	ws.isAlive = true
	ws._lastPong = Date.now()

	log(`Client connected: pending registration`)

	ws.on('pong', () => {
		ws.isAlive = true
		ws._lastPong = Date.now()
	})

	ws.on('message', (data) => {
		const message = typeof data === 'string' ? data : data.toString('utf8')
		handleMessage(ws, message)
	})

	ws.on('close', (code, reason) => {
		const clientId = ws.clientId
		if (clientId) {
			log(`Client disconnected: ${clientId} (${code})`)
			const user = state.users.get(clientId)

			// Уведомляем всех о том, что пользователь ушел офлайн
			if (user) {
				setUserOffline(clientId)
				broadcastToAll({
					type: 'user-offline',
					clientId,
					userName: user.userName
				})
			}
		} else {
			log(`Client disconnected: unregistered (${code})`)
		}
	})

	ws.on('error', (err) => {
		const clientId = ws.clientId
		if (clientId) {
			logError(`WebSocket error for ${clientId}:`, err)
			const user = state.users.get(clientId)

			// Уведомляем всех о том, что пользователь ушел офлайн
			if (user) {
				setUserOffline(clientId)
				broadcastToAll({
					type: 'user-offline',
					clientId,
					userName: user.userName
				})
			}
		} else {
			logError(`WebSocket error for unregistered client:`, err)
		}
	})
})

// Heartbeat
const interval = setInterval(() => {
	const now = Date.now()

	for (const ws of wss.clients) {
		if (!isWebSocketOpen(ws)) continue

		if (!ws._lastPong) ws._lastPong = now

		const since = now - ws._lastPong
		if (since > 45000) { // 45 секунд таймаут
			logError(`Terminating idle client: ${ws.clientId} (${since}ms)`)
			setUserOffline(ws.clientId)
			ws.terminate()
			continue
		}

		try {
			ws.ping()
		} catch (e) {
			logError('Error pinging client:', e)
		}
	}
}, 15000) // 15 секунд интервал

wss.on('close', () => {
	clearInterval(interval)
})

// Запуск
server.listen(PORT, HOST, () => {
	console.log(`🚀 Server running on ${isHttps ? 'https' : 'http'}://${HOST}:${PORT}`)
	console.log(`📡 WebSocket: ws${isHttps ? 's' : ''}://${HOST}:${PORT}${WS_PATH}`)
	console.log(`📊 Management API: ${isHttps ? 'https' : 'http'}://${HOST}:${PORT}/api/`)
	console.log(`📁 Static files: ${STATIC_DIR}`)
})

// ===== Очистка неактивных пользователей =====
const cleanupInterval = setInterval(() => {
	const now = Date.now()
	let removed = 0

	for (const [clientId, user] of state.users.entries()) {
		// удаляем только офлайн-юзеров, давно не проявлявших активность
		if (user && !user.isOnline) {
			const lastSeen = user.lastSeen || user.joinedAt || 0
			if (now - lastSeen > INACTIVE_USER_TTL_MS) {
				// корректно выходим из комнаты, если нужно
				if (user.roomId) {
					leaveRoom(user.roomId, clientId)
				}
				state.connections.delete(clientId)
				state.users.delete(clientId)
				removed++
			}
		}
	}

	if (removed > 0) {
		log(`Cleanup removed ${removed} inactive user(s)`) 
	}
}, CLEANUP_INTERVAL_MS)

// Graceful shutdown
const gracefulShutdown = () => {
	console.log('\n🛑 Shutting down server...')

	// Останавливаем heartbeat
	clearInterval(interval)

	// Закрываем все WebSocket соединения
	wss.clients.forEach(ws => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.close(1000, 'Server shutting down')
		}
	})

	// Закрываем WebSocket сервер
	wss.close(() => {
		console.log('📡 WebSocket server closed')

		// Закрываем HTTP сервер
		server.close(() => {
			console.log('✅ HTTP server closed')
			process.exit(0)
		})
	})
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('SIGUSR2', gracefulShutdown) // Для nodemon

// Обработка необработанных исключений
process.on('uncaughtException', (err) => {
	logError('Uncaught Exception:', err)
	gracefulShutdown()
})

process.on('unhandledRejection', (reason, promise) => {
	logError('Unhandled Rejection at:', promise, 'reason:', reason)
	gracefulShutdown()
})