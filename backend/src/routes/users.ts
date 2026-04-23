import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';

const updateUserSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  avatar_url: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export async function userRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/users — admin only: list all users
  fastify.get('/', { preHandler: requireRole('admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { role?: string; page?: string; limit?: string; search?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin.from('users').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    if (query.role) q = q.eq('role', query.role);
    if (query.search) q = q.ilike('full_name', `%${query.search}%`);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch users', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // GET /api/users/:id — get user profile
  fastify.get('/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    // Users can only view their own profile unless admin
    if (requester.role !== 'admin' && requester.userId !== id) {
      return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
    }

    const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', id).single();
    if (error || !data) return reply.status(404).send({ error: 'User not found', code: 'NOT_FOUND' });

    return reply.send({ user: data });
  });

  // PATCH /api/users/:id — update profile
  fastify.patch('/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    if (requester.role !== 'admin' && requester.userId !== id) {
      return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
    }

    const result = updateUserSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ ...result.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to update user', code: 'DB_ERROR' });
    return reply.send({ user: data });
  });

  // PATCH /api/users/:id/status — admin only: activate/deactivate
  fastify.patch('/:id/status', { preHandler: requireRole('admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const { is_active } = request.body as { is_active: boolean };

    if (typeof is_active !== 'boolean') {
      return reply.status(400).send({ error: 'is_active must be a boolean', code: 'VALIDATION_ERROR' });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to update status', code: 'DB_ERROR' });
    return reply.send({ user: data, message: `User ${is_active ? 'activated' : 'deactivated'}` });
  });
}
