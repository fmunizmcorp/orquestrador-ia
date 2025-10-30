/**
 * Servidor Principal - Orquestrador V3.0
 * Integra tRPC, WebSocket, Terminal SSH, e todos os serviços
 */

import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { appRouter } from './routers/index.js';
import { createContext } from './trpc.js';
import { testConnection } from './db/index.js';
import { systemMonitorService } from './services/systemMonitorService.js';
import { handleMessage, connectionManager, broadcastTaskUpdate } from './websocket/handlers.js';
import { setBroadcastCallback } from './services/orchestratorService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// tRPC
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbOk = await testConnection();
    const systemHealth = await systemMonitorService.healthCheck();
    
    res.json({
      status: 'ok',
      database: dbOk ? 'connected' : 'error',
      system: systemHealth.healthy ? 'healthy' : 'issues',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: String(error),
    });
  }
});

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../dist/client');
  app.use(express.static(clientPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Criar servidor HTTP
const server = createServer(app);

// WebSocket para chat e monitoramento em tempo real
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('✅ Cliente WebSocket conectado');

  // Registrar conexão
  connectionManager.register(ws);

  // Enviar métricas a cada 10 segundos (se inscrito)
  const interval = setInterval(async () => {
    try {
      // Enviar apenas para quem está inscrito em monitoramento
      const subscribers = connectionManager.getMonitoringSubscribers();
      
      if (subscribers.includes(ws) && ws.readyState === 1) {
        const metrics = await systemMonitorService.getMetrics();
        ws.send(JSON.stringify({ type: 'metrics', data: metrics }));
      }
    } catch (error) {
      console.error('Erro ao enviar métricas:', error);
    }
  }, 10000);

  // Handler de mensagens
  ws.on('message', async (message: string) => {
    await handleMessage(ws, message.toString());
  });

  ws.on('close', () => {
    console.log('❌ Cliente WebSocket desconectado');
    clearInterval(interval);
    connectionManager.unregister(ws);
  });

  ws.on('error', (error) => {
    console.error('Erro no WebSocket:', error);
    clearInterval(interval);
    connectionManager.unregister(ws);
  });
});

// Iniciar servidor
async function start() {
  try {
    // Testar conexão com banco
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Falha ao conectar com o banco de dados');
      process.exit(1);
    }

    // Configurar callback de broadcast
    setBroadcastCallback(broadcastTaskUpdate);

    // Iniciar servidor
    server.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════════╗');
      console.log('║   🚀 Orquestrador de IAs V3.0             ║');
      console.log('╚════════════════════════════════════════════╝');
      console.log('');
      console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
      console.log(`✅ API tRPC: http://localhost:${PORT}/api/trpc`);
      console.log(`✅ WebSocket: ws://localhost:${PORT}/ws`);
      console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
      console.log('');
      console.log('📊 Sistema pronto para orquestrar IAs!');
      console.log('');
    });

    // Tratamento de erros não capturados
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\\n⚠️  SIGTERM recebido, encerrando gracefully...');
      server.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\\n⚠️  SIGINT recebido, encerrando gracefully...');
      server.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar
start();

export { app, server };
