import { supabaseAdmin } from '../config/supabase.js';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: string;
  referenceType?: string;
  referenceId?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  await supabaseAdmin.from('notifications').insert({
    user_id: params.userId,
    title: params.title,
    message: params.message,
    type: params.type,
    reference_type: params.referenceType,
    reference_id: params.referenceId,
    is_read: false,
  });
}

export async function createNotificationForRole(role: string, title: string, message: string, type?: string): Promise<void> {
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('role', role)
    .eq('is_active', true);

  if (!users || users.length === 0) return;

  const notifications = users.map((u: { id: string }) => ({
    user_id: u.id,
    title,
    message,
    type: type || 'broadcast',
    is_read: false,
  }));

  await supabaseAdmin.from('notifications').insert(notifications);
}

export async function createNotificationForAll(title: string, message: string, type?: string): Promise<void> {
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('is_active', true);

  if (!users || users.length === 0) return;

  const notifications = users.map((u: { id: string }) => ({
    user_id: u.id,
    title,
    message,
    type: type || 'broadcast',
    is_read: false,
  }));

  await supabaseAdmin.from('notifications').insert(notifications);
}
