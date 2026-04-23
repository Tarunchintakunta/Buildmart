import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { findUserByPhone, getUserById } from '../services/auth.service.js';
import { authenticate } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';

const loginSchema = z.object({
  phone: z.string().min(10).max(15),
});

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /api/auth/login — phone-based lookup, returns JWT
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const result = loginSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Invalid phone number', code: 'VALIDATION_ERROR' });
    }

    const { phone } = result.data;
    const user = await findUserByPhone(phone);

    if (!user) {
      return reply.status(404).send({ error: 'User not found. Phone not registered.', code: 'USER_NOT_FOUND' });
    }

    const payload: JWTPayload = { userId: user.id, role: user.role, phone: user.phone };
    const token = fastify.jwt.sign(payload, { expiresIn: '30d' });

    return reply.send({
      user: {
        id: user.id,
        phone: user.phone,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        city: user.city,
      },
      token,
    });
  });

  // GET /api/auth/me — returns current user from JWT
  fastify.get('/me', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as unknown as JWTPayload;
    const user = await getUserById(payload.userId);

    if (!user) {
      return reply.status(404).send({ error: 'User not found', code: 'USER_NOT_FOUND' });
    }

    return reply.send({ user });
  });
}
