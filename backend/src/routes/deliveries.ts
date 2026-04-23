import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';
import { createNotification } from '../services/notification.service.js';

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const deliverSchema = z.object({
  proof_photo_url: z.string().url().optional(),
  notes: z.string().optional(),
});

export async function deliveryRoutes(fastify: FastifyInstance): Promise<void> {
  // PATCH /api/deliveries/location — driver: update GPS location (must be before /:id routes)
  fastify.patch('/location', { preHandler: requireRole('driver') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    const result = locationSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { error } = await supabaseAdmin
      .from('driver_profiles')
      .update({
        current_latitude: result.data.latitude,
        current_longitude: result.data.longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', requester.userId);

    if (error) return reply.status(500).send({ error: 'Failed to update location', code: 'DB_ERROR' });
    return reply.send({ message: 'Location updated' });
  });

  // GET /api/deliveries — driver: available + active deliveries
  fastify.get('/', { preHandler: requireRole('driver', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;
    const query = request.query as { type?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    // Available orders (accepted/processing with no driver)
    if (query.type === 'available') {
      const { data, error, count } = await supabaseAdmin
        .from('orders')
        .select('*, shops(id, name, address, latitude, longitude)', { count: 'exact' })
        .in('status', ['accepted', 'processing'])
        .is('driver_id', null)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) return reply.status(500).send({ error: 'Failed to fetch deliveries', code: 'DB_ERROR' });
      return reply.send({ data, total: count, page, limit });
    }

    // Active deliveries for this driver
    const { data, error, count } = await supabaseAdmin
      .from('orders')
      .select('*, shops(id, name, address, latitude, longitude)', { count: 'exact' })
      .eq('driver_id', requester.userId)
      .in('status', ['out_for_delivery', 'processing'])
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return reply.status(500).send({ error: 'Failed to fetch deliveries', code: 'DB_ERROR' });
    return reply.send({ data, total: count, page, limit });
  });

  // PATCH /api/deliveries/:id/accept — driver: accept delivery
  fastify.patch('/:id/accept', { preHandler: requireRole('driver') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data: order } = await supabaseAdmin.from('orders').select('*').eq('id', id).single();
    if (!order) return reply.status(404).send({ error: 'Order not found', code: 'NOT_FOUND' });
    if (!['accepted', 'processing'].includes(order.status)) {
      return reply.status(400).send({ error: 'Order not available for pickup', code: 'INVALID_STATE' });
    }
    if (order.driver_id) {
      return reply.status(409).send({ error: 'Order already has a driver', code: 'CONFLICT' });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ driver_id: requester.userId, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to accept delivery', code: 'DB_ERROR' });

    await createNotification({
      userId: order.customer_id,
      title: 'Driver Assigned',
      message: `A driver has been assigned to your order ${order.order_number}`,
      type: 'delivery',
      referenceType: 'order',
      referenceId: id,
    });

    return reply.send({ order: data });
  });

  // PATCH /api/deliveries/:id/pickup — driver: mark picked up
  fastify.patch('/:id/pickup', { preHandler: requireRole('driver') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('driver_id', requester.userId)
      .single();

    if (!order) return reply.status(404).send({ error: 'Order not found or not assigned to you', code: 'NOT_FOUND' });

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status: 'out_for_delivery', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to update pickup status', code: 'DB_ERROR' });

    await createNotification({
      userId: order.customer_id,
      title: 'Order Picked Up',
      message: `Your order ${order.order_number} has been picked up and is on its way`,
      type: 'delivery',
      referenceType: 'order',
      referenceId: id,
    });

    return reply.send({ order: data });
  });

  // PATCH /api/deliveries/:id/deliver — driver: mark delivered
  fastify.patch('/:id/deliver', { preHandler: requireRole('driver') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const result = deliverSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('driver_id', requester.userId)
      .single();

    if (!order) return reply.status(404).send({ error: 'Order not found or not assigned to you', code: 'NOT_FOUND' });
    if (order.status !== 'out_for_delivery') {
      return reply.status(400).send({ error: 'Order must be out for delivery first', code: 'INVALID_STATE' });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'delivered',
        actual_delivery_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to mark as delivered', code: 'DB_ERROR' });

    // Update driver stats
    await supabaseAdmin
      .from('driver_profiles')
      .update({
        total_deliveries: supabaseAdmin.rpc('increment', { x: 1 }) as any,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', requester.userId);

    await createNotification({
      userId: order.customer_id,
      title: 'Order Delivered',
      message: `Your order ${order.order_number} has been delivered successfully!`,
      type: 'delivery',
      referenceType: 'order',
      referenceId: id,
    });

    return reply.send({ order: data, message: 'Delivery completed successfully' });
  });
}
