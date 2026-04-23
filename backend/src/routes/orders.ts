import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';
import { createOrder } from '../services/order.service.js';
import { createNotification } from '../services/notification.service.js';

const createOrderSchema = z.object({
  shop_id: z.string().uuid(),
  items: z.array(z.object({
    inventory_id: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  delivery_address: z.string().min(5),
  delivery_latitude: z.number().optional(),
  delivery_longitude: z.number().optional(),
  delivery_notes: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'processing', 'out_for_delivery', 'delivered', 'cancelled']),
  reason: z.string().optional(),
});

export async function orderRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /api/orders — customer: place order
  fastify.post('/', { preHandler: requireRole('customer', 'contractor', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;
    const result = createOrderSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    try {
      const order = await createOrder({
        customerId: requester.userId,
        shopId: result.data.shop_id,
        items: result.data.items,
        deliveryAddress: result.data.delivery_address,
        deliveryLatitude: result.data.delivery_latitude,
        deliveryLongitude: result.data.delivery_longitude,
        deliveryNotes: result.data.delivery_notes,
      });
      return reply.status(201).send({ order });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: 'ORDER_ERROR' });
    }
  });

  // GET /api/orders — list orders filtered by role
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;
    const query = request.query as { status?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('orders')
      .select('*, order_items(*, products(*)), shops(id, name)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (query.status) q = q.eq('status', query.status);

    if (requester.role === 'customer' || requester.role === 'contractor') {
      q = q.eq('customer_id', requester.userId);
    } else if (requester.role === 'shopkeeper') {
      const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', requester.userId).single();
      if (shop) q = q.eq('shop_id', shop.id);
    } else if (requester.role === 'driver') {
      q = q.eq('driver_id', requester.userId);
    }
    // admin sees all

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch orders', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // GET /api/orders/:id — order detail
  fastify.get('/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, products(*), inventory(*)), shops(id, name, address, phone), users!orders_customer_id_fkey(id, full_name, phone)')
      .eq('id', id)
      .single();

    if (error || !data) return reply.status(404).send({ error: 'Order not found', code: 'NOT_FOUND' });

    // Access control
    if (requester.role !== 'admin') {
      const isCustomer = data.customer_id === requester.userId;
      let isShopkeeper = false;
      if (requester.role === 'shopkeeper') {
        const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', requester.userId).single();
        isShopkeeper = shop?.id === data.shop_id;
      }
      const isDriver = data.driver_id === requester.userId;

      if (!isCustomer && !isShopkeeper && !isDriver) {
        return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
      }
    }

    return reply.send({ order: data });
  });

  // PATCH /api/orders/:id/status — update order status
  fastify.patch('/:id/status', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const result = updateStatusSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { data: order } = await supabaseAdmin.from('orders').select('*, shops(owner_id)').eq('id', id).single();
    if (!order) return reply.status(404).send({ error: 'Order not found', code: 'NOT_FOUND' });

    // Role-based status transition validation
    const { status } = result.data;
    const allowedTransitions: Record<string, string[]> = {
      shopkeeper: ['accepted', 'processing', 'cancelled'],
      driver: ['out_for_delivery', 'delivered'],
      customer: ['cancelled'],
      admin: ['pending', 'accepted', 'processing', 'out_for_delivery', 'delivered', 'cancelled'],
      contractor: ['cancelled'],
      worker: [],
    };

    const allowed = allowedTransitions[requester.role] || [];
    if (requester.role !== 'admin' && !allowed.includes(status)) {
      return reply.status(403).send({ error: `Role ${requester.role} cannot set status to ${status}`, code: 'FORBIDDEN' });
    }

    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (status === 'delivered') updateData.actual_delivery_time = new Date().toISOString();

    const { data: updated, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to update order status', code: 'DB_ERROR' });

    // Notify customer
    await createNotification({
      userId: order.customer_id,
      title: 'Order Status Updated',
      message: `Your order ${order.order_number} is now ${status}`,
      type: 'order',
      referenceType: 'order',
      referenceId: id,
    });

    return reply.send({ order: updated });
  });

  // GET /api/orders/:id/tracking — driver location for tracking
  fastify.get('/:id/tracking', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const { data: order } = await supabaseAdmin.from('orders').select('driver_id, status').eq('id', id).single();
    if (!order) return reply.status(404).send({ error: 'Order not found', code: 'NOT_FOUND' });

    if (!order.driver_id) {
      return reply.send({ tracking: null, message: 'No driver assigned yet' });
    }

    const { data: driver } = await supabaseAdmin
      .from('driver_profiles')
      .select('current_latitude, current_longitude, vehicle_type, vehicle_number, users!driver_profiles_user_id_fkey(full_name, phone)')
      .eq('user_id', order.driver_id)
      .single();

    return reply.send({
      tracking: {
        driver,
        order_status: order.status,
        estimated_minutes: 15,
      },
    });
  });
}
