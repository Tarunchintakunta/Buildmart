-- =====================================================================
-- BuildMart Seed Data — Hyderabad, India
-- =====================================================================

-- ─── USERS (6 roles) ──────────────────────────────────────────────────────────

INSERT INTO users (id, phone, full_name, email, role, address, city, latitude, longitude, is_active) VALUES
  -- Customer
  ('11111111-1111-1111-1111-111111111111',
   '9000000001', 'Rajesh Kumar',   'rajesh.kumar@gmail.com',
   'customer',    'Flat 204, Srinivasa Residency, Madhapur, Hyderabad',
   'Hyderabad',   17.44518, 78.38061, true),

  -- Worker
  ('22222222-2222-2222-2222-222222222222',
   '9000000002', 'Ravi Shankar',   'ravi.shankar@gmail.com',
   'worker',      '8-2-601, Road No. 10, Banjara Hills, Hyderabad',
   'Hyderabad',   17.41539, 78.44800, true),

  -- Shopkeeper
  ('33333333-3333-3333-3333-333333333333',
   '9000000003', 'Venkat Reddy',   'venkat.reddy@gmail.com',
   'shopkeeper',  'Plot 45, KPHB Phase 1, Kukatpally, Hyderabad',
   'Hyderabad',   17.49441, 78.38861, true),

  -- Contractor
  ('44444444-4444-4444-4444-444444444444',
   '9000000004', 'Suresh Babu',    'suresh.babu@gmail.com',
   'contractor',  '3-6-311, Himayatnagar, Hyderabad',
   'Hyderabad',   17.40741, 78.47670, true),

  -- Driver
  ('55555555-5555-5555-5555-555555555555',
   '9000000005', 'Krishna Rao',    'krishna.rao@gmail.com',
   'driver',      'H.No. 12-2-823, Mehdipatnam, Hyderabad',
   'Hyderabad',   17.39441, 78.43200, true),

  -- Admin
  ('66666666-6666-6666-6666-666666666666',
   '9000000006', 'Admin BuildMart', 'admin@buildmart.in',
   'admin',       'BuildMart HQ, Gachibowli, Hyderabad',
   'Hyderabad',   17.44000, 78.34800, true)
ON CONFLICT (phone) DO NOTHING;

-- ─── WORKER PROFILE ──────────────────────────────────────────────────────────

INSERT INTO worker_profiles (user_id, skills, experience_years, daily_rate, hourly_rate, status, bio, rating, total_jobs, is_verified) VALUES
  ('22222222-2222-2222-2222-222222222222',
   ARRAY['mason','helper']::worker_skill[],
   8, 850.00, 110.00,
   'waiting',
   'Experienced mason with 8 years in residential and commercial construction projects across Hyderabad. Specialises in RCC work and brick masonry.',
   4.60, 47, true)
ON CONFLICT (user_id) DO NOTHING;

-- ─── SHOP ────────────────────────────────────────────────────────────────────

INSERT INTO shops (id, owner_id, name, description, address, city, latitude, longitude, phone, is_active, rating, opening_time, closing_time, delivery_radius_km) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '33333333-3333-3333-3333-333333333333',
   'Sri Venkat Building Materials',
   'Premium construction materials supplier serving Hyderabad since 2008. One-stop shop for cement, steel, bricks, paints and plumbing supplies with same-day delivery in KPHB, Kukatpally, Miyapur, Nizampet and Bachupally areas.',
   'Shop No. 7, KPHB Phase 3, Near Metro Station, Kukatpally, Hyderabad - 500072',
   'Hyderabad',
   17.49256, 78.38512,
   '9000000003',
   true, 4.30,
   '07:30', '20:30', 15)
ON CONFLICT (id) DO NOTHING;

-- ─── CATEGORIES ───────────────────────────────────────────────────────────────

INSERT INTO categories (id, name, description, icon) VALUES
  ('cat00001-0000-0000-0000-000000000001', 'Cement & Concrete',   'Portland cement, OPC, PPC, concrete mixes and additives',     'cement'),
  ('cat00001-0000-0000-0000-000000000002', 'Steel & Iron',         'TMT bars, angle iron, MS plates, wire mesh, GI pipes',         'steel'),
  ('cat00001-0000-0000-0000-000000000003', 'Bricks & Blocks',      'Red bricks, fly ash bricks, AAC blocks, hollow blocks',        'bricks'),
  ('cat00001-0000-0000-0000-000000000004', 'Paints & Primers',     'Exterior paints, interior emulsion, primers, putty',           'paint'),
  ('cat00001-0000-0000-0000-000000000005', 'Plumbing',             'CPVC pipes, PVC pipes, fittings, valves, water tanks',         'plumbing')
ON CONFLICT (id) DO NOTHING;

-- ─── PRODUCTS (10) ────────────────────────────────────────────────────────────

INSERT INTO products (id, category_id, name, description, unit, is_heavy, weight_kg) VALUES
  -- Cement & Concrete
  ('prod0001-0000-0000-0000-000000000001',
   'cat00001-0000-0000-0000-000000000001',
   'UltraTech Cement OPC 53 Grade',
   'Ordinary Portland Cement 53 Grade — ideal for RCC, plastering and masonry. Consistent strength, low heat of hydration.',
   'bag (50 kg)', true, 50.00),

  ('prod0001-0000-0000-0000-000000000002',
   'cat00001-0000-0000-0000-000000000001',
   'Dalmia PPC Blended Cement',
   'Portland Pozzolana Cement — superior workability, reduced shrinkage. Best for brickwork and plastering.',
   'bag (50 kg)', true, 50.00),

  -- Steel & Iron
  ('prod0001-0000-0000-0000-000000000003',
   'cat00001-0000-0000-0000-000000000002',
   'TATA Tiscon TMT Bar 12mm Fe-500D',
   'High-strength TMT steel bar 12mm dia, Fe-500D grade. Earthquake-resistant, superior ductility. Standard 12m length.',
   'piece (12m)', true, 10.56),

  ('prod0001-0000-0000-0000-000000000004',
   'cat00001-0000-0000-0000-000000000002',
   'Steel Wire Binding Wire 18 gauge',
   'Galvanised iron binding wire 18 gauge, used for tying TMT bars during RCC work. 20kg coil.',
   'coil (20 kg)', true, 20.00),

  -- Bricks & Blocks
  ('prod0001-0000-0000-0000-000000000005',
   'cat00001-0000-0000-0000-000000000003',
   'Fly Ash Bricks (Standard Size)',
   'Machine-made fly ash bricks 230x110x75mm. Higher compressive strength than clay bricks, eco-friendly.',
   'piece', true, 3.50),

  ('prod0001-0000-0000-0000-000000000006',
   'cat00001-0000-0000-0000-000000000003',
   'AAC Blocks 600x200x150mm',
   'Autoclaved Aerated Concrete blocks. Lightweight, thermally insulating, sound-proof. Ideal for partition walls.',
   'piece', false, 8.00),

  -- Paints & Primers
  ('prod0001-0000-0000-0000-000000000007',
   'cat00001-0000-0000-0000-000000000004',
   'Asian Paints Apex Exterior Emulsion (White) 20L',
   'Weather-proof exterior wall paint. UV-resistant, anti-fungal, 10-year warranty. Coverage: 130-150 sq.ft/litre.',
   'can (20 L)', false, 28.00),

  ('prod0001-0000-0000-0000-000000000008',
   'cat00001-0000-0000-0000-000000000004',
   'Birla White Cement Putty 40kg',
   'White cement-based wall putty for smooth base before painting. Excellent adhesion to concrete and masonry.',
   'bag (40 kg)', false, 40.00),

  -- Plumbing
  ('prod0001-0000-0000-0000-000000000009',
   'cat00001-0000-0000-0000-000000000005',
   'Astral CPVC Pipe 1 inch (3m)',
   'CPVC hot & cold water pipe 1 inch nominal bore, 3m length. Pressure rating PN 16. Chlorine resistant.',
   'piece (3m)', false, 1.20),

  ('prod0001-0000-0000-0000-000000000010',
   'cat00001-0000-0000-0000-000000000005',
   'Sintex Water Tank 1000 Litre',
   'Triple-layer UV-stabilised polyethylene water storage tank. ISI-marked, food-grade, 5-year warranty.',
   'piece', true, 22.00)
ON CONFLICT (id) DO NOTHING;

-- ─── INVENTORY (all 10 products in Sri Venkat's shop) ─────────────────────────

INSERT INTO inventory (shop_id, product_id, price, stock_quantity, min_order_quantity, max_order_quantity, is_available) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000001', 385.00,  500, 1,  50,  true),  -- UltraTech Cement
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000002', 370.00,  300, 1,  50,  true),  -- Dalmia PPC Cement
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000003', 680.00,  200, 1,  100, true),  -- TMT Bar 12mm
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000004', 1850.00, 50,  1,  20,  true),  -- Binding Wire
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000005', 8.50,    10000, 100, 5000, true), -- Fly Ash Bricks
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000006', 65.00,   1000, 10, 500,  true), -- AAC Blocks
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000007', 3450.00, 100, 1,  20,  true),  -- Asian Paints 20L
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000008', 520.00,  200, 1,  50,  true),  -- Birla White Putty
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000009', 185.00,  300, 1,  50,  true),  -- CPVC Pipe
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'prod0001-0000-0000-0000-000000000010', 4200.00, 30,  1,  5,   true)   -- Sintex Water Tank
ON CONFLICT (shop_id, product_id) DO NOTHING;

-- ─── DRIVER PROFILE ───────────────────────────────────────────────────────────

INSERT INTO driver_profiles (user_id, driver_type, vehicle_type, vehicle_number, license_number, is_available, current_latitude, current_longitude, rating, total_deliveries) VALUES
  ('55555555-5555-5555-5555-555555555555',
   'freelance', 'Tata Ace Mini Truck', 'TS09EA4721', 'TSHYDB20180012345',
   true, 17.39500, 78.43100, 4.20, 312)
ON CONFLICT (user_id) DO NOTHING;

-- ─── WALLETS ──────────────────────────────────────────────────────────────────

INSERT INTO wallets (user_id, balance, held_balance, total_earned, total_spent) VALUES
  ('11111111-1111-1111-1111-111111111111', 25000.00,  0.00,    0.00,      12500.00),  -- Rajesh (customer)
  ('22222222-2222-2222-2222-222222222222', 18750.00,  0.00,    67200.00,  3200.00),   -- Ravi (worker)
  ('33333333-3333-3333-3333-333333333333', 145000.00, 0.00,    385000.00, 82000.00),  -- Venkat (shopkeeper)
  ('44444444-4444-4444-4444-444444444444', 52000.00,  0.00,    0.00,      48000.00),  -- Suresh (contractor)
  ('55555555-5555-5555-5555-555555555555', 9800.00,   0.00,    31200.00,  4500.00),   -- Krishna (driver)
  ('66666666-6666-6666-6666-666666666666', 100000.00, 0.00,    0.00,      0.00)       -- Admin
ON CONFLICT (user_id) DO NOTHING;

-- ─── SAMPLE ORDERS ────────────────────────────────────────────────────────────

-- We need inventory IDs for order_items — use subqueries
-- Order 1: Delivered
INSERT INTO orders (id, order_number, customer_id, shop_id, driver_id, status, delivery_address, delivery_latitude, delivery_longitude, subtotal, delivery_fee, tax, total_amount, delivery_notes, estimated_delivery_minutes, actual_delivery_time) VALUES
  ('order001-0000-0000-0000-000000000001',
   'BM-100001',
   '11111111-1111-1111-1111-111111111111',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '55555555-5555-5555-5555-555555555555',
   'delivered',
   'Flat 204, Srinivasa Residency, Madhapur, Hyderabad - 500081',
   17.44518, 78.38061,
   1155.00, 0.00, 57.75, 1212.75,
   'Please deliver to the basement parking area',
   40, NOW() - INTERVAL '2 days')
ON CONFLICT (order_number) DO NOTHING;

INSERT INTO orders (id, order_number, customer_id, shop_id, status, delivery_address, delivery_latitude, delivery_longitude, subtotal, delivery_fee, tax, total_amount, estimated_delivery_minutes) VALUES
  -- Order 2: Accepted
  ('order002-0000-0000-0000-000000000002',
   'BM-100002',
   '11111111-1111-1111-1111-111111111111',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'accepted',
   'Flat 204, Srinivasa Residency, Madhapur, Hyderabad - 500081',
   17.44518, 78.38061,
   1925.00, 0.00, 96.25, 2021.25,
   45),

  -- Order 3: Pending
  ('order003-0000-0000-0000-000000000003',
   'BM-100003',
   '44444444-4444-4444-4444-444444444444',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'pending',
   'Site Office, Kokapet Layout, Nanakramguda, Hyderabad - 500032',
   17.41200, 78.35600,
   6800.00, 50.00, 340.00, 7190.00,
   60)
ON CONFLICT (order_number) DO NOTHING;

-- Order items for order 1 (3 bags cement + 1 binding wire)
INSERT INTO order_items (order_id, product_id, inventory_id, quantity, unit_price, total_price)
SELECT
  'order001-0000-0000-0000-000000000001',
  i.product_id,
  i.id,
  3,
  i.price,
  3 * i.price
FROM inventory i
WHERE i.shop_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  AND i.product_id = 'prod0001-0000-0000-0000-000000000001'
LIMIT 1;

-- Order items for order 2 (5 bags Dalmia cement)
INSERT INTO order_items (order_id, product_id, inventory_id, quantity, unit_price, total_price)
SELECT
  'order002-0000-0000-0000-000000000002',
  i.product_id,
  i.id,
  5,
  i.price,
  5 * i.price
FROM inventory i
WHERE i.shop_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  AND i.product_id = 'prod0001-0000-0000-0000-000000000002'
LIMIT 1;

-- Order items for order 3 (contractor: 10 TMT bars)
INSERT INTO order_items (order_id, product_id, inventory_id, quantity, unit_price, total_price)
SELECT
  'order003-0000-0000-0000-000000000003',
  i.product_id,
  i.id,
  10,
  i.price,
  10 * i.price
FROM inventory i
WHERE i.shop_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  AND i.product_id = 'prod0001-0000-0000-0000-000000000003'
LIMIT 1;

-- ─── LABOR REQUESTS ───────────────────────────────────────────────────────────

INSERT INTO labor_requests (id, request_number, customer_id, worker_id, skill_required, description, work_address, work_latitude, work_longitude, scheduled_date, scheduled_time, duration_hours, offered_rate, status) VALUES
  ('labor001-0000-0000-0000-000000000001',
   'LR-200001',
   '11111111-1111-1111-1111-111111111111',
   '22222222-2222-2222-2222-222222222222',
   'mason',
   'Need an experienced mason for brick laying and plastering work on the first floor of my house under construction. Approx 200 sq.ft of wall to be completed.',
   'Plot 88, Pragati Nagar, Nizampet, Hyderabad - 500090',
   17.52300, 78.38900,
   '2026-04-28', '08:00', 8, 900.00,
   'completed'),

  ('labor002-0000-0000-0000-000000000002',
   'LR-200002',
   '44444444-4444-4444-4444-444444444444',
   '22222222-2222-2222-2222-222222222222',
   'mason',
   'Require a skilled mason for RCC column shuttering and concrete pouring work at our construction site in Kokapet. PPE will be provided.',
   'Survey No. 112, Kokapet Village, Hyderabad - 500032',
   17.41100, 78.35700,
   '2026-04-30', '07:30', 10, 950.00,
   'accepted')
ON CONFLICT (request_number) DO NOTHING;

-- ─── AGREEMENT ────────────────────────────────────────────────────────────────

INSERT INTO agreements (id, agreement_number, contractor_id, worker_id, title, scope_of_work, start_date, end_date, rate_type, rate_amount, working_hours_per_day, work_location, work_latitude, work_longitude, termination_notice_days, termination_terms, total_value, status, contractor_signed_at) VALUES
  ('agr00001-0000-0000-0000-000000000001',
   'AGR-300001',
   '44444444-4444-4444-4444-444444444444',
   '22222222-2222-2222-2222-222222222222',
   'Residential Building Construction — 3 Month Mason Contract',
   'The worker shall carry out all masonry-related work including brick laying, RCC shuttering assistance, plastering of internal and external walls, finishing works and waterproofing as directed by the site engineer at the project location. Worker shall adhere to all safety protocols.',
   '2026-05-01', '2026-07-31',
   'daily', 900.00, 9,
   'Survey No. 45, Nallagandla, Serilingampally, Hyderabad - 500019',
   17.43200, 78.31800,
   7,
   'Either party may terminate with 7 days written notice. No payment for incomplete days in week of termination.',
   78300.00,
   'pending_signature',
   NOW())
ON CONFLICT (agreement_number) DO NOTHING;

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id, is_read) VALUES
  ('11111111-1111-1111-1111-111111111111',
   'Welcome to BuildMart!',
   'Your account is ready. Start exploring shops, hire workers, and manage your construction projects — all in one place.',
   'welcome', NULL, NULL, false),

  ('22222222-2222-2222-2222-222222222222',
   'New Labor Request',
   'Suresh Babu has sent you a mason job request for ₹950/day starting April 30. Please review and accept.',
   'labor', 'labor_request', 'labor002-0000-0000-0000-000000000002', false),

  ('33333333-3333-3333-3333-333333333333',
   'New Order Received',
   'Order BM-100002 received for ₹2,021.25. Please confirm and prepare for dispatch.',
   'order', 'order', 'order002-0000-0000-0000-000000000002', false),

  ('44444444-4444-4444-4444-444444444444',
   'Agreement Sent',
   'Your work agreement for Ravi Shankar is pending his signature. You will be notified once signed.',
   'agreement', 'agreement', 'agr00001-0000-0000-0000-000000000001', true),

  ('55555555-5555-5555-5555-555555555555',
   'New Delivery Available',
   'Order BM-100002 is ready for pickup from Sri Venkat Building Materials, Kukatpally. Accept the delivery to get started.',
   'delivery', 'order', 'order002-0000-0000-0000-000000000002', false);
