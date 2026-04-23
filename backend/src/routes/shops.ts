import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';

const createShopSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  address: z.string().min(5),
  city: z.string().default('Hyderabad'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  opening_time: z.string().optional(),
  closing_time: z.string().optional(),
  delivery_radius_km: z.number().int().min(1).max(100).default(10),
});

const updateShopSchema = createShopSchema.partial();

export async function shopRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/shops/my — shopkeeper: their own shop (must be before /:id)
  fastify.get('/my', { preHandler: requireRole('shopkeeper', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    const { data, error } = await supabaseAdmin
      .from('shops')
      .select('*, inventory(*, products(*, categories(*)))')
      .eq('owner_id', requester.userId)
      .single();

    if (error || !data) return reply.status(404).send({ error: 'Shop not found', code: 'NOT_FOUND' });
    return reply.send({ shop: data });
  });

  // GET /api/shops — list shops
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { search?: string; city?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('shops')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (query.search) q = q.ilike('name', `%${query.search}%`);
    if (query.city) q = q.eq('city', query.city);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch shops', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // GET /api/shops/:id — shop detail + inventory
  fastify.get('/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const { data, error } = await supabaseAdmin
      .from('shops')
      .select('*, inventory(*, products(*, categories(*)))')
      .eq('id', id)
      .single();

    if (error || !data) return reply.status(404).send({ error: 'Shop not found', code: 'NOT_FOUND' });
    return reply.send({ shop: data });
  });

  // POST /api/shops — shopkeeper: create shop
  fastify.post('/', { preHandler: requireRole('shopkeeper', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;
    const result = createShopSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    // Check if shopkeeper already has a shop
    const { data: existing } = await supabaseAdmin
      .from('shops')
      .select('id')
      .eq('owner_id', requester.userId)
      .single();

    if (existing) {
      return reply.status(409).send({ error: 'Shopkeeper already has a shop', code: 'CONFLICT' });
    }

    const { data, error } = await supabaseAdmin
      .from('shops')
      .insert({ ...result.data, owner_id: requester.userId })
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to create shop', code: 'DB_ERROR' });
    return reply.status(201).send({ shop: data });
  });

  // PATCH /api/shops/:id — shopkeeper: update shop
  fastify.patch('/:id', { preHandler: requireRole('shopkeeper', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    // Verify ownership
    if (requester.role !== 'admin') {
      const { data: shop } = await supabaseAdmin.from('shops').select('owner_id').eq('id', id).single();
      if (!shop || shop.owner_id !== requester.userId) {
        return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
      }
    }

    const result = updateShopSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { data, error } = await supabaseAdmin
      .from('shops')
      .update({ ...result.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to update shop', code: 'DB_ERROR' });
    return reply.send({ shop: data });
  });
}
