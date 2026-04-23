import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';

const addInventorySchema = z.object({
  product_id: z.string().uuid(),
  price: z.number().positive(),
  stock_quantity: z.number().int().min(0).default(0),
  min_order_quantity: z.number().int().min(1).default(1),
  max_order_quantity: z.number().int().min(1).default(100),
  is_available: z.boolean().default(true),
});

const updateInventorySchema = z.object({
  price: z.number().positive().optional(),
  stock_quantity: z.number().int().min(0).optional(),
  min_order_quantity: z.number().int().min(1).optional(),
  max_order_quantity: z.number().int().min(1).optional(),
  is_available: z.boolean().optional(),
});

export async function productRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/products — list all products
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { category_id?: string; search?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '50'), 200);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('products')
      .select('*, categories(*)', { count: 'exact' })
      .order('name');

    if (query.category_id) q = q.eq('category_id', query.category_id);
    if (query.search) q = q.ilike('name', `%${query.search}%`);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch products', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // GET /api/products/:id — product detail
  fastify.get('/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .single();

    if (error || !data) return reply.status(404).send({ error: 'Product not found', code: 'NOT_FOUND' });
    return reply.send({ product: data });
  });

  // GET /api/inventory — list inventory
  fastify.get('/inventory', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { shop_id?: string; category_id?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '50'), 200);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('inventory')
      .select('*, shops(id, name, address), products(*, categories(*))', { count: 'exact' })
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (query.shop_id) q = q.eq('shop_id', query.shop_id);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch inventory', code: 'DB_ERROR' });

    let result = data;
    if (query.category_id && result) {
      result = result.filter((item: any) => item.products?.category_id === query.category_id);
    }

    return reply.send({ data: result, total: count, page, limit });
  });

  // POST /api/inventory — shopkeeper: add product to inventory
  fastify.post('/inventory', { preHandler: requireRole('shopkeeper', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    const result = addInventorySchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    // Get shopkeeper's shop
    const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', requester.userId).single();
    if (!shop && requester.role !== 'admin') {
      return reply.status(404).send({ error: 'No shop found for this user', code: 'NOT_FOUND' });
    }

    const shopId = shop?.id;

    const { data, error } = await supabaseAdmin
      .from('inventory')
      .insert({ ...result.data, shop_id: shopId })
      .select('*, products(*, categories(*))')
      .single();

    if (error) {
      if (error.code === '23505') {
        return reply.status(409).send({ error: 'Product already in inventory', code: 'CONFLICT' });
      }
      return reply.status(500).send({ error: 'Failed to add inventory', code: 'DB_ERROR' });
    }

    return reply.status(201).send({ inventory: data });
  });

  // PATCH /api/inventory/:id — shopkeeper: update price/stock
  fastify.patch('/inventory/:id', { preHandler: requireRole('shopkeeper', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    if (requester.role !== 'admin') {
      const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', requester.userId).single();
      if (!shop) return reply.status(403).send({ error: 'No shop found', code: 'FORBIDDEN' });

      const { data: inv } = await supabaseAdmin.from('inventory').select('shop_id').eq('id', id).single();
      if (!inv || inv.shop_id !== shop.id) {
        return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
      }
    }

    const result = updateInventorySchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { data, error } = await supabaseAdmin
      .from('inventory')
      .update({ ...result.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, products(*)')
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to update inventory', code: 'DB_ERROR' });
    return reply.send({ inventory: data });
  });

  // DELETE /api/inventory/:id — shopkeeper: remove product
  fastify.delete('/inventory/:id', { preHandler: requireRole('shopkeeper', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    if (requester.role !== 'admin') {
      const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', requester.userId).single();
      if (!shop) return reply.status(403).send({ error: 'No shop found', code: 'FORBIDDEN' });

      const { data: inv } = await supabaseAdmin.from('inventory').select('shop_id').eq('id', id).single();
      if (!inv || inv.shop_id !== shop.id) {
        return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
      }
    }

    const { error } = await supabaseAdmin.from('inventory').delete().eq('id', id);
    if (error) return reply.status(500).send({ error: 'Failed to delete inventory item', code: 'DB_ERROR' });

    return reply.send({ message: 'Inventory item removed' });
  });
}
