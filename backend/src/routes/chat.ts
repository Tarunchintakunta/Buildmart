import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';

const sendMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  reference_type: z.string().optional(),
  reference_id: z.string().uuid().optional(),
});

export async function chatRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/chat/conversations — list all conversations (must be before /:userId)
  fastify.get('/conversations', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requester = request.user as unknown as JWTPayload;

    // Get latest message per conversation partner
    const { data: sent } = await supabaseAdmin
      .from('chat_messages')
      .select('receiver_id, created_at, message')
      .eq('sender_id', requester.userId)
      .order('created_at', { ascending: false });

    const { data: received } = await supabaseAdmin
      .from('chat_messages')
      .select('sender_id, created_at, message')
      .eq('receiver_id', requester.userId)
      .order('created_at', { ascending: false });

    // Collect unique conversation partner IDs
    const partnerIds = new Set<string>();
    sent?.forEach((m: any) => partnerIds.add(m.receiver_id));
    received?.forEach((m: any) => partnerIds.add(m.sender_id));

    if (partnerIds.size === 0) {
      return reply.send({ conversations: [] });
    }

    // Fetch partner user details
    const { data: partners } = await supabaseAdmin
      .from('users')
      .select('id, full_name, phone, avatar_url, role')
      .in('id', Array.from(partnerIds));

    // Get unread counts per partner
    const conversations = await Promise.all(
      (partners || []).map(async (partner: any) => {
        const { data: lastMsg } = await supabaseAdmin
          .from('chat_messages')
          .select('message, created_at, is_read, sender_id')
          .or(`and(sender_id.eq.${requester.userId},receiver_id.eq.${partner.id}),and(sender_id.eq.${partner.id},receiver_id.eq.${requester.userId})`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const { count: unreadCount } = await supabaseAdmin
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', partner.id)
          .eq('receiver_id', requester.userId)
          .eq('is_read', false);

        return {
          partner,
          last_message: lastMsg,
          unread_count: unreadCount || 0,
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      const ta = a.last_message?.created_at ?? '';
      const tb = b.last_message?.created_at ?? '';
      return tb.localeCompare(ta);
    });

    return reply.send({ conversations });
  });

  // GET /api/chat/:userId — get conversation with a user
  fastify.get('/:userId', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.params as { userId: string };
    const requester = request.user as unknown as JWTPayload;
    const query = request.query as { page?: string; limit?: string };
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '50'), 200);
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .or(`and(sender_id.eq.${requester.userId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${requester.userId})`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return reply.status(500).send({ error: 'Failed to fetch messages', code: 'DB_ERROR' });

    // Mark received messages as read
    await supabaseAdmin
      .from('chat_messages')
      .update({ is_read: true })
      .eq('sender_id', userId)
      .eq('receiver_id', requester.userId)
      .eq('is_read', false);

    // Get partner info
    const { data: partner } = await supabaseAdmin
      .from('users')
      .select('id, full_name, phone, avatar_url, role')
      .eq('id', userId)
      .single();

    return reply.send({
      messages: (data || []).reverse(), // Return in chronological order
      partner,
      total: count,
      page,
      limit,
    });
  });

  // POST /api/chat/:userId — send message
  fastify.post('/:userId', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.params as { userId: string };
    const requester = request.user as unknown as JWTPayload;

    if (userId === requester.userId) {
      return reply.status(400).send({ error: 'Cannot send message to yourself', code: 'INVALID_REQUEST' });
    }

    const result = sendMessageSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.errors });
    }

    // Verify recipient exists
    const { data: recipient } = await supabaseAdmin.from('users').select('id').eq('id', userId).single();
    if (!recipient) return reply.status(404).send({ error: 'Recipient not found', code: 'NOT_FOUND' });

    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        sender_id: requester.userId,
        receiver_id: userId,
        message: result.data.message,
        reference_type: result.data.reference_type,
        reference_id: result.data.reference_id,
        is_read: false,
      })
      .select()
      .single();

    if (error) return reply.status(500).send({ error: 'Failed to send message', code: 'DB_ERROR' });

    return reply.status(201).send({ message: data });
  });
}
