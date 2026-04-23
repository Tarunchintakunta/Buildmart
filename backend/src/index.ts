import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';

import { authRoutes } from './routes/auth.js';
import { userRoutes } from './routes/users.js';
import { shopRoutes } from './routes/shops.js';
import { productRoutes } from './routes/products.js';
import { orderRoutes } from './routes/orders.js';
import { workerRoutes } from './routes/workers.js';
import { laborRoutes } from './routes/labor.js';
import { agreementRoutes } from './routes/agreements.js';
import { walletRoutes } from './routes/wallet.js';
import { deliveryRoutes } from './routes/deliveries.js';
import { notificationRoutes } from './routes/notifications.js';
import { adminRoutes } from './routes/admin.js';
import { chatRoutes } from './routes/chat.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'buildmart_secret_key_change_in_prod';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' } }
          : undefined,
    },
  });

  // ─── Plugins ────────────────────────────────────────────────────────────────

  await fastify.register(fastifyCors, {
    origin: true, // Allow all origins in dev
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await fastify.register(fastifyJwt, {
    secret: JWT_SECRET,
  });

  // ─── Global error handler ────────────────────────────────────────────────────

  fastify.setErrorHandler((error, _request, reply) => {
    fastify.log.error(error);
    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.message,
        code: 'SERVER_ERROR',
      });
    }
    return reply.status(500).send({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  });

  fastify.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({
      error: 'Route not found',
      code: 'NOT_FOUND',
    });
  });

  // ─── Health check ────────────────────────────────────────────────────────────

  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'BuildMart API',
  }));

  fastify.get('/', async () => ({
    message: 'BuildMart API — India Construction Marketplace',
    version: '1.0.0',
    docs: '/health',
  }));

  // ─── Routes ──────────────────────────────────────────────────────────────────

  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(userRoutes, { prefix: '/api/users' });
  await fastify.register(shopRoutes, { prefix: '/api/shops' });
  await fastify.register(productRoutes, { prefix: '/api/products' });
  await fastify.register(orderRoutes, { prefix: '/api/orders' });
  await fastify.register(workerRoutes, { prefix: '/api/workers' });
  await fastify.register(laborRoutes, { prefix: '/api/labor' });
  await fastify.register(agreementRoutes, { prefix: '/api/agreements' });
  await fastify.register(walletRoutes, { prefix: '/api/wallet' });
  await fastify.register(deliveryRoutes, { prefix: '/api/deliveries' });
  await fastify.register(notificationRoutes, { prefix: '/api/notifications' });
  await fastify.register(adminRoutes, { prefix: '/api/admin' });
  await fastify.register(chatRoutes, { prefix: '/api/chat' });

  return fastify;
}

async function start() {
  try {
    const server = await buildServer();
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`BuildMart API running on http://0.0.0.0:${PORT}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
