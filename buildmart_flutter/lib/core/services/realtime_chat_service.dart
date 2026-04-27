// ─────────────────────────────────────────────────────────────────────────────
// RealtimeChatService — Supabase Realtime messaging
//
// Supabase setup:
//   1. Create the `messages` table:
//      create table messages (
//        id          uuid primary key default gen_random_uuid(),
//        chat_id     text not null,       -- e.g. "user1_user2" (sorted user IDs)
//        sender_id   uuid not null references profiles(id),
//        content     text not null,
//        type        text default 'text', -- text | image | file
//        created_at  timestamptz default now()
//      );
//
//   2. Enable Realtime on `messages` table:
//      In Supabase dashboard → Database → Replication → toggle messages ON
//
//   3. Enable RLS:
//      alter table messages enable row level security;
//      create policy "Chat participants can read messages"
//        on messages for select using (
//          auth.uid()::text = split_part(chat_id, '_', 1)
//          or auth.uid()::text = split_part(chat_id, '_', 2)
//        );
//      create policy "Users can send messages"
//        on messages for insert with check (auth.uid() = sender_id);
// ─────────────────────────────────────────────────────────────────────────────

import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/supabase_config.dart';

class ChatMessage {
  final String id;
  final String chatId;
  final String senderId;
  final String content;
  final String type;
  final DateTime createdAt;

  const ChatMessage({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.content,
    required this.type,
    required this.createdAt,
  });

  factory ChatMessage.fromMap(Map<String, dynamic> map) {
    return ChatMessage(
      id: map['id'] as String,
      chatId: map['chat_id'] as String,
      senderId: map['sender_id'] as String,
      content: map['content'] as String,
      type: map['type'] as String? ?? 'text',
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }

  bool get isMe =>
      senderId == Supabase.instance.client.auth.currentUser?.id;
}

class RealtimeChatService {
  static final _client = Supabase.instance.client;
  RealtimeChannel? _channel;

  /// Generates a deterministic chat ID from two user IDs.
  static String chatId(String uid1, String uid2) {
    final sorted = [uid1, uid2]..sort();
    return '${sorted[0]}_${sorted[1]}';
  }

  /// Fetch recent messages for a chat.
  Future<List<ChatMessage>> fetchMessages(String chatId, {int limit = 50}) async {
    if (!SupabaseConfig.isConfigured) return _mockMessages(chatId);
    try {
      final data = await _client
          .from('messages')
          .select()
          .eq('chat_id', chatId)
          .order('created_at', ascending: false)
          .limit(limit);
      return (data as List)
          .map((m) => ChatMessage.fromMap(m as Map<String, dynamic>))
          .toList()
          .reversed
          .toList();
    } catch (e) {
      debugPrint('fetchMessages error: $e');
      return _mockMessages(chatId);
    }
  }

  /// Subscribe to new messages in [chatId] via Supabase Realtime.
  void subscribe(String chatId, void Function(ChatMessage) onMessage) {
    if (!SupabaseConfig.isConfigured) return;
    _channel = _client
        .channel('chat_$chatId')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'messages',
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'chat_id',
            value: chatId,
          ),
          callback: (payload) {
            try {
              final msg = ChatMessage.fromMap(payload.newRecord);
              onMessage(msg);
            } catch (e) {
              debugPrint('Realtime message parse error: $e');
            }
          },
        )
        .subscribe();
  }

  /// Unsubscribe from realtime channel.
  Future<void> unsubscribe() async {
    await _channel?.unsubscribe();
    _channel = null;
  }

  /// Send a text message.
  Future<bool> sendMessage({
    required String chatId,
    required String senderId,
    required String content,
    String type = 'text',
  }) async {
    if (!SupabaseConfig.isConfigured) return true; // mock success
    try {
      await _client.from('messages').insert({
        'chat_id': chatId,
        'sender_id': senderId,
        'content': content,
        'type': type,
      });
      return true;
    } catch (e) {
      debugPrint('sendMessage error: $e');
      return false;
    }
  }

  // ── Mock data (used when Supabase is not configured) ──────────────────────

  static List<ChatMessage> _mockMessages(String chatId) {
    final now = DateTime.now();
    return [
      ChatMessage(id: '1', chatId: chatId, senderId: 'other', content: 'Hi! Is the material available?', type: 'text', createdAt: now.subtract(const Duration(minutes: 30))),
      ChatMessage(id: '2', chatId: chatId, senderId: 'me', content: 'Yes, we have it in stock. Shall I confirm the order?', type: 'text', createdAt: now.subtract(const Duration(minutes: 28))),
      ChatMessage(id: '3', chatId: chatId, senderId: 'other', content: 'Please go ahead. Deliver by tomorrow?', type: 'text', createdAt: now.subtract(const Duration(minutes: 25))),
      ChatMessage(id: '4', chatId: chatId, senderId: 'me', content: '✅ Confirmed! Delivery by 11 AM tomorrow.', type: 'text', createdAt: now.subtract(const Duration(minutes: 20))),
    ];
  }
}
