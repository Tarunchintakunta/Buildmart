import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';
import { getOrCreateWallet, depositToWallet, holdFunds, releaseFunds } from '../services/wallet.service.js';

const depositSchema = z.object({
  amount: z.number().positive().max(100000),
  description: z.string().optional(),
});

const holdSchema = z.object({
  amount: z.number().positive(),
  reference_type: z.string(),
  reference_id: z.string().uuid(),
  description: z.string().optional(),
});

const releaseSchema = z.object({
  from_user_id: z.string().uuid(),
  to_user_id: z.string().uuid(),
  amount: z.number().positive(),
  reference_type: z.string(),
  reference_id: z.string().uuid(),
  description: z.string().optional(),
});

export async function walletRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/wallet — get my wallet + balance
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    try {
      const wallet = await getOrCreateWallet(requester.userId);
      return reply.send({ wallet });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message, code: 'WALLET_ERROR' });
    }
  });

  // GET /api/wallet/transactions — transaction history
  fastify.get('/transactions', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;
    const query = request.query as { type?: string; page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '20'), 100);
    const offset = (page - 1) * limit;

    // Get wallet id first
    const wallet = await getOrCreateWallet(requester.userId);

    let q = supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false });

    if (query.type) q = q.eq('type', query.type);

    const { data, error, count } = await q.range(offset, offset + limit - 1);
    if (error) return reply.status(500).send({ error: 'Failed to fetch transactions', code: 'DB_ERROR' });

    return reply.send({ data, total: count, page, limit, wallet_id: wallet.id });
  });

  // POST /api/wallet/deposit — mock deposit
  fastify.post('/deposit', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    const result = depositSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    try {
      const res = await depositToWallet(requester.userId, result.data.amount, result.data.description || 'Manual deposit');
      return reply.send({ message: 'Deposit successful', ...res });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message, code: 'WALLET_ERROR' });
    }
  });

  // POST /api/wallet/hold — internal: hold funds
  fastify.post('/hold', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    const result = holdSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    try {
      const txnNumber = await holdFunds(
        requester.userId,
        result.data.amount,
        result.data.reference_type,
        result.data.reference_id,
        result.data.description || 'Fund hold'
      );
      return reply.send({ message: 'Funds held successfully', transaction_number: txnNumber });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: 'WALLET_ERROR' });
    }
  });

  // POST /api/wallet/release — internal: release held funds (admin only in practice)
  fastify.post('/release', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const result = releaseSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    try {
      const txnNumber = await releaseFunds(
        result.data.from_user_id,
        result.data.to_user_id,
        result.data.amount,
        result.data.reference_type,
        result.data.reference_id,
        result.data.description || 'Fund release'
      );
      return reply.send({ message: 'Funds released successfully', transaction_number: txnNumber });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: 'WALLET_ERROR' });
    }
  });
}
