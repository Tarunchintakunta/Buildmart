// ─────────────────────────────────────────────────────────────────────────────
// DatabaseService — Supabase query layer
//
// All public methods return data from Supabase when credentials are configured
// (SupabaseConfig.isConfigured == true), and fall back to mock/seed data
// otherwise. This lets the app run fully in dev/demo mode without any backend.
//
// Supabase table schema expected (run in SQL editor):
// ─────────────────────────────────────────────────────────────────────────────
// -- profiles (one row per auth user)
// create table profiles (
//   id          uuid primary key references auth.users(id),
//   phone       text,
//   full_name   text,
//   role        text default 'customer', -- customer | worker | shopkeeper | contractor | driver | admin
//   wallet_balance numeric default 0,
//   email       text,
//   city        text,
//   avatar_url  text,
//   created_at  timestamptz default now()
// );
//
// -- products
// create table products (
//   id         text primary key,
//   name       text,
//   brand      text,
//   price      numeric,
//   unit       text,
//   rating     numeric,
//   image_url  text,
//   category   text,
//   badge      text,
//   in_stock   boolean default true,
//   created_at timestamptz default now()
// );
//
// -- orders
// create table orders (
//   id          text primary key,
//   user_id     uuid references profiles(id),
//   status      text, -- pending | confirmed | dispatched | delivered | cancelled
//   total       numeric,
//   items       jsonb,
//   address     text,
//   created_at  timestamptz default now()
// );
//
// -- workers
// create table workers (
//   id               uuid primary key references profiles(id),
//   skill            text,
//   daily_rate       numeric,
//   experience_years int,
//   jobs_done        int default 0,
//   bio              text,
//   is_available     boolean default true,
//   rating           numeric default 0,
//   location         text
// );
//
// -- jobs
// create table jobs (
//   id           text primary key,
//   title        text,
//   description  text,
//   employer_id  uuid references profiles(id),
//   worker_id    uuid references profiles(id),
//   status       text, -- pending | accepted | in_progress | completed | rejected
//   pay_per_day  numeric,
//   location     text,
//   start_date   date,
//   created_at   timestamptz default now()
// );
//
// -- wallet_transactions
// create table wallet_transactions (
//   id          text primary key,
//   user_id     uuid references profiles(id),
//   amount      numeric,
//   type        text, -- credit | debit
//   category    text,
//   note        text,
//   status      text default 'completed',
//   created_at  timestamptz default now()
// );
//
// -- Enable RLS on all tables and add appropriate policies:
// alter table profiles              enable row level security;
// alter table products              enable row level security;
// alter table orders                enable row level security;
// alter table workers               enable row level security;
// alter table jobs                  enable row level security;
// alter table wallet_transactions   enable row level security;
//
// -- Example policies (adjust as needed):
// create policy "Users can view own profile"   on profiles for select using (auth.uid() = id);
// create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
// create policy "Products are public"          on products for select using (true);
// create policy "Users see own orders"         on orders for select using (auth.uid() = user_id);
// create policy "Workers are public"           on workers for select using (true);
// create policy "Users see own jobs"           on jobs for select using (auth.uid() = employer_id or auth.uid() = worker_id);
// create policy "Users see own transactions"   on wallet_transactions for select using (auth.uid() = user_id);
// ─────────────────────────────────────────────────────────────────────────────

import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/supabase_config.dart';

class DatabaseService {
  static SupabaseClient get _sb => Supabase.instance.client;

  // ── Products ──────────────────────────────────────────────────────────────

  static Future<List<Map<String, dynamic>>> fetchProducts({
    String? category,
    String? searchQuery,
    int limit = 50,
  }) async {
    if (!SupabaseConfig.isConfigured) return [];
    try {
      var query = _sb.from('products').select().eq('in_stock', true);
      if (category != null && category != 'All') {
        query = query.eq('category', category);
      }
      if (searchQuery != null && searchQuery.isNotEmpty) {
        query = query.ilike('name', '%$searchQuery%');
      }
      final data = await query.limit(limit);
      return List<Map<String, dynamic>>.from(data as List);
    } catch (e) {
      debugPrint('fetchProducts error: $e');
      return [];
    }
  }

  static Future<Map<String, dynamic>?> fetchProduct(String productId) async {
    if (!SupabaseConfig.isConfigured) return null;
    try {
      final data = await _sb.from('products').select().eq('id', productId).single();
      return data;
    } catch (e) {
      debugPrint('fetchProduct error: $e');
      return null;
    }
  }

  // ── Orders ────────────────────────────────────────────────────────────────

  static Future<List<Map<String, dynamic>>> fetchOrders(String userId) async {
    if (!SupabaseConfig.isConfigured) return [];
    try {
      final data = await _sb
          .from('orders')
          .select()
          .eq('user_id', userId)
          .order('created_at', ascending: false);
      return List<Map<String, dynamic>>.from(data as List);
    } catch (e) {
      debugPrint('fetchOrders error: $e');
      return [];
    }
  }

  static Future<Map<String, dynamic>?> fetchOrder(String orderId) async {
    if (!SupabaseConfig.isConfigured) return null;
    try {
      final data = await _sb.from('orders').select().eq('id', orderId).single();
      return data;
    } catch (e) {
      debugPrint('fetchOrder error: $e');
      return null;
    }
  }

  static Future<String?> createOrder({
    required String userId,
    required List<Map<String, dynamic>> items,
    required double total,
    required String address,
  }) async {
    if (!SupabaseConfig.isConfigured) return 'mock-order-${DateTime.now().millisecondsSinceEpoch}';
    try {
      final data = await _sb.from('orders').insert({
        'user_id': userId,
        'status': 'pending',
        'total': total,
        'items': items,
        'address': address,
      }).select('id').single();
      return data['id'] as String;
    } catch (e) {
      debugPrint('createOrder error: $e');
      return null;
    }
  }

  static Future<bool> updateOrderStatus(String orderId, String status) async {
    if (!SupabaseConfig.isConfigured) return true;
    try {
      await _sb.from('orders').update({'status': status}).eq('id', orderId);
      return true;
    } catch (e) {
      debugPrint('updateOrderStatus error: $e');
      return false;
    }
  }

  // ── Workers ───────────────────────────────────────────────────────────────

  static Future<List<Map<String, dynamic>>> fetchWorkers({
    String? skill,
    String? location,
    bool availableOnly = false,
  }) async {
    if (!SupabaseConfig.isConfigured) return [];
    try {
      var query = _sb.from('workers').select('*, profiles(full_name, phone, avatar_url)');
      if (skill != null && skill != 'All') query = query.eq('skill', skill);
      if (location != null && location.isNotEmpty) {
        query = query.ilike('location', '%$location%');
      }
      if (availableOnly) query = query.eq('is_available', true);
      final data = await query.order('rating', ascending: false);
      return List<Map<String, dynamic>>.from(data as List);
    } catch (e) {
      debugPrint('fetchWorkers error: $e');
      return [];
    }
  }

  static Future<bool> updateWorkerAvailability(
      String workerId, bool isAvailable) async {
    if (!SupabaseConfig.isConfigured) return true;
    try {
      await _sb
          .from('workers')
          .update({'is_available': isAvailable})
          .eq('id', workerId);
      return true;
    } catch (e) {
      debugPrint('updateWorkerAvailability error: $e');
      return false;
    }
  }

  // ── Jobs ──────────────────────────────────────────────────────────────────

  static Future<List<Map<String, dynamic>>> fetchJobs({
    String? workerId,
    String? employerId,
    String? status,
  }) async {
    if (!SupabaseConfig.isConfigured) return [];
    try {
      var query = _sb.from('jobs').select();
      if (workerId != null) query = query.eq('worker_id', workerId);
      if (employerId != null) query = query.eq('employer_id', employerId);
      if (status != null) query = query.eq('status', status);
      final data = await query.order('created_at', ascending: false);
      return List<Map<String, dynamic>>.from(data as List);
    } catch (e) {
      debugPrint('fetchJobs error: $e');
      return [];
    }
  }

  static Future<bool> updateJobStatus(String jobId, String status) async {
    if (!SupabaseConfig.isConfigured) return true;
    try {
      await _sb.from('jobs').update({'status': status}).eq('id', jobId);
      return true;
    } catch (e) {
      debugPrint('updateJobStatus error: $e');
      return false;
    }
  }

  // ── Wallet ────────────────────────────────────────────────────────────────

  static Future<List<Map<String, dynamic>>> fetchTransactions(
      String userId, {int limit = 30}) async {
    if (!SupabaseConfig.isConfigured) return [];
    try {
      final data = await _sb
          .from('wallet_transactions')
          .select()
          .eq('user_id', userId)
          .order('created_at', ascending: false)
          .limit(limit);
      return List<Map<String, dynamic>>.from(data as List);
    } catch (e) {
      debugPrint('fetchTransactions error: $e');
      return [];
    }
  }

  static Future<bool> addTransaction({
    required String userId,
    required double amount,
    required String type, // 'credit' | 'debit'
    required String category,
    String? note,
  }) async {
    if (!SupabaseConfig.isConfigured) return true;
    try {
      await _sb.from('wallet_transactions').insert({
        'user_id': userId,
        'amount': amount,
        'type': type,
        'category': category,
        'note': note,
        'status': 'completed',
      });
      return true;
    } catch (e) {
      debugPrint('addTransaction error: $e');
      return false;
    }
  }

  static Future<bool> updateWalletBalance(String userId, double balance) async {
    if (!SupabaseConfig.isConfigured) return true;
    try {
      await _sb
          .from('profiles')
          .update({'wallet_balance': balance})
          .eq('id', userId);
      return true;
    } catch (e) {
      debugPrint('updateWalletBalance error: $e');
      return false;
    }
  }

  // ── Profile ───────────────────────────────────────────────────────────────

  static Future<bool> upsertProfile(Map<String, dynamic> data) async {
    if (!SupabaseConfig.isConfigured) return true;
    try {
      await _sb.from('profiles').upsert(data);
      return true;
    } catch (e) {
      debugPrint('upsertProfile error: $e');
      return false;
    }
  }

  static Future<Map<String, dynamic>?> fetchProfile(String userId) async {
    if (!SupabaseConfig.isConfigured) return null;
    try {
      final data = await _sb.from('profiles').select().eq('id', userId).single();
      return data;
    } catch (e) {
      debugPrint('fetchProfile error: $e');
      return null;
    }
  }
}

