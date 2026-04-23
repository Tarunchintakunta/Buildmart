-- =====================================================================
-- BuildMart Database Schema
-- India Construction Marketplace — Hyderabad First
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ────────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('customer','contractor','worker','shopkeeper','driver','admin');
CREATE TYPE worker_skill AS ENUM ('coolie','mason','electrician','plumber','carpenter','painter','welder','helper');
CREATE TYPE worker_status AS ENUM ('working','waiting');
CREATE TYPE driver_type AS ENUM ('shop_driver','freelance');
CREATE TYPE verification_status AS ENUM ('pending','approved','rejected');
CREATE TYPE order_status AS ENUM ('pending','accepted','processing','out_for_delivery','delivered','cancelled');
CREATE TYPE agreement_status AS ENUM ('draft','pending_signature','active','completed','terminated');
CREATE TYPE labor_request_status AS ENUM ('pending','accepted','in_progress','completed','cancelled');
CREATE TYPE transaction_type AS ENUM ('deposit','withdrawal','payment','hold','release','refund');
CREATE TYPE transaction_status AS ENUM ('pending','completed','failed','held');
CREATE TYPE concierge_task_status AS ENUM ('pending','assigned','in_progress','completed','cancelled');

-- ─── TABLES ───────────────────────────────────────────────────────────────────

-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role user_role NOT NULL,
  avatar_url TEXT,
  address TEXT,
  city VARCHAR(50) DEFAULT 'Hyderabad',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WORKER PROFILES
CREATE TABLE worker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  skills worker_skill[] NOT NULL,
  experience_years INTEGER DEFAULT 0,
  daily_rate DECIMAL(10,2) NOT NULL,
  hourly_rate DECIMAL(10,2),
  status worker_status DEFAULT 'waiting',
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_jobs INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VERIFICATIONS
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  id_type VARCHAR(50) NOT NULL,
  id_number VARCHAR(50),
  id_front_url TEXT NOT NULL,
  id_back_url TEXT,
  selfie_url TEXT,
  status verification_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  review_notes TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

-- SHOPS
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city VARCHAR(50) DEFAULT 'Hyderabad',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone VARCHAR(15),
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.00,
  opening_time TIME DEFAULT '08:00',
  closing_time TIME DEFAULT '20:00',
  delivery_radius_km INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  unit VARCHAR(20) NOT NULL,
  image_url TEXT,
  is_heavy BOOLEAN DEFAULT false,
  weight_kg DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INVENTORY
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER DEFAULT 100,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(shop_id, product_id)
);

-- DRIVER PROFILES
CREATE TABLE driver_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  driver_type driver_type NOT NULL,
  shop_id UUID REFERENCES shops(id),
  vehicle_type VARCHAR(50),
  vehicle_number VARCHAR(20),
  license_number VARCHAR(50),
  is_available BOOLEAN DEFAULT true,
  current_latitude DECIMAL(10,8),
  current_longitude DECIMAL(11,8),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id),
  shop_id UUID REFERENCES shops(id),
  driver_id UUID REFERENCES users(id),
  status order_status DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  delivery_latitude DECIMAL(10,8),
  delivery_longitude DECIMAL(11,8),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_notes TEXT,
  estimated_delivery_minutes INTEGER DEFAULT 45,
  actual_delivery_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  inventory_id UUID REFERENCES inventory(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  concierge_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LABOR REQUESTS
CREATE TABLE labor_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id),
  worker_id UUID REFERENCES users(id),
  skill_required worker_skill NOT NULL,
  description TEXT,
  work_address TEXT NOT NULL,
  work_latitude DECIMAL(10,8),
  work_longitude DECIMAL(11,8),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_hours INTEGER DEFAULT 2,
  offered_rate DECIMAL(10,2) NOT NULL,
  status labor_request_status DEFAULT 'pending',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  customer_rating INTEGER,
  worker_rating INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AGREEMENTS
CREATE TABLE agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_number VARCHAR(20) UNIQUE NOT NULL,
  contractor_id UUID REFERENCES users(id),
  worker_id UUID REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  scope_of_work TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rate_type VARCHAR(20) NOT NULL,
  rate_amount DECIMAL(10,2) NOT NULL,
  working_hours_per_day INTEGER DEFAULT 8,
  work_location TEXT,
  work_latitude DECIMAL(10,8),
  work_longitude DECIMAL(11,8),
  termination_notice_days INTEGER DEFAULT 7,
  termination_terms TEXT,
  additional_terms TEXT,
  total_value DECIMAL(12,2) NOT NULL,
  status agreement_status DEFAULT 'draft',
  contractor_signed_at TIMESTAMP,
  worker_signed_at TIMESTAMP,
  terminated_at TIMESTAMP,
  termination_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WALLETS
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(12,2) DEFAULT 0.00,
  held_balance DECIMAL(12,2) DEFAULT 0.00,
  total_earned DECIMAL(12,2) DEFAULT 0.00,
  total_spent DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRANSACTIONS
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_number VARCHAR(20) UNIQUE NOT NULL,
  wallet_id UUID REFERENCES wallets(id),
  type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status transaction_status DEFAULT 'pending',
  reference_type VARCHAR(50),
  reference_id UUID,
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  reference_type VARCHAR(50),
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CHAT MESSAGES
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  reference_type VARCHAR(50),
  reference_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_worker_profiles_status ON worker_profiles(status);
CREATE INDEX idx_inventory_shop ON inventory(shop_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_labor_requests_status ON labor_requests(status);
CREATE INDEX idx_agreements_contractor ON agreements(contractor_id);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_chat_messages_receiver ON chat_messages(receiver_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_orders_shop ON orders(shop_id);
CREATE INDEX idx_orders_driver ON orders(driver_id);
CREATE INDEX idx_labor_requests_worker ON labor_requests(worker_id);
CREATE INDEX idx_labor_requests_customer ON labor_requests(customer_id);

-- ─── HELPER FUNCTION for worker job count ─────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_worker_jobs(worker_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE worker_profiles
  SET total_jobs = total_jobs + 1, updated_at = NOW()
  WHERE user_id = worker_user_id;
END;
$$ LANGUAGE plpgsql;
