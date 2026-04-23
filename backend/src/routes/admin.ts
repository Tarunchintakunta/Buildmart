import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { requireRole } from '../middleware/auth.js';

const rejectSchema = z.object({
  reason: z.string().min(5),
});

const resolveDisputeSchema = z.object({
  resolution: z.string().min(5),
  in_favor_of: z.string().uuid(),
});

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  // All admin routes require admin role
  fastify.addHook('preHandler', requireRole('admin'));

  // GET /api/admin/dashboard — platform stats
  fastify.get('/dashboard', async (_request: FastifyRequest, reply: FastifyReply) => {
    const [
      { count: totalUsers },
      { count: totalOrders },
      { count: pendingOrders },
      { count: totalWorkers },
      { count: activeShops },
      { count: laborRequests },
    ] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('worker_profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('shops').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabaseAdmin.from('labor_requests').select('*', { count: 'exact', head: true }),
    ]);

    // Revenue: sum of all delivered orders
    const { data: revenueData } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .eq('status', 'delivered');

    const totalRevenue = revenueData?.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0) ?? 0;

    // Users by role
    const { data: usersByRole } = await supabaseAdmin
      .from('users')
      .select('role')
      .then(async ({ data }) => {
        const grouped: Record<string, number> = {};
        data?.forEach((u: any) => { grouped[u.role] = (grouped[u.role] || 0) + 1; });
        return { data: grouped };
      });

    return reply.send({
      stats: {
        total_users: totalUsers,
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        total_workers: totalWorkers,
        active_shops: activeShops,
        labor_requests: laborRequests,
        total_revenue_inr: totalRevenue,
      },
      users_by_role: usersByRole,
    });
  });

  // GET /api/admin/users — all users
  fastify.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { role?: string; search?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (query.role) q = q.eq('role', query.role);
    if (query.search) q = q.or(`full_name.ilike.%${query.search}%,phone.ilike.%${query.search}%`);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch users', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // GET /api/admin/verifications — KYC queue
  fastify.get('/verifications', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { status?: string };

    let q = supabaseAdmin
      .from('verifications')
      .select('*, users!verifications_worker_id_fkey(id, full_name, phone, role)')
      .order('submitted_at', { ascending: true });

    if (query.status) {
      q = q.eq('status', query.status);
    } else {
      q = q.eq('status', 'pending');
    }

    const { data, error } = await q;
    if (error) return reply.status(500).send({ error: 'Failed to fetch verifications', code: 'DB_ERROR' });

    return reply.send({ data });
  });

  // PATCH /api/admin/verifications/:id/approve
  fastify.patch('/verifications/:id/approve', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const { data: verification } = await supabaseAdmin.from('verifications').select('*').eq('id', id).single();
    if (!verification) return reply.status(404).send({ error: 'Verification not found', code: 'NOT_FOUND' });

    const { data, error } = await supabaseAdmin
      .from('verifications')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to approve', code: 'DB_ERROR' });

    // Mark worker as verified
    await supabaseAdmin.from('worker_profiles').update({ is_verified: true }).eq('user_id', verification.worker_id);

    return reply.send({ verification: data, message: 'Verification approved' });
  });

  // PATCH /api/admin/verifications/:id/reject
  fastify.patch('/verifications/:id/reject', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const result = rejectSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Rejection reason required', code: 'VALIDATION_ERROR' });
    }

    const { data, error } = await supabaseAdmin
      .from('verifications')
      .update({
        status: 'rejected',
        review_notes: result.data.reason,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to reject', code: 'DB_ERROR' });
    return reply.send({ verification: data, message: 'Verification rejected' });
  });

  // GET /api/admin/orders — all platform orders
  fastify.get('/orders', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { status?: string; shop_id?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('orders')
      .select('*, shops(id, name), users!orders_customer_id_fkey(id, full_name, phone)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (query.status) q = q.eq('status', query.status);
    if (query.shop_id) q = q.eq('shop_id', query.shop_id);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch orders', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // GET /api/admin/disputes — disputes list (cancelled orders with notes)
  fastify.get('/disputes', async (request: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, shops(id, name), users!orders_customer_id_fkey(id, full_name, phone)')
      .eq('status', 'cancelled')
      .order('updated_at', { ascending: false });

    if (error) return reply.status(500).send({ error: 'Failed to fetch disputes', code: 'DB_ERROR' });
    return reply.send({ data });
  });

  // PATCH /api/admin/disputes/:id/resolve
  fastify.patch('/disputes/:id/resolve', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const result = resolveDisputeSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    // For now, just record the resolution in delivery_notes field
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ delivery_notes: `RESOLVED: ${result.data.resolution}`, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to resolve dispute', code: 'DB_ERROR' });
    return reply.send({ order: data, message: 'Dispute resolved' });
  });

  // GET /api/admin/analytics — revenue, GMV, trends
  fastify.get('/analytics', async (_request: FastifyRequest, reply: FastifyReply) => {
    // Orders by status
    const { data: orderStats } = await supabaseAdmin
      .from('orders')
      .select('status, total_amount');

    const statusBreakdown: Record<string, { count: number; revenue: number }> = {};
    orderStats?.forEach((o: any) => {
      if (!statusBreakdown[o.status]) statusBreakdown[o.status] = { count: 0, revenue: 0 };
      statusBreakdown[o.status].count++;
      statusBreakdown[o.status].revenue += parseFloat(o.total_amount);
    });

    // Labor requests by status
    const { data: laborStats } = await supabaseAdmin
      .from('labor_requests')
      .select('status, offered_rate');

    const laborBreakdown: Record<string, { count: number; value: number }> = {};
    laborStats?.forEach((l: any) => {
      if (!laborBreakdown[l.status]) laborBreakdown[l.status] = { count: 0, value: 0 };
      laborBreakdown[l.status].count++;
      laborBreakdown[l.status].value += parseFloat(l.offered_rate);
    });

    // Top shops
    const { data: topShops } = await supabaseAdmin
      .from('orders')
      .select('shop_id, shops(name)')
      .eq('status', 'delivered');

    const shopRevenue: Record<string, { name: string; orders: number }> = {};
    topShops?.forEach((o: any) => {
      const key = o.shop_id;
      if (!shopRevenue[key]) shopRevenue[key] = { name: o.shops?.name, orders: 0 };
      shopRevenue[key].orders++;
    });

    const gmv = orderStats?.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0) ?? 0;
    const deliveredRevenue = statusBreakdown['delivered']?.revenue ?? 0;

    return reply.send({
      analytics: {
        gmv_inr: gmv,
        delivered_revenue_inr: deliveredRevenue,
        orders_by_status: statusBreakdown,
        labor_by_status: laborBreakdown,
        top_shops: Object.entries(shopRevenue)
          .sort((a, b) => b[1].orders - a[1].orders)
          .slice(0, 5)
          .map(([id, val]) => ({ shop_id: id, ...val })),
      },
    });
  });
}
