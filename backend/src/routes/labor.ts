import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';
import { generateOrderNumber } from '../services/auth.service.js';
import { holdFunds, releaseFunds, refundHeldFunds } from '../services/wallet.service.js';
import { createNotification } from '../services/notification.service.js';

const createLaborSchema = z.object({
  worker_id: z.string().uuid().optional(),
  skill_required: z.enum(['coolie', 'mason', 'electrician', 'plumber', 'carpenter', 'painter', 'welder', 'helper']),
  description: z.string().optional(),
  work_address: z.string().min(5),
  work_latitude: z.number().optional(),
  work_longitude: z.number().optional(),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scheduled_time: z.string().regex(/^\d{2}:\d{2}$/),
  duration_hours: z.number().int().min(1).max(24).default(2),
  offered_rate: z.number().positive(),
});

const rateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function laborRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /api/labor — create labor request
  fastify.post('/', { preHandler: requireRole('customer', 'contractor', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;
    const result = createLaborSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const requestNumber = generateOrderNumber('LR');

    const { data, error } = await supabaseAdmin
      .from('labor_requests')
      .insert({
        ...result.data,
        request_number: requestNumber,
        customer_id: requester.userId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to create labor request', code: 'DB_ERROR' });

    // Notify worker if specified
    if (result.data.worker_id) {
      await createNotification({
        userId: result.data.worker_id,
        title: 'New Labor Request',
        message: `You have a new ${result.data.skill_required} job request for ₹${result.data.offered_rate}/day`,
        type: 'labor',
        referenceType: 'labor_request',
        referenceId: data.id,
      });
    }

    return reply.status(201).send({ labor_request: data });
  });

  // GET /api/labor — list labor requests
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;
    const query = request.query as { status?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('labor_requests')
      .select('*, users!labor_requests_customer_id_fkey(id, full_name, phone)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (query.status) q = q.eq('status', query.status);

    if (requester.role === 'worker') {
      q = q.eq('worker_id', requester.userId);
    } else if (requester.role !== 'admin') {
      q = q.eq('customer_id', requester.userId);
    }

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch labor requests', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // GET /api/labor/:id — detail
  fastify.get('/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data, error } = await supabaseAdmin
      .from('labor_requests')
      .select('*, users!labor_requests_customer_id_fkey(id, full_name, phone), worker:users!labor_requests_worker_id_fkey(id, full_name, phone)')
      .eq('id', id)
      .single();

    if (error || !data) return reply.status(404).send({ error: 'Labor request not found', code: 'NOT_FOUND' });

    if (requester.role !== 'admin' && data.customer_id !== requester.userId && data.worker_id !== requester.userId) {
      return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
    }

    return reply.send({ labor_request: data });
  });

  // PATCH /api/labor/:id/accept — worker: accept
  fastify.patch('/:id/accept', { preHandler: requireRole('worker') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data: req } = await supabaseAdmin.from('labor_requests').select('*').eq('id', id).single();
    if (!req) return reply.status(404).send({ error: 'Labor request not found', code: 'NOT_FOUND' });
    if (req.status !== 'pending') return reply.status(400).send({ error: 'Request is not in pending state', code: 'INVALID_STATE' });

    // Hold funds from customer
    try {
      await holdFunds(req.customer_id, req.offered_rate, 'labor_request', id, `Hold for labor request ${req.request_number}`);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: 'WALLET_ERROR' });
    }

    const { data, error } = await supabaseAdmin
      .from('labor_requests')
      .update({ status: 'accepted', worker_id: requester.userId, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to accept request', code: 'DB_ERROR' });

    await createNotification({
      userId: req.customer_id,
      title: 'Labor Request Accepted',
      message: `Your labor request ${req.request_number} has been accepted`,
      type: 'labor',
      referenceType: 'labor_request',
      referenceId: id,
    });

    return reply.send({ labor_request: data });
  });

  // PATCH /api/labor/:id/decline — worker: decline
  fastify.patch('/:id/decline', { preHandler: requireRole('worker') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const { data: req } = await supabaseAdmin.from('labor_requests').select('*').eq('id', id).single();
    if (!req) return reply.status(404).send({ error: 'Labor request not found', code: 'NOT_FOUND' });
    if (req.status !== 'pending') return reply.status(400).send({ error: 'Request is not in pending state', code: 'INVALID_STATE' });

    const { data, error } = await supabaseAdmin
      .from('labor_requests')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to decline request', code: 'DB_ERROR' });

    await createNotification({
      userId: req.customer_id,
      title: 'Labor Request Declined',
      message: `Your labor request ${req.request_number} was declined by the worker`,
      type: 'labor',
      referenceType: 'labor_request',
      referenceId: id,
    });

    return reply.send({ labor_request: data });
  });

  // PATCH /api/labor/:id/start — worker: mark started
  fastify.patch('/:id/start', { preHandler: requireRole('worker') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data: req } = await supabaseAdmin.from('labor_requests').select('*').eq('id', id).eq('worker_id', requester.userId).single();
    if (!req) return reply.status(404).send({ error: 'Labor request not found', code: 'NOT_FOUND' });
    if (req.status !== 'accepted') return reply.status(400).send({ error: 'Request must be accepted first', code: 'INVALID_STATE' });

    const { data, error } = await supabaseAdmin
      .from('labor_requests')
      .update({ status: 'in_progress', started_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to start request', code: 'DB_ERROR' });

    await createNotification({
      userId: req.customer_id,
      title: 'Work Started',
      message: `Work on your labor request ${req.request_number} has started`,
      type: 'labor',
      referenceType: 'labor_request',
      referenceId: id,
    });

    return reply.send({ labor_request: data });
  });

  // PATCH /api/labor/:id/complete — worker: mark complete
  fastify.patch('/:id/complete', { preHandler: requireRole('worker') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data: req } = await supabaseAdmin.from('labor_requests').select('*').eq('id', id).eq('worker_id', requester.userId).single();
    if (!req) return reply.status(404).send({ error: 'Labor request not found', code: 'NOT_FOUND' });
    if (req.status !== 'in_progress') return reply.status(400).send({ error: 'Request must be in progress', code: 'INVALID_STATE' });

    // Release held funds to worker
    try {
      await releaseFunds(
        req.customer_id,
        req.worker_id,
        req.offered_rate,
        'labor_request',
        id,
        `Payment for labor request ${req.request_number}`
      );
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: 'WALLET_ERROR' });
    }

    const { data, error } = await supabaseAdmin
      .from('labor_requests')
      .update({ status: 'completed', completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to complete request', code: 'DB_ERROR' });

    // Update worker stats
    await supabaseAdmin.rpc('increment_worker_jobs', { worker_user_id: requester.userId });

    await createNotification({
      userId: req.customer_id,
      title: 'Work Completed',
      message: `Your labor request ${req.request_number} has been completed. ₹${req.offered_rate} released to worker.`,
      type: 'labor',
      referenceType: 'labor_request',
      referenceId: id,
    });

    return reply.send({ labor_request: data });
  });

  // POST /api/labor/:id/rate — both sides rate each other
  fastify.post('/:id/rate', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const result = rateSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const { data: req } = await supabaseAdmin.from('labor_requests').select('*').eq('id', id).single();
    if (!req) return reply.status(404).send({ error: 'Labor request not found', code: 'NOT_FOUND' });
    if (req.status !== 'completed') return reply.status(400).send({ error: 'Can only rate completed requests', code: 'INVALID_STATE' });

    let updateField: string;
    if (req.customer_id === requester.userId) {
      updateField = 'customer_rating';
    } else if (req.worker_id === requester.userId) {
      updateField = 'worker_rating';
    } else {
      return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
    }

    const { data, error } = await supabaseAdmin
      .from('labor_requests')
      .update({ [updateField]: result.data.rating, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to submit rating', code: 'DB_ERROR' });
    return reply.send({ labor_request: data, message: 'Rating submitted' });
  });
}
