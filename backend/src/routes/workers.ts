import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';

const updateProfileSchema = z.object({
  skills: z.array(z.enum(['coolie', 'mason', 'electrician', 'plumber', 'carpenter', 'painter', 'welder', 'helper'])).optional(),
  experience_years: z.number().int().min(0).optional(),
  daily_rate: z.number().positive().optional(),
  hourly_rate: z.number().positive().optional(),
  bio: z.string().max(500).optional(),
});

const availabilitySchema = z.object({
  status: z.enum(['working', 'waiting']),
});

export async function workerRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/workers — list available workers
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { skill?: string; status?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('worker_profiles')
      .select('*, users(id, full_name, phone, avatar_url, city, latitude, longitude)', { count: 'exact' })
      .order('rating', { ascending: false });

    if (query.status) {
      q = q.eq('status', query.status);
    } else {
      q = q.eq('status', 'waiting');
    }

    if (query.skill) {
      q = q.contains('skills', [query.skill]);
    }

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch workers', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // GET /api/workers/:id — worker profile
  fastify.get('/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    // Accept both user_id or worker_profile id
    let { data, error } = await supabaseAdmin
      .from('worker_profiles')
      .select('*, users(id, full_name, phone, avatar_url, address, city, latitude, longitude)')
      .eq('id', id)
      .single();

    if (!data) {
      // Try by user_id
      const res = await supabaseAdmin
        .from('worker_profiles')
        .select('*, users(id, full_name, phone, avatar_url, address, city, latitude, longitude)')
        .eq('user_id', id)
        .single();
      data = res.data;
      error = res.error;
    }

    if (error || !data) return reply.status(404).send({ error: 'Worker not found', code: 'NOT_FOUND' });
    return reply.send({ worker: data });
  });

  // PATCH /api/workers/availability — worker: toggle status
  fastify.patch('/availability', { preHandler: requireRole('worker') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    const result = availabilitySchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { data, error } = await supabaseAdmin
      .from('worker_profiles')
      .update({ status: result.data.status, updated_at: new Date().toISOString() })
      .eq('user_id', requester.userId)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to update availability', code: 'DB_ERROR' });
    return reply.send({ worker: data, message: `Status set to ${result.data.status}` });
  });

  // PATCH /api/workers/profile — worker: update profile
  fastify.patch('/profile', { preHandler: requireRole('worker') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    const result = updateProfileSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    // Upsert worker profile
    const { data: existing } = await supabaseAdmin
      .from('worker_profiles')
      .select('id')
      .eq('user_id', requester.userId)
      .single();

    let data, error;

    if (existing) {
      const res = await supabaseAdmin
        .from('worker_profiles')
        .update({ ...result.data, updated_at: new Date().toISOString() })
        .eq('user_id', requester.userId)
        .select()
        .single();
      data = res.data;
      error = res.error;
    } else {
      // Create new profile — require skills and daily_rate
      if (!result.data.skills || !result.data.daily_rate) {
        return reply.status(400).send({ error: 'skills and daily_rate required for new profile', code: 'VALIDATION_ERROR' });
      }
      const res = await supabaseAdmin
        .from('worker_profiles')
        .insert({ ...result.data, user_id: requester.userId })
        .select()
        .single();
      data = res.data;
      error = res.error;
    }

    if (error) return reply.status(500).send({ error: 'Failed to update worker profile', code: 'DB_ERROR' });
    return reply.send({ worker: data });
  });
}
