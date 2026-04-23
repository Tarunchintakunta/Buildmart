import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';
import { generateOrderNumber } from '../services/auth.service.js';
import { createNotification } from '../services/notification.service.js';

const createAgreementSchema = z.object({
  worker_id: z.string().uuid(),
  title: z.string().min(3).max(100),
  scope_of_work: z.string().min(10),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rate_type: z.enum(['daily', 'hourly', 'monthly', 'fixed']),
  rate_amount: z.number().positive(),
  working_hours_per_day: z.number().int().min(1).max(16).default(8),
  work_location: z.string().optional(),
  work_latitude: z.number().optional(),
  work_longitude: z.number().optional(),
  termination_notice_days: z.number().int().min(1).default(7),
  termination_terms: z.string().optional(),
  additional_terms: z.string().optional(),
  total_value: z.number().positive(),
});

const terminateSchema = z.object({
  reason: z.string().min(5),
});

export async function agreementRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /api/agreements — contractor: create agreement
  fastify.post('/', { preHandler: requireRole('contractor', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    const result = createAgreementSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    const agreementNumber = generateOrderNumber('AGR');

    const { data, error } = await supabaseAdmin
      .from('agreements')
      .insert({
        ...result.data,
        agreement_number: agreementNumber,
        contractor_id: requester.userId,
        status: 'draft',
        contractor_signed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to create agreement', code: 'DB_ERROR' });

    await createNotification({
      userId: result.data.worker_id,
      title: 'New Agreement Request',
      message: `You have a new work agreement: ${result.data.title}. Please review and sign.`,
      type: 'agreement',
      referenceType: 'agreement',
      referenceId: data.id,
    });

    // Auto-move to pending_signature
    await supabaseAdmin.from('agreements').update({ status: 'pending_signature' }).eq('id', data.id);
    data.status = 'pending_signature';

    return reply.status(201).send({ agreement: data });
  });

  // GET /api/agreements — list agreements
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;
    const query = request.query as { status?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('agreements')
      .select('*, contractor:users!agreements_contractor_id_fkey(id, full_name, phone), worker:users!agreements_worker_id_fkey(id, full_name, phone)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (query.status) q = q.eq('status', query.status);

    if (requester.role === 'contractor') {
      q = q.eq('contractor_id', requester.userId);
    } else if (requester.role === 'worker') {
      q = q.eq('worker_id', requester.userId);
    }
    // admin sees all

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch agreements', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit });
  });

  // GET /api/agreements/:id — detail
  fastify.get('/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data, error } = await supabaseAdmin
      .from('agreements')
      .select('*, contractor:users!agreements_contractor_id_fkey(id, full_name, phone, email), worker:users!agreements_worker_id_fkey(id, full_name, phone)')
      .eq('id', id)
      .single();

    if (error || !data) return reply.status(404).send({ error: 'Agreement not found', code: 'NOT_FOUND' });

    if (requester.role !== 'admin' && data.contractor_id !== requester.userId && data.worker_id !== requester.userId) {
      return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
    }

    return reply.send({ agreement: data });
  });

  // PATCH /api/agreements/:id/sign — worker: sign
  fastify.patch('/:id/sign', { preHandler: requireRole('worker') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data: agr } = await supabaseAdmin.from('agreements').select('*').eq('id', id).eq('worker_id', requester.userId).single();
    if (!agr) return reply.status(404).send({ error: 'Agreement not found', code: 'NOT_FOUND' });
    if (agr.status !== 'pending_signature') {
      return reply.status(400).send({ error: 'Agreement is not awaiting signature', code: 'INVALID_STATE' });
    }

    const { data, error } = await supabaseAdmin
      .from('agreements')
      .update({ status: 'active', worker_signed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to sign agreement', code: 'DB_ERROR' });

    await createNotification({
      userId: agr.contractor_id,
      title: 'Agreement Signed',
      message: `The worker has signed agreement: ${agr.title}. It is now active.`,
      type: 'agreement',
      referenceType: 'agreement',
      referenceId: id,
    });

    return reply.send({ agreement: data });
  });

  // PATCH /api/agreements/:id/decline — worker: decline
  fastify.patch('/:id/decline', { preHandler: requireRole('worker') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const { data: agr } = await supabaseAdmin.from('agreements').select('*').eq('id', id).eq('worker_id', requester.userId).single();
    if (!agr) return reply.status(404).send({ error: 'Agreement not found', code: 'NOT_FOUND' });
    if (agr.status !== 'pending_signature') {
      return reply.status(400).send({ error: 'Agreement is not awaiting signature', code: 'INVALID_STATE' });
    }

    const { data, error } = await supabaseAdmin
      .from('agreements')
      .update({ status: 'terminated', terminated_at: new Date().toISOString(), termination_reason: 'Declined by worker', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to decline agreement', code: 'DB_ERROR' });

    await createNotification({
      userId: agr.contractor_id,
      title: 'Agreement Declined',
      message: `The worker has declined agreement: ${agr.title}.`,
      type: 'agreement',
      referenceType: 'agreement',
      referenceId: id,
    });

    return reply.send({ agreement: data });
  });

  // PATCH /api/agreements/:id/terminate — contractor: terminate
  fastify.patch('/:id/terminate', { preHandler: requireRole('contractor', 'admin') }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const requester = request.user as unknown as JWTPayload;

    const result = terminateSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Reason required for termination', code: 'VALIDATION_ERROR' });
    }

    const { data: agr } = await supabaseAdmin.from('agreements').select('*').eq('id', id).single();
    if (!agr) return reply.status(404).send({ error: 'Agreement not found', code: 'NOT_FOUND' });

    if (requester.role !== 'admin' && agr.contractor_id !== requester.userId) {
      return reply.status(403).send({ error: 'Access denied', code: 'FORBIDDEN' });
    }

    if (!['active', 'pending_signature'].includes(agr.status)) {
      return reply.status(400).send({ error: 'Agreement cannot be terminated in current state', code: 'INVALID_STATE' });
    }

    const { data, error } = await supabaseAdmin
      .from('agreements')
      .update({
        status: 'terminated',
        terminated_at: new Date().toISOString(),
        termination_reason: result.data.reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to terminate agreement', code: 'DB_ERROR' });

    await createNotification({
      userId: agr.worker_id,
      title: 'Agreement Terminated',
      message: `Agreement "${agr.title}" has been terminated. Reason: ${result.data.reason}`,
      type: 'agreement',
      referenceType: 'agreement',
      referenceId: id,
    });

    return reply.send({ agreement: data });
  });
}
