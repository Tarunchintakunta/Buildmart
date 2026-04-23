-- =====================================================================
-- BuildMart Row-Level Security Policies
-- Run AFTER schema.sql
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops              ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory          ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_requests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets            ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages      ENABLE ROW LEVEL SECURITY;

-- ─── USERS ────────────────────────────────────────────────────────────────────

-- Users can view their own profile; admin sees all
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Users can update their own profile; admin can update any
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Only the service role inserts users (via Supabase Auth trigger or seed)
CREATE POLICY "users_insert_service" ON users
  FOR INSERT WITH CHECK (true);

-- ─── WORKER PROFILES ──────────────────────────────────────────────────────────

-- Anyone authenticated can view worker profiles (for hiring)
CREATE POLICY "worker_profiles_select_all" ON worker_profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Workers update their own profile; admin can update any
CREATE POLICY "worker_profiles_update_own" ON worker_profiles
  FOR UPDATE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "worker_profiles_insert_own" ON worker_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── VERIFICATIONS ────────────────────────────────────────────────────────────

CREATE POLICY "verifications_select" ON verifications
  FOR SELECT USING (
    auth.uid() = worker_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "verifications_insert_worker" ON verifications
  FOR INSERT WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "verifications_update_admin" ON verifications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ─── SHOPS ────────────────────────────────────────────────────────────────────

-- All authenticated users can view active shops
CREATE POLICY "shops_select_active" ON shops
  FOR SELECT USING (
    is_active = true
    OR auth.uid() = owner_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Shopkeeper manages their own shop; admin manages all
CREATE POLICY "shops_insert_shopkeeper" ON shops
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('shopkeeper', 'admin'))
  );

CREATE POLICY "shops_update_owner" ON shops
  FOR UPDATE USING (
    auth.uid() = owner_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ─── CATEGORIES & PRODUCTS ────────────────────────────────────────────────────

-- Public read access
CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);

CREATE POLICY "products_select_all" ON products
  FOR SELECT USING (true);

-- Admin only insert/update
CREATE POLICY "categories_admin_write" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "products_admin_write" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ─── INVENTORY ────────────────────────────────────────────────────────────────

-- All authenticated users can view available inventory
CREATE POLICY "inventory_select_all" ON inventory
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Shopkeeper manages their own shop's inventory
CREATE POLICY "inventory_manage_owner" ON inventory
  FOR ALL USING (
    EXISTS (SELECT 1 FROM shops s WHERE s.id = shop_id AND s.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ─── DRIVER PROFILES ──────────────────────────────────────────────────────────

CREATE POLICY "driver_profiles_select" ON driver_profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "driver_profiles_update_own" ON driver_profiles
  FOR UPDATE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "driver_profiles_insert_own" ON driver_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────

-- Customer sees own orders; shopkeeper sees their shop's orders; driver sees assigned; admin sees all
CREATE POLICY "orders_select" ON orders
  FOR SELECT USING (
    auth.uid() = customer_id
    OR auth.uid() = driver_id
    OR EXISTS (SELECT 1 FROM shops s WHERE s.id = shop_id AND s.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "orders_insert_customer" ON orders
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id
    AND EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('customer', 'contractor'))
  );

CREATE POLICY "orders_update" ON orders
  FOR UPDATE USING (
    auth.uid() = customer_id
    OR auth.uid() = driver_id
    OR EXISTS (SELECT 1 FROM shops s WHERE s.id = shop_id AND s.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ─── ORDER ITEMS ──────────────────────────────────────────────────────────────

CREATE POLICY "order_items_select" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o WHERE o.id = order_id AND (
        o.customer_id = auth.uid()
        OR o.driver_id = auth.uid()
        OR EXISTS (SELECT 1 FROM shops s WHERE s.id = o.shop_id AND s.owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
      )
    )
  );

CREATE POLICY "order_items_insert" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.customer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ─── LABOR REQUESTS ───────────────────────────────────────────────────────────

CREATE POLICY "labor_requests_select" ON labor_requests
  FOR SELECT USING (
    auth.uid() = customer_id
    OR auth.uid() = worker_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "labor_requests_insert" ON labor_requests
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id
    AND EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('customer', 'contractor'))
  );

CREATE POLICY "labor_requests_update" ON labor_requests
  FOR UPDATE USING (
    auth.uid() = customer_id
    OR auth.uid() = worker_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ─── AGREEMENTS ───────────────────────────────────────────────────────────────

CREATE POLICY "agreements_select" ON agreements
  FOR SELECT USING (
    auth.uid() = contractor_id
    OR auth.uid() = worker_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "agreements_insert_contractor" ON agreements
  FOR INSERT WITH CHECK (
    auth.uid() = contractor_id
    AND EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('contractor', 'admin'))
  );

CREATE POLICY "agreements_update" ON agreements
  FOR UPDATE USING (
    auth.uid() = contractor_id
    OR auth.uid() = worker_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ─── WALLETS ──────────────────────────────────────────────────────────────────

-- Users see only their own wallet; admin sees all
CREATE POLICY "wallets_select_own" ON wallets
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "wallets_update_own" ON wallets
  FOR UPDATE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "wallets_insert" ON wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

CREATE POLICY "transactions_select_own" ON transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM wallets w WHERE w.id = wallet_id AND w.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "transactions_insert" ON transactions
  FOR INSERT WITH CHECK (true); -- Controlled at service layer

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert" ON notifications
  FOR INSERT WITH CHECK (true); -- Service layer controls

-- ─── CHAT MESSAGES ────────────────────────────────────────────────────────────

CREATE POLICY "chat_select_participant" ON chat_messages
  FOR SELECT USING (
    auth.uid() = sender_id
    OR auth.uid() = receiver_id
  );

CREATE POLICY "chat_insert_sender" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "chat_update_receiver" ON chat_messages
  FOR UPDATE USING (auth.uid() = receiver_id); -- For marking read
