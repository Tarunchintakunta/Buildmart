import { supabaseAdmin } from '../config/supabase.js';
import { User } from '../types/index.js';

export async function findUserByPhone(phone: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('phone', phone)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as User;
}

export function generateOrderNumber(prefix: string = 'BM'): string {
  const digits = Math.floor(100000 + Math.random() * 900000).toString();
  return `${prefix}-${digits}`;
}

export function generateTransactionNumber(): string {
  const digits = Math.floor(100000 + Math.random() * 900000).toString();
  return `TXN-${digits}`;
}
