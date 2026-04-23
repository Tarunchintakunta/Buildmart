import { supabaseAdmin } from '../config/supabase.js';
import { generateTransactionNumber } from './auth.service.js';

export async function getOrCreateWallet(userId: string) {
  let { data: wallet, error } = await supabaseAdmin
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!wallet) {
    const { data: newWallet, error: createErr } = await supabaseAdmin
      .from('wallets')
      .insert({ user_id: userId, balance: 0, held_balance: 0, total_earned: 0, total_spent: 0 })
      .select()
      .single();
    if (createErr) throw new Error('Failed to create wallet');
    wallet = newWallet;
  }

  return wallet;
}

export async function depositToWallet(userId: string, amount: number, description: string = 'Deposit') {
  const wallet = await getOrCreateWallet(userId);
  const newBalance = parseFloat(wallet.balance) + amount;

  const { error: updateErr } = await supabaseAdmin
    .from('wallets')
    .update({ balance: newBalance, total_earned: parseFloat(wallet.total_earned) + amount, updated_at: new Date().toISOString() })
    .eq('id', wallet.id);
  if (updateErr) throw new Error('Failed to update wallet balance');

  const txnNumber = generateTransactionNumber();
  await supabaseAdmin.from('transactions').insert({
    transaction_number: txnNumber,
    wallet_id: wallet.id,
    type: 'deposit',
    amount,
    status: 'completed',
    to_user_id: userId,
    description,
    completed_at: new Date().toISOString(),
  });

  return { wallet_id: wallet.id, new_balance: newBalance, transaction_number: txnNumber };
}

export async function holdFunds(fromUserId: string, amount: number, referenceType: string, referenceId: string, description: string) {
  const wallet = await getOrCreateWallet(fromUserId);
  if (parseFloat(wallet.balance) < amount) {
    throw new Error('Insufficient balance');
  }

  const newBalance = parseFloat(wallet.balance) - amount;
  const newHeld = parseFloat(wallet.held_balance) + amount;

  await supabaseAdmin
    .from('wallets')
    .update({ balance: newBalance, held_balance: newHeld, updated_at: new Date().toISOString() })
    .eq('id', wallet.id);

  const txnNumber = generateTransactionNumber();
  await supabaseAdmin.from('transactions').insert({
    transaction_number: txnNumber,
    wallet_id: wallet.id,
    type: 'hold',
    amount,
    status: 'held',
    reference_type: referenceType,
    reference_id: referenceId,
    from_user_id: fromUserId,
    description,
  });

  return txnNumber;
}

export async function releaseFunds(fromUserId: string, toUserId: string, amount: number, referenceType: string, referenceId: string, description: string) {
  // Deduct held from sender wallet
  const fromWallet = await getOrCreateWallet(fromUserId);
  const newFromHeld = Math.max(0, parseFloat(fromWallet.held_balance) - amount);
  const newFromSpent = parseFloat(fromWallet.total_spent) + amount;

  await supabaseAdmin
    .from('wallets')
    .update({ held_balance: newFromHeld, total_spent: newFromSpent, updated_at: new Date().toISOString() })
    .eq('id', fromWallet.id);

  // Add to recipient wallet
  const toWallet = await getOrCreateWallet(toUserId);
  const newToBalance = parseFloat(toWallet.balance) + amount;
  const newToEarned = parseFloat(toWallet.total_earned) + amount;

  await supabaseAdmin
    .from('wallets')
    .update({ balance: newToBalance, total_earned: newToEarned, updated_at: new Date().toISOString() })
    .eq('id', toWallet.id);

  const txnNumber = generateTransactionNumber();
  await supabaseAdmin.from('transactions').insert({
    transaction_number: txnNumber,
    wallet_id: toWallet.id,
    type: 'release',
    amount,
    status: 'completed',
    reference_type: referenceType,
    reference_id: referenceId,
    from_user_id: fromUserId,
    to_user_id: toUserId,
    description,
    completed_at: new Date().toISOString(),
  });

  return txnNumber;
}

export async function refundHeldFunds(userId: string, amount: number, referenceType: string, referenceId: string, description: string) {
  const wallet = await getOrCreateWallet(userId);
  const newBalance = parseFloat(wallet.balance) + amount;
  const newHeld = Math.max(0, parseFloat(wallet.held_balance) - amount);

  await supabaseAdmin
    .from('wallets')
    .update({ balance: newBalance, held_balance: newHeld, updated_at: new Date().toISOString() })
    .eq('id', wallet.id);

  const txnNumber = generateTransactionNumber();
  await supabaseAdmin.from('transactions').insert({
    transaction_number: txnNumber,
    wallet_id: wallet.id,
    type: 'refund',
    amount,
    status: 'completed',
    reference_type: referenceType,
    reference_id: referenceId,
    to_user_id: userId,
    description,
    completed_at: new Date().toISOString(),
  });

  return txnNumber;
}
