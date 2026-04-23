import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { requireRole } from '../middleware/auth.js';
import { createNotification, createNotificationForRole, createNotificationForAll } from '../services/notification.service.js';
import { JWTPayload, UserRole } from '../types/index.js';

const rejectSchema = z.object({
  reason: z.string().min(5),
});

const toggleStatusSchema = z.object({
  is_active: z.boolean(),
});

const broadcastSchema = z.object({
  title: z.string().min(1).max(100),
  message: z.string().min(1),
  role: z.enum(['customer', 'contractor', 'worker', 'shopkeeper', 'driver', 'admin']).optional(),
});

const analyticsRangeSchema = z.object({
  range: z.enum(['7d', '30d', '90d']).default('30d'),
});

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  // All admin routes require admin role
  fastify.addHook('preHandler', requireRole('admin'));

  // ─── GET /api/admin/dashboard ────────────────────────────────────────────────
  fastify.get('/dashboard', async (_request: FastifyRequest, reply: FastifyReply) => {
    const [
      { data: allUsers },
      { count: totalOrders },
      { count: totalLaborRequests },
      { count: activeAgreements },
      { count: pendingVerifications },
    ] = await Promise.all([
      supabaseAdmin.from('users').select('role, is_active'),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('labor_requests').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('agreements').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseAdmin.from('verifications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    // Users by role
    const usersByRole: Record<string, number> = {};
    let totalUsers = 0;
    allUsers?.forEach((u: any) => {
      usersByRole[u.role] = (usersByRole[u.role] || 0) + 1;
      totalUsers++;
    });

    // Revenue: sum of all order totals (GMV) and delivered revenue
    const { data: orderFinancials } = await supabaseAdmin
      .from('orders')
      .select('total_amount, status');

    let platformGmv = 0;
    let totalRevenue = 0;
    orderFinancials?.forEach((o: any) => {
      const amt = parseFloat(o.total_amount) || 0;
      platformGmv += amt;
      if (o.status === 'delivered') totalRevenue += amt;
    });

    // Recent orders (last 5)
    const { data: recentOrders } = await supabaseAdmin
      .from('orders')
      .select('*, shops(id, name), users!orders_customer_id_fkey(id, full_name, phone)')
      .order('created_at', { ascending: false })
      .limit(5);

    // Recent signups (last 5)
    const { data: recentSignups } = await supabaseAdmin
      .from('users')
      .select('id, full_name, phone, role, city, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    return reply.send({
      stats: {
        total_users: totalUsers,
        users_by_role: usersByRole,
        total_orders: totalOrders,
        total_revenue_inr: totalRevenue,
        platform_gmv: platformGmv,
        total_labor_requests: totalLaborRequests,
        active_agreements: activeAgreements,
        pending_verifications: pendingVerifications,
      },
      recent_orders: recentOrders || [],
      recent_signups: recentSignups || [],
    });
  });

  // ─── GET /api/admin/users ────────────────────────────────────────────────────
  fastify.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      role?: string;
      search?: string;
      page?: string;
      limit?: string;
      is_active?: string;
    };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (query.role) q = q.eq('role', query.role);
    if (query.is_active !== undefined) q = q.eq('is_active', query.is_active === 'true');
    if (query.search) {
      q = q.or(`full_name.ilike.%${query.search}%,phone.ilike.%${query.search}%,email.ilike.%${query.search}%`);
    }

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch users', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // ─── PATCH /api/admin/users/:id/status ──────────────────────────────────────
  fastify.patch('/users/:id/status', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const result = toggleStatusSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { data: user } = await supabaseAdmin.from('users').select('id, full_name, is_active').eq('id', id).single();
    if (!user) return reply.status(404).send({ error: 'User not found', code: 'NOT_FOUND' });

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ is_active: result.data.is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to update user status', code: 'DB_ERROR' });

    // Notify user about account status change
    const statusText = result.data.is_active ? 'activated' : 'deactivated';
    await createNotification({
      userId: id,
      title: `Account ${result.data.is_active ? 'Activated' : 'Deactivated'}`,
      message: `Your BuildMart account has been ${statusText} by the admin.${result.data.is_active ? ' You can now log in and use the platform.' : ' Please contact support if you have questions.'}`,
      type: 'system',
    });

    return reply.send({ user: data, message: `User ${statusText} successfully` });
  });

  // ─── GET /api/admin/verifications ───────────────────────────────────────────
  fastify.get('/verifications', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { status?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('verifications')
      .select('*, users!verifications_worker_id_fkey(id, full_name, phone, role, city)', { count: 'exact' })
      .order('submitted_at', { ascending: true });

    const status = query.status || 'pending';
    q = q.eq('status', status);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch verifications', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // ─── PATCH /api/admin/verifications/:id/approve ──────────────────────────────
  fastify.patch('/verifications/:id/approve', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data: verification } = await supabaseAdmin.from('verifications').select('*').eq('id', id).single();
    if (!verification) return reply.status(404).send({ error: 'Verification not found', code: 'NOT_FOUND' });
    if (verification.status !== 'pending') {
      return reply.status(400).send({ error: 'Verification is not in pending state', code: 'INVALID_STATE' });
    }

    const { data, error } = await supabaseAdmin
      .from('verifications')
      .update({
        status: 'approved',
        reviewed_by: requester.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to approve verification', code: 'DB_ERROR' });

    // Mark worker as verified
    await supabaseAdmin
      .from('worker_profiles')
      .update({ is_verified: true, updated_at: new Date().toISOString() })
      .eq('user_id', verification.worker_id);

    // Notify worker
    await createNotification({
      userId: verification.worker_id,
      title: 'KYC Approved',
      message: 'Your KYC has been approved! You can now receive job requests.',
      type: 'verification',
      referenceType: 'verification',
      referenceId: id,
    });

    return reply.send({ verification: data, message: 'Verification approved successfully' });
  });

  // ─── PATCH /api/admin/verifications/:id/reject ───────────────────────────────
  fastify.patch('/verifications/:id/reject', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const result = rejectSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Rejection reason required (min 5 chars)', code: 'VALIDATION_ERROR' });
    }

    const { data: verification } = await supabaseAdmin.from('verifications').select('*').eq('id', id).single();
    if (!verification) return reply.status(404).send({ error: 'Verification not found', code: 'NOT_FOUND' });

    const { data, error } = await supabaseAdmin
      .from('verifications')
      .update({
        status: 'rejected',
        review_notes: result.data.reason,
        reviewed_by: requester.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to reject verification', code: 'DB_ERROR' });

    // Notify worker
    await createNotification({
      userId: verification.worker_id,
      title: 'KYC Rejected',
      message: `Your KYC was rejected. Reason: ${result.data.reason}`,
      type: 'verification',
      referenceType: 'verification',
      referenceId: id,
    });

    return reply.send({ verification: data, message: 'Verification rejected' });
  });

  // ─── GET /api/admin/orders ───────────────────────────────────────────────────
  fastify.get('/orders', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { status?: string; shop_id?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('orders')
      .select('*, shops(id, name, address), users!orders_customer_id_fkey(id, full_name, phone)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (query.status) q = q.eq('status', query.status);
    if (query.shop_id) q = q.eq('shop_id', query.shop_id);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch orders', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // ─── GET /api/admin/disputes ─────────────────────────────────────────────────
  fastify.get('/disputes', async (_request: FastifyRequest, reply: FastifyReply) => {
    const [
      { data: cancelledOrders, error: ordersErr },
      { data: cancelledLabor, error: laborErr },
    ] = await Promise.all([
      supabaseAdmin
        .from('orders')
        .select('*, shops(id, name), users!orders_customer_id_fkey(id, full_name, phone)')
        .eq('status', 'cancelled')
        .order('updated_at', { ascending: false }),
      supabaseAdmin
        .from('labor_requests')
        .select('*, users!labor_requests_customer_id_fkey(id, full_name, phone), worker:users!labor_requests_worker_id_fkey(id, full_name, phone)')
        .eq('status', 'cancelled')
        .order('updated_at', { ascending: false }),
    ]);

    if (ordersErr || laborErr) {
      return reply.status(500).send({ error: 'Failed to fetch disputes', code: 'DB_ERROR' });
    }

    return reply.send({
      cancelled_orders: cancelledOrders || [],
      cancelled_labor_requests: cancelledLabor || [],
      total_disputes: (cancelledOrders?.length || 0) + (cancelledLabor?.length || 0),
    });
  });

  // ─── GET /api/admin/analytics?range=7d|30d|90d ──────────────────────────────
  fastify.get('/analytics', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = analyticsRangeSchema.safeParse(request.query);
    const range = parseResult.success ? parseResult.data.range : '30d';
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceIso = since.toISOString();

    // Fetch orders in range
    const { data: ordersInRange } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, status, created_at, shop_id, shops(name)')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: true });

    // Build daily_orders map
    const dailyOrdersMap: Record<string, { count: number; revenue: number }> = {};
    ordersInRange?.forEach((o: any) => {
      const date = o.created_at.slice(0, 10);
      if (!dailyOrdersMap[date]) dailyOrdersMap[date] = { count: 0, revenue: 0 };
      dailyOrdersMap[date].count++;
      dailyOrdersMap[date].revenue += parseFloat(o.total_amount) || 0;
    });
    const dailyOrders = Object.entries(dailyOrdersMap)
      .map(([date, val]) => ({ date, ...val }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Fetch signups in range
    const { data: signupsInRange } = await supabaseAdmin
      .from('users')
      .select('id, created_at')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: true });

    const dailySignupsMap: Record<string, number> = {};
    signupsInRange?.forEach((u: any) => {
      const date = u.created_at.slice(0, 10);
      dailySignupsMap[date] = (dailySignupsMap[date] || 0) + 1;
    });
    const dailySignups = Object.entries(dailySignupsMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top 5 shops by order count
    const shopOrderCount: Record<string, { name: string; count: number; revenue: number }> = {};
    ordersInRange?.forEach((o: any) => {
      if (!shopOrderCount[o.shop_id]) {
        shopOrderCount[o.shop_id] = { name: o.shops?.name || 'Unknown', count: 0, revenue: 0 };
      }
      shopOrderCount[o.shop_id].count++;
      shopOrderCount[o.shop_id].revenue += parseFloat(o.total_amount) || 0;
    });
    const topShops = Object.entries(shopOrderCount)
      .map(([shop_id, val]) => ({ shop_id, ...val }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top 5 workers by completed jobs in range
    const { data: completedLabor } = await supabaseAdmin
      .from('labor_requests')
      .select('worker_id, offered_rate, worker:users!labor_requests_worker_id_fkey(full_name)')
      .eq('status', 'completed')
      .gte('completed_at', sinceIso);

    const workerJobCount: Record<string, { name: string; jobs: number; earnings: number }> = {};
    completedLabor?.forEach((l: any) => {
      if (!l.worker_id) return;
      if (!workerJobCount[l.worker_id]) {
        workerJobCount[l.worker_id] = { name: (l.worker as any)?.full_name || 'Unknown', jobs: 0, earnings: 0 };
      }
      workerJobCount[l.worker_id].jobs++;
      workerJobCount[l.worker_id].earnings += parseFloat(l.offered_rate) || 0;
    });
    const topWorkers = Object.entries(workerJobCount)
      .map(([worker_id, val]) => ({ worker_id, ...val }))
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 5);

    // Revenue breakdown: orders by status
    const { data: allOrders } = await supabaseAdmin
      .from('orders')
      .select('status, total_amount');

    const revenueByStatus: Record<string, { count: number; revenue: number }> = {};
    allOrders?.forEach((o: any) => {
      if (!revenueByStatus[o.status]) revenueByStatus[o.status] = { count: 0, revenue: 0 };
      revenueByStatus[o.status].count++;
      revenueByStatus[o.status].revenue += parseFloat(o.total_amount) || 0;
    });

    return reply.send({
      range,
      analytics: {
        daily_orders: dailyOrders,
        daily_signups: dailySignups,
        top_shops: topShops,
        top_workers: topWorkers,
        revenue_by_status: revenueByStatus,
      },
    });
  });

  // ─── POST /api/admin/notifications/broadcast ─────────────────────────────────
  fastify.post('/notifications/broadcast', async (request: FastifyRequest, reply: FastifyReply) => {
    const result = broadcastSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { title, message, role } = result.data;

    if (role) {
      await createNotificationForRole(role, title, message, 'broadcast');
    } else {
      await createNotificationForAll(title, message, 'broadcast');
    }

    return reply.send({
      message: `Broadcast sent to ${role ? `all ${role}s` : 'all users'}`,
      notification: { title, message, role: role || 'all' },
    });
  });
}
