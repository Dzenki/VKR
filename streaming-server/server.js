import fs from 'fs'
import http from 'http'
import https from 'https'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { WebSocket, WebSocketServer } from 'ws'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// const express = require('express')
const cors = require('cors')

// Конфигурация
const PORT = 6200
const WS_PATH = '/ws'
const HOST = 'localhost'
const STATIC_DIR = join(__dirname, './build')
const LOG_LEVEL = 'info'

// Разрешаем CORS для всех доменов (для разработки)
app.use(cors())
// Позволяем Express обрабатывать JSON в теле запроса
// app.use(express.json())
console.log('Server started on', `${HOST}:${PORT}`)

// Пример API-эндпоинта
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Привет с сервера Node.js!' })
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер работает на http://${HOST}:${PORT}`)
})