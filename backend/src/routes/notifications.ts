import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';
import { createNotificationForRole, createNotificationForAll } from '../services/notification.service.js';

const broadcastSchema = z.object({
  title: z.string().min(3).max(100),
  message: z.string().min(3),
  type: z.string().optional(),
  target: z.enum(['all', 'customer', 'worker', 'shopkeeper', 'driver', 'contractor']).default('all'),
});

export async function notificationRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/notifications — my notifications
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;
    const query = request.query as { unread?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', requester.userId)
      .order('created_at', { ascending: false });

    if (query.unread === 'true') q = q.eq('is_read', false);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch notifications', code: 'DB_ERROR' });

    const unreadCount = data?.filter((n: any) => !n.is_read).length ?? 0;
    return reply.send({ data, total: count, unread_count: unreadCount, page, limit });
  });

  // PATCH /api/notifications/read-all — mark all read (must be before /:id)
  fastify.patch('/read-all', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', requester.userId)
      .eq('is_read', false);

    if (error) return reply.status(500).send({ error: 'Failed to mark notifications', code: 'DB_ERROR' });
    return reply.send({ message: 'All notifications marked as read' });
  });

  // PATCH /api/notifications/:id/read — mark single as read
  fastify.patch('/:id/read', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', requester.userId)
      .select()
      .single();

    if (error || !data) return reply.status(404).send({ error: 'Notification not found', code: 'NOT_FOUND' });
    return reply.send({ notification: data });
  });

  // POST /api/notifications/broadcast — admin only
  fastify.post('/broadcast', { preHandler: requireRole('admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const result = broadcastSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    try {
      if (result.data.target === 'all') {
        await createNotificationForAll(result.data.title, result.data.message, result.data.type);
      } else {
        await createNotificationForRole(result.data.target, result.data.title, result.data.message, result.data.type);
      }
      return reply.send({ message: `Broadcast sent to ${result.data.target}` });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message, code: 'NOTIFICATION_ERROR' });
    }
  });
}
