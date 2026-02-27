import fs from 'fs';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 6200;
const HOST = 'localhost';
const VITE_DEV_PORT = 5173;

// Определяем режим
const NODE_ENV = process.env.NODE_ENV || 'development';
const DEV_MODE = NODE_ENV === 'development';

console.log(`\n🔧 Mode: ${NODE_ENV}`);
console.log(`🚀 Starting server...`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов (только в development)
if (DEV_MODE) {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
  });
}

// В режиме разработки - проксируем запросы к Vite dev серверу
if (DEV_MODE) {
  console.log(`🔄 Setting up proxy to Vite dev server at http://localhost:${VITE_DEV_PORT}`);

  // Проверяем доступность Vite сервера перед проксированием
  const checkViteServer = () => {
    const options = {
      host: 'localhost',
      port: VITE_DEV_PORT,
      path: '/',
      method: 'HEAD',
      timeout: 1000
    };

    const req = http.request(options, (res) => {
      console.log(`✅ Vite dev server is running on port ${VITE_DEV_PORT}`);
    });

    req.on('error', () => {
      console.log(`\n❌ Vite dev server is NOT running on port ${VITE_DEV_PORT}`);
      console.log('📌 Please run in another terminal:');
      console.log('   cd streaming-front && npm run dev\n');
    });

    req.end();
  };

  checkViteServer();

  // Прокси для всех запросов
  app.use('/', createProxyMiddleware({
    target: `http://localhost:${VITE_DEV_PORT}`,
    changeOrigin: true,
    ws: true, // Проксируем WebSocket для HMR
    logLevel: 'warn',
    onError: (err, req, res) => {
      console.error('\n❌ Proxy error:', err.message);
      console.log('💡 Make sure Vite dev server is running:');
      console.log('   cd streaming-front && npm run dev\n');

      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
              <html>
                <head><title>Vite Dev Server Not Running</title></head>
                <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
                  <h1>❌ Vite Dev Server Not Running</h1>
                  <p>Please run the following command in another terminal:</p>
                  <pre style="background: #f0f0f0; padding: 1rem; border-radius: 5px;">cd streaming-front && npm run dev</pre>
                  <p>Then refresh this page.</p>
                </body>
              </html>
            `);
      }
    }
  }));

  console.log(`✅ Proxy configured. Frontend will be served from Vite dev server`);
} else {
  // В production режиме - обслуживаем статические файлы
  const BUILD_DIR = join(__dirname, 'build', 'prod');
  console.log(`📁 Build directory: ${BUILD_DIR}`);

  try {
    if (fs.existsSync(BUILD_DIR)) {
      app.use(express.static(BUILD_DIR));
      console.log(`✅ Serving static files from ${BUILD_DIR}`);

      // Для SPA - все пути перенаправляем на index.html
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
          return next();
        }
        if (!req.path.includes('.')) {
          const indexPath = join(BUILD_DIR, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
          } else {
            next();
          }
        } else {
          next();
        }
      });
    } else {
      console.log(`⚠️  Build directory not found: ${BUILD_DIR}`);
      console.log('👉 Run "npm run build" in frontend directory first');
    }
  } catch (err) {
    console.error('❌ Error with static files:', err.message);
  }
}

// API endpoints
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Привет с сервера Node.js!',
    timestamp: new Date().toISOString(),
    mode: NODE_ENV
  });
});

// Создаем HTTP сервер
const server = http.createServer(app);

// Запуск сервера
server.listen(PORT, HOST, () => {
  console.log(`\n✅ Server started on http://${HOST}:${PORT}`);
  console.log(`📝 API endpoint: http://${HOST}:${PORT}/api/hello`);

  if (DEV_MODE) {
    console.log(`\n⚡ DEVELOPMENT MODE - Hot Reload Enabled`);
    console.log(`📌 Vite dev server required on port ${VITE_DEV_PORT}`);
    console.log(`🌐 Open http://${HOST}:${PORT} in your browser`);
    console.log(`🔄 Changes will appear automatically!\n`);
  } else {
    console.log(`🌐 Frontend: http://${HOST}:${PORT} (static files)\n`);
  }
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Failed to start server:', err.message);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});