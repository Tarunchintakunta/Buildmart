-- =============================================
-- SEED DATA FOR CONSTRUCTION MARKETPLACE
-- =============================================

-- =============================================
-- CATEGORIES
-- =============================================

INSERT INTO categories (id, name, description, icon) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Cement & Concrete', 'Cement bags, ready-mix, and concrete products', 'cement'),
  ('c1000000-0000-0000-0000-000000000002', 'Doors & Windows', 'Wooden, metal, and UPVC doors and windows', 'door'),
  ('c1000000-0000-0000-0000-000000000003', 'Pipes & Fittings', 'PVC, CPVC, and metal pipes with fittings', 'pipe'),
  ('c1000000-0000-0000-0000-000000000004', 'Electrical', 'Wires, switches, and electrical components', 'electrical'),
  ('c1000000-0000-0000-0000-000000000005', 'Hardware', 'Nails, screws, tools, and hardware items', 'hardware'),
  ('c1000000-0000-0000-0000-000000000006', 'Sand & Aggregates', 'Construction sand, gravel, and aggregates', 'sand'),
  ('c1000000-0000-0000-0000-000000000007', 'Steel & Metal', 'TMT bars, steel plates, and metal products', 'steel'),
  ('c1000000-0000-0000-0000-000000000008', 'Paint & Finishing', 'Paints, primers, and finishing materials', 'paint');

-- =============================================
-- USERS - CUSTOMERS (5)
-- =============================================

INSERT INTO users (id, phone, full_name, email, role, address, city, latitude, longitude) VALUES
  ('a1000000-0000-0000-0000-000000000001', '9876543101', 'Rahul Sharma', 'rahul@email.com', 'customer', '123 MG Road, Koramangala', 'Bangalore', 12.9352, 77.6245),
  ('a1000000-0000-0000-0000-000000000002', '9876543102', 'Priya Patel', 'priya@email.com', 'customer', '45 Park Street', 'Bangalore', 12.9716, 77.5946),
  ('a1000000-0000-0000-0000-000000000003', '9876543103', 'Amit Kumar', 'amit@email.com', 'customer', '78 Brigade Road', 'Bangalore', 12.9719, 77.6067),
  ('a1000000-0000-0000-0000-000000000004', '9876543104', 'Sneha Reddy', 'sneha@email.com', 'customer', '22 Indiranagar', 'Bangalore', 12.9784, 77.6408),
  ('a1000000-0000-0000-0000-000000000005', '9876543105', 'Vikram Singh', 'vikram@email.com', 'customer', '90 Whitefield', 'Bangalore', 12.9698, 77.7500);

-- =============================================
-- USERS - CONTRACTORS (5)
-- =============================================

INSERT INTO users (id, phone, full_name, email, role, address, city, latitude, longitude) VALUES
  ('a2000000-0000-0000-0000-000000000001', '9876543201', 'Rajesh Constructions', 'rajesh.const@email.com', 'contractor', '100 Industrial Area', 'Bangalore', 12.9141, 77.6411),
  ('a2000000-0000-0000-0000-000000000002', '9876543202', 'BuildRight Pvt Ltd', 'buildright@email.com', 'contractor', '55 Electronic City', 'Bangalore', 12.8399, 77.6770),
  ('a2000000-0000-0000-0000-000000000003', '9876543203', 'Sharma Builders', 'sharma.build@email.com', 'contractor', '33 Marathahalli', 'Bangalore', 12.9591, 77.6974),
  ('a2000000-0000-0000-0000-000000000004', '9876543204', 'Prime Infrastructure', 'prime.infra@email.com', 'contractor', '12 Hebbal', 'Bangalore', 13.0358, 77.5970),
  ('a2000000-0000-0000-0000-000000000005', '9876543205', 'Metro Constructions', 'metro.const@email.com', 'contractor', '88 JP Nagar', 'Bangalore', 12.9063, 77.5857);

-- =============================================
-- USERS - WORKERS (5)
-- =============================================

INSERT INTO users (id, phone, full_name, email, role, address, city, latitude, longitude) VALUES
  ('a3000000-0000-0000-0000-000000000001', '9876543301', 'Ramu Yadav', 'ramu@email.com', 'worker', 'Madiwala Village', 'Bangalore', 12.9226, 77.6174),
  ('a3000000-0000-0000-0000-000000000002', '9876543302', 'Suresh Kumar', 'suresh@email.com', 'worker', 'BTM Layout', 'Bangalore', 12.9166, 77.6101),
  ('a3000000-0000-0000-0000-000000000003', '9876543303', 'Mohammed Ali', 'mali@email.com', 'worker', 'Shivaji Nagar', 'Bangalore', 12.9857, 77.6057),
  ('a3000000-0000-0000-0000-000000000004', '9876543304', 'Ganesh Babu', 'ganesh@email.com', 'worker', 'Jayanagar', 'Bangalore', 12.9299, 77.5838),
  ('a3000000-0000-0000-0000-000000000005', '9876543305', 'Venkat Rao', 'venkat@email.com', 'worker', 'HSR Layout', 'Bangalore', 12.9116, 77.6389);

-- =============================================
-- USERS - SHOPKEEPERS (5)
-- =============================================

INSERT INTO users (id, phone, full_name, email, role, address, city, latitude, longitude) VALUES
  ('a4000000-0000-0000-0000-000000000001', '9876543401', 'Anand Hardware', 'anand.hw@email.com', 'shopkeeper', '10 KR Market', 'Bangalore', 12.9634, 77.5779),
  ('a4000000-0000-0000-0000-000000000002', '9876543402', 'Sri Lakshmi Traders', 'lakshmi.trade@email.com', 'shopkeeper', '25 Chickpet', 'Bangalore', 12.9673, 77.5773),
  ('a4000000-0000-0000-0000-000000000003', '9876543403', 'Balaji Building Materials', 'balaji.bm@email.com', 'shopkeeper', '40 Yeshwanthpur', 'Bangalore', 13.0285, 77.5399),
  ('a4000000-0000-0000-0000-000000000004', '9876543404', 'RK Construction Supplies', 'rk.supplies@email.com', 'shopkeeper', '60 Peenya', 'Bangalore', 13.0296, 77.5185),
  ('a4000000-0000-0000-0000-000000000005', '9876543405', 'Ganesh Hardware Store', 'ganesh.hw@email.com', 'shopkeeper', '15 Malleshwaram', 'Bangalore', 13.0035, 77.5647);

-- =============================================
-- USERS - DRIVERS (5)
-- =============================================

INSERT INTO users (id, phone, full_name, email, role, address, city, latitude, longitude) VALUES
  ('a5000000-0000-0000-0000-000000000001', '9876543501', 'Krishna Driver', 'krishna.d@email.com', 'driver', 'Madiwala', 'Bangalore', 12.9226, 77.6174),
  ('a5000000-0000-0000-0000-000000000002', '9876543502', 'Ramesh Logistics', 'ramesh.log@email.com', 'driver', 'Koramangala', 'Bangalore', 12.9352, 77.6245),
  ('a5000000-0000-0000-0000-000000000003', '9876543503', 'Naveen Transport', 'naveen.t@email.com', 'driver', 'Indiranagar', 'Bangalore', 12.9784, 77.6408),
  ('a5000000-0000-0000-0000-000000000004', '9876543504', 'Sanjay Delivery', 'sanjay.del@email.com', 'driver', 'Whitefield', 'Bangalore', 12.9698, 77.7500),
  ('a5000000-0000-0000-0000-000000000005', '9876543505', 'Prakash Porter', 'prakash.p@email.com', 'driver', 'Electronic City', 'Bangalore', 12.8399, 77.6770);

-- =============================================
-- USERS - ADMINS (5)
-- =============================================

INSERT INTO users (id, phone, full_name, email, role, address, city, latitude, longitude) VALUES
  ('a6000000-0000-0000-0000-000000000001', '9876543601', 'Admin One', 'admin1@marketplace.com', 'admin', 'HQ Office', 'Bangalore', 12.9716, 77.5946),
  ('a6000000-0000-0000-0000-000000000002', '9876543602', 'Admin Two', 'admin2@marketplace.com', 'admin', 'HQ Office', 'Bangalore', 12.9716, 77.5946),
  ('a6000000-0000-0000-0000-000000000003', '9876543603', 'Admin Three', 'admin3@marketplace.com', 'admin', 'HQ Office', 'Bangalore', 12.9716, 77.5946),
  ('a6000000-0000-0000-0000-000000000004', '9876543604', 'Admin Four', 'admin4@marketplace.com', 'admin', 'HQ Office', 'Bangalore', 12.9716, 77.5946),
  ('a6000000-0000-0000-0000-000000000005', '9876543605', 'Admin Five', 'admin5@marketplace.com', 'admin', 'HQ Office', 'Bangalore', 12.9716, 77.5946);

-- =============================================
-- WORKER PROFILES
-- =============================================

INSERT INTO worker_profiles (id, user_id, skills, experience_years, daily_rate, hourly_rate, status, bio, rating, total_jobs, is_verified) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000001', ARRAY['coolie', 'helper']::worker_skill[], 5, 600.00, 100.00, 'waiting', 'Experienced in loading and unloading heavy materials', 4.5, 120, true),
  ('b1000000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000002', ARRAY['mason', 'painter']::worker_skill[], 8, 800.00, 120.00, 'working', 'Expert mason with 8 years experience in residential projects', 4.8, 200, true),
  ('b1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000003', ARRAY['electrician']::worker_skill[], 6, 900.00, 150.00, 'waiting', 'Licensed electrician, specialized in home wiring', 4.6, 150, true),
  ('b1000000-0000-0000-0000-000000000004', 'a3000000-0000-0000-0000-000000000004', ARRAY['plumber', 'welder']::worker_skill[], 10, 850.00, 130.00, 'waiting', 'Plumbing and welding specialist', 4.7, 180, false),
  ('b1000000-0000-0000-0000-000000000005', 'a3000000-0000-0000-0000-000000000005', ARRAY['carpenter']::worker_skill[], 12, 1000.00, 160.00, 'working', 'Master carpenter for furniture and woodwork', 4.9, 250, true);

-- =============================================
-- VERIFICATIONS (Worker ID uploads)
-- =============================================

INSERT INTO verifications (id, worker_id, id_type, id_number, id_front_url, id_back_url, status, reviewed_by, review_notes, reviewed_at) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000001', 'aadhar', 'XXXX-XXXX-1234', 'https://placeholder.com/id1_front.jpg', 'https://placeholder.com/id1_back.jpg', 'approved', 'a6000000-0000-0000-0000-000000000001', 'ID verified successfully', CURRENT_TIMESTAMP),
  ('d1000000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000002', 'aadhar', 'XXXX-XXXX-2345', 'https://placeholder.com/id2_front.jpg', 'https://placeholder.com/id2_back.jpg', 'approved', 'a6000000-0000-0000-0000-000000000001', 'ID verified successfully', CURRENT_TIMESTAMP),
  ('d1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000003', 'driving_license', 'DL-1234567890', 'https://placeholder.com/id3_front.jpg', 'https://placeholder.com/id3_back.jpg', 'approved', 'a6000000-0000-0000-0000-000000000002', 'License verified', CURRENT_TIMESTAMP),
  ('d1000000-0000-0000-0000-000000000004', 'a3000000-0000-0000-0000-000000000004', 'aadhar', 'XXXX-XXXX-3456', 'https://placeholder.com/id4_front.jpg', 'https://placeholder.com/id4_back.jpg', 'pending', NULL, NULL, NULL),
  ('d1000000-0000-0000-0000-000000000005', 'a3000000-0000-0000-0000-000000000005', 'voter_id', 'VOTER123456', 'https://placeholder.com/id5_front.jpg', NULL, 'approved', 'a6000000-0000-0000-0000-000000000001', 'Voter ID verified', CURRENT_TIMESTAMP);

-- =============================================
-- SHOPS
-- =============================================

INSERT INTO shops (id, owner_id, name, description, address, city, latitude, longitude, phone, rating, delivery_radius_km) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'a4000000-0000-0000-0000-000000000001', 'Anand Hardware & Building Materials', 'Complete construction materials shop', '10 KR Market', 'Bangalore', 12.9634, 77.5779, '9876543401', 4.5, 15),
  ('e1000000-0000-0000-0000-000000000002', 'a4000000-0000-0000-0000-000000000002', 'Sri Lakshmi Building Traders', 'Wholesale cement and steel', '25 Chickpet', 'Bangalore', 12.9673, 77.5773, '9876543402', 4.3, 20),
  ('e1000000-0000-0000-0000-000000000003', 'a4000000-0000-0000-0000-000000000003', 'Balaji Construction Hub', 'One-stop construction shop', '40 Yeshwanthpur', 'Bangalore', 13.0285, 77.5399, '9876543403', 4.7, 25),
  ('e1000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000004', 'RK Building Supplies', 'Industrial construction materials', '60 Peenya Industrial', 'Bangalore', 13.0296, 77.5185, '9876543404', 4.4, 30),
  ('e1000000-0000-0000-0000-000000000005', 'a4000000-0000-0000-0000-000000000005', 'Ganesh Hardware Mart', 'Quality hardware and tools', '15 Malleshwaram', 'Bangalore', 13.0035, 77.5647, '9876543405', 4.6, 12);

-- =============================================
-- DRIVER PROFILES
-- =============================================

INSERT INTO driver_profiles (id, user_id, driver_type, shop_id, vehicle_type, vehicle_number, license_number, is_available, rating, total_deliveries) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'a5000000-0000-0000-0000-000000000001', 'shop_driver', 'e1000000-0000-0000-0000-000000000001', 'Mini Truck', 'KA01AB1234', 'DL-KA-2020-123456', true, 4.6, 500),
  ('f1000000-0000-0000-0000-000000000002', 'a5000000-0000-0000-0000-000000000002', 'shop_driver', 'e1000000-0000-0000-0000-000000000002', 'Tempo', 'KA02CD5678', 'DL-KA-2019-234567', true, 4.4, 350),
  ('f1000000-0000-0000-0000-000000000003', 'a5000000-0000-0000-0000-000000000003', 'freelance', NULL, 'Pickup Van', 'KA03EF9012', 'DL-KA-2021-345678', true, 4.8, 800),
  ('f1000000-0000-0000-0000-000000000004', 'a5000000-0000-0000-0000-000000000004', 'freelance', NULL, 'Mini Truck', 'KA04GH3456', 'DL-KA-2018-456789', false, 4.5, 600),
  ('f1000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000005', 'freelance', NULL, 'Large Truck', 'KA05IJ7890', 'DL-KA-2022-567890', true, 4.7, 450);

-- =============================================
-- PRODUCTS (20)
-- =============================================

INSERT INTO products (id, category_id, name, description, unit, image_url, is_heavy, weight_kg) VALUES
  -- Cement & Concrete
  ('01000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'UltraTech Cement 50kg', 'Premium OPC 53 Grade Cement', 'bag', 'https://placeholder.com/cement.jpg', true, 50.00),
  ('01000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'ACC Cement 50kg', 'PPC Cement for general construction', 'bag', 'https://placeholder.com/acc.jpg', true, 50.00),
  ('01000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Ready Mix Concrete', 'M20 Grade Ready Mix', 'cubic_meter', 'https://placeholder.com/rmc.jpg', true, 2400.00),

  -- Doors & Windows
  ('01000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Wooden Door - Teak', 'Solid Teak Wood Door 7ft x 3ft', 'piece', 'https://placeholder.com/teak_door.jpg', true, 45.00),
  ('01000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'Steel Door - Security', 'Heavy Duty Steel Security Door', 'piece', 'https://placeholder.com/steel_door.jpg', true, 60.00),
  ('01000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'UPVC Window', 'Double Glazed UPVC Window 4ft x 3ft', 'piece', 'https://placeholder.com/upvc.jpg', false, 15.00),

  -- Pipes & Fittings
  ('01000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000003', 'PVC Pipe 4 inch', '4 inch diameter, 10ft length', 'piece', 'https://placeholder.com/pvc.jpg', false, 3.00),
  ('01000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'CPVC Pipe 1 inch', 'Hot water CPVC pipe, 10ft', 'piece', 'https://placeholder.com/cpvc.jpg', false, 1.50),
  ('01000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000003', 'GI Pipe 2 inch', 'Galvanized Iron Pipe', 'piece', 'https://placeholder.com/gi.jpg', true, 8.00),

  -- Electrical
  ('01000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000004', 'Copper Wire 2.5mm', '90m coil, Finolex brand', 'coil', 'https://placeholder.com/wire.jpg', false, 5.00),
  ('01000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000004', 'MCB Switch Box', '8-way MCB distribution box', 'piece', 'https://placeholder.com/mcb.jpg', false, 2.00),

  -- Hardware
  ('01000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000005', 'Cement Nails 3 inch', '1kg pack construction nails', 'kg', 'https://placeholder.com/nails.jpg', false, 1.00),
  ('01000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000005', 'Wood Screws Assorted', 'Box of 100 assorted screws', 'box', 'https://placeholder.com/screws.jpg', false, 0.50),
  ('01000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000005', 'Door Hinges - SS', 'Stainless Steel 4 inch hinges (pair)', 'pair', 'https://placeholder.com/hinges.jpg', false, 0.30),

  -- Sand & Aggregates
  ('01000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000006', 'River Sand', 'Fine river sand for plastering', 'cubic_ft', 'https://placeholder.com/sand.jpg', true, 45.00),
  ('01000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000006', 'M-Sand', 'Manufactured sand for concrete', 'cubic_ft', 'https://placeholder.com/msand.jpg', true, 48.00),
  ('01000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000006', '20mm Aggregate', 'Crushed stone aggregate', 'cubic_ft', 'https://placeholder.com/aggregate.jpg', true, 50.00),

  -- Steel & Metal
  ('01000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000007', 'TMT Bar 12mm', 'Fe500D Grade, 12m length', 'piece', 'https://placeholder.com/tmt.jpg', true, 10.70),
  ('01000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000007', 'TMT Bar 8mm', 'Fe500D Grade, 12m length', 'piece', 'https://placeholder.com/tmt8.jpg', true, 4.80),

  -- Paint
  ('01000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000008', 'Asian Paints Primer', '20L bucket wall primer', 'bucket', 'https://placeholder.com/primer.jpg', true, 25.00);

-- =============================================
-- INVENTORY (Products in shops)
-- =============================================

-- Shop 1 (Anand Hardware)
INSERT INTO inventory (shop_id, product_id, price, stock_quantity, is_available) VALUES
  ('e1000000-0000-0000-0000-000000000001', '01000000-0000-0000-0000-000000000001', 380.00, 100, true),
  ('e1000000-0000-0000-0000-000000000001', '01000000-0000-0000-0000-000000000002', 370.00, 80, true),
  ('e1000000-0000-0000-0000-000000000001', '01000000-0000-0000-0000-000000000004', 15000.00, 10, true),
  ('e1000000-0000-0000-0000-000000000001', '01000000-0000-0000-0000-000000000007', 250.00, 200, true),
  ('e1000000-0000-0000-0000-000000000001', '01000000-0000-0000-0000-000000000012', 120.00, 500, true),
  ('e1000000-0000-0000-0000-000000000001', '01000000-0000-0000-0000-000000000018', 650.00, 100, true);

-- Shop 2 (Sri Lakshmi)
INSERT INTO inventory (shop_id, product_id, price, stock_quantity, is_available) VALUES
  ('e1000000-0000-0000-0000-000000000002', '01000000-0000-0000-0000-000000000001', 375.00, 500, true),
  ('e1000000-0000-0000-0000-000000000002', '01000000-0000-0000-0000-000000000002', 365.00, 400, true),
  ('e1000000-0000-0000-0000-000000000002', '01000000-0000-0000-0000-000000000003', 5500.00, 50, true),
  ('e1000000-0000-0000-0000-000000000002', '01000000-0000-0000-0000-000000000015', 55.00, 1000, true),
  ('e1000000-0000-0000-0000-000000000002', '01000000-0000-0000-0000-000000000018', 640.00, 200, true),
  ('e1000000-0000-0000-0000-000000000002', '01000000-0000-0000-0000-000000000019', 320.00, 300, true);

-- Shop 3 (Balaji)
INSERT INTO inventory (shop_id, product_id, price, stock_quantity, is_available) VALUES
  ('e1000000-0000-0000-0000-000000000003', '01000000-0000-0000-0000-000000000001', 378.00, 200, true),
  ('e1000000-0000-0000-0000-000000000003', '01000000-0000-0000-0000-000000000005', 25000.00, 15, true),
  ('e1000000-0000-0000-0000-000000000003', '01000000-0000-0000-0000-000000000006', 8500.00, 20, true),
  ('e1000000-0000-0000-0000-000000000003', '01000000-0000-0000-0000-000000000010', 4500.00, 50, true),
  ('e1000000-0000-0000-0000-000000000003', '01000000-0000-0000-0000-000000000016', 60.00, 800, true),
  ('e1000000-0000-0000-0000-000000000003', '01000000-0000-0000-0000-000000000020', 2200.00, 30, true);

-- Shop 4 (RK Supplies)
INSERT INTO inventory (shop_id, product_id, price, stock_quantity, is_available) VALUES
  ('e1000000-0000-0000-0000-000000000004', '01000000-0000-0000-0000-000000000001', 372.00, 1000, true),
  ('e1000000-0000-0000-0000-000000000004', '01000000-0000-0000-0000-000000000009', 850.00, 100, true),
  ('e1000000-0000-0000-0000-000000000004', '01000000-0000-0000-0000-000000000015', 52.00, 2000, true),
  ('e1000000-0000-0000-0000-000000000004', '01000000-0000-0000-0000-000000000017', 48.00, 1500, true),
  ('e1000000-0000-0000-0000-000000000004', '01000000-0000-0000-0000-000000000018', 635.00, 500, true),
  ('e1000000-0000-0000-0000-000000000004', '01000000-0000-0000-0000-000000000019', 315.00, 600, true);

-- Shop 5 (Ganesh Hardware)
INSERT INTO inventory (shop_id, product_id, price, stock_quantity, is_available) VALUES
  ('e1000000-0000-0000-0000-000000000005', '01000000-0000-0000-0000-000000000008', 180.00, 150, true),
  ('e1000000-0000-0000-0000-000000000005', '01000000-0000-0000-0000-000000000011', 1200.00, 40, true),
  ('e1000000-0000-0000-0000-000000000005', '01000000-0000-0000-0000-000000000012', 115.00, 300, true),
  ('e1000000-0000-0000-0000-000000000005', '01000000-0000-0000-0000-000000000013', 250.00, 200, true),
  ('e1000000-0000-0000-0000-000000000005', '01000000-0000-0000-0000-000000000014', 180.00, 100, true),
  ('e1000000-0000-0000-0000-000000000005', '01000000-0000-0000-0000-000000000010', 4400.00, 60, true);

-- =============================================
-- WALLETS (For all users)
-- =============================================

-- Customer Wallets
INSERT INTO wallets (user_id, balance, held_balance, total_earned, total_spent) VALUES
  ('a1000000-0000-0000-0000-000000000001', 25000.00, 0.00, 0.00, 5000.00),
  ('a1000000-0000-0000-0000-000000000002', 15000.00, 0.00, 0.00, 3000.00),
  ('a1000000-0000-0000-0000-000000000003', 50000.00, 0.00, 0.00, 10000.00),
  ('a1000000-0000-0000-0000-000000000004', 8000.00, 0.00, 0.00, 2000.00),
  ('a1000000-0000-0000-0000-000000000005', 35000.00, 0.00, 0.00, 7500.00);

-- Contractor Wallets
INSERT INTO wallets (user_id, balance, held_balance, total_earned, total_spent) VALUES
  ('a2000000-0000-0000-0000-000000000001', 500000.00, 50000.00, 0.00, 200000.00),
  ('a2000000-0000-0000-0000-000000000002', 750000.00, 75000.00, 0.00, 350000.00),
  ('a2000000-0000-0000-0000-000000000003', 300000.00, 30000.00, 0.00, 150000.00),
  ('a2000000-0000-0000-0000-000000000004', 1000000.00, 100000.00, 0.00, 500000.00),
  ('a2000000-0000-0000-0000-000000000005', 450000.00, 45000.00, 0.00, 225000.00);

-- Worker Wallets
INSERT INTO wallets (user_id, balance, held_balance, total_earned, total_spent) VALUES
  ('a3000000-0000-0000-0000-000000000001', 12000.00, 0.00, 72000.00, 0.00),
  ('a3000000-0000-0000-0000-000000000002', 18000.00, 0.00, 160000.00, 0.00),
  ('a3000000-0000-0000-0000-000000000003', 15000.00, 0.00, 135000.00, 0.00),
  ('a3000000-0000-0000-0000-000000000004', 8000.00, 0.00, 144000.00, 0.00),
  ('a3000000-0000-0000-0000-000000000005', 25000.00, 0.00, 250000.00, 0.00);

-- Shopkeeper Wallets
INSERT INTO wallets (user_id, balance, held_balance, total_earned, total_spent) VALUES
  ('a4000000-0000-0000-0000-000000000001', 150000.00, 0.00, 500000.00, 350000.00),
  ('a4000000-0000-0000-0000-000000000002', 200000.00, 0.00, 750000.00, 550000.00),
  ('a4000000-0000-0000-0000-000000000003', 180000.00, 0.00, 600000.00, 420000.00),
  ('a4000000-0000-0000-0000-000000000004', 250000.00, 0.00, 900000.00, 650000.00),
  ('a4000000-0000-0000-0000-000000000005', 120000.00, 0.00, 400000.00, 280000.00);

-- Driver Wallets
INSERT INTO wallets (user_id, balance, held_balance, total_earned, total_spent) VALUES
  ('a5000000-0000-0000-0000-000000000001', 8000.00, 0.00, 50000.00, 0.00),
  ('a5000000-0000-0000-0000-000000000002', 6000.00, 0.00, 35000.00, 0.00),
  ('a5000000-0000-0000-0000-000000000003', 12000.00, 0.00, 80000.00, 0.00),
  ('a5000000-0000-0000-0000-000000000004', 9000.00, 0.00, 60000.00, 0.00),
  ('a5000000-0000-0000-0000-000000000005', 7000.00, 0.00, 45000.00, 0.00);

-- Admin Wallets (minimal)
INSERT INTO wallets (user_id, balance, held_balance, total_earned, total_spent) VALUES
  ('a6000000-0000-0000-0000-000000000001', 0.00, 0.00, 0.00, 0.00),
  ('a6000000-0000-0000-0000-000000000002', 0.00, 0.00, 0.00, 0.00),
  ('a6000000-0000-0000-0000-000000000003', 0.00, 0.00, 0.00, 0.00),
  ('a6000000-0000-0000-0000-000000000004', 0.00, 0.00, 0.00, 0.00),
  ('a6000000-0000-0000-0000-000000000005', 0.00, 0.00, 0.00, 0.00);

-- =============================================
-- AGREEMENTS (5 Active)
-- =============================================

INSERT INTO agreements (id, agreement_number, contractor_id, worker_id, title, scope_of_work, start_date, end_date, rate_type, rate_amount, working_hours_per_day, work_location, termination_notice_days, termination_terms, total_value, status, contractor_signed_at, worker_signed_at) VALUES
  ('aa000000-0000-0000-0000-000000000001', 'AGR-2024-001', 'a2000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000001', 'Site Labor for Brigade Project', 'Loading, unloading, and general site assistance for residential construction', '2024-01-15', '2024-03-15', 'daily', 600.00, 8, 'Brigade Road Construction Site', 7, 'Either party may terminate with 7 days written notice', 36000.00, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('aa000000-0000-0000-0000-000000000002', 'AGR-2024-002', 'a2000000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000002', 'Mason Work - Electronic City Villa', 'Complete masonry work including walls, plastering, and tiling', '2024-02-01', '2024-04-30', 'weekly', 5600.00, 8, 'Electronic City Villa Project', 14, 'Quality work required. Termination for poor quality with 3 days notice', 67200.00, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('aa000000-0000-0000-0000-000000000003', 'AGR-2024-003', 'a2000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000003', 'Electrical Installation - Office Complex', 'Complete electrical wiring and installation for 3-floor office', '2024-01-20', '2024-02-28', 'daily', 900.00, 8, 'Marathahalli Office Complex', 7, 'Licensed work required. All materials provided by contractor', 36000.00, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('aa000000-0000-0000-0000-000000000004', 'AGR-2024-004', 'a2000000-0000-0000-0000-000000000004', 'a3000000-0000-0000-0000-000000000005', 'Carpentry - Modular Kitchen Project', 'Design and install modular kitchens for 10 apartments', '2024-02-10', '2024-05-10', 'monthly', 30000.00, 8, 'Hebbal Apartment Complex', 30, 'Monthly review. Payment upon completion of each unit', 90000.00, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('aa000000-0000-0000-0000-000000000005', 'AGR-2024-005', 'a2000000-0000-0000-0000-000000000005', 'a3000000-0000-0000-0000-000000000004', 'Plumbing - Housing Society', 'Complete plumbing installation for 20 units', '2024-03-01', '2024-06-30', 'weekly', 5950.00, 8, 'JP Nagar Housing Society', 14, 'Must follow ISI standards. Warranty on work for 1 year', 102200.00, 'pending_signature', CURRENT_TIMESTAMP, NULL);

-- =============================================
-- SAMPLE ORDERS
-- =============================================

INSERT INTO orders (id, order_number, customer_id, shop_id, driver_id, status, delivery_address, delivery_latitude, delivery_longitude, subtotal, delivery_fee, tax, total_amount, estimated_delivery_minutes) VALUES
  ('bb000000-0000-0000-0000-000000000001', 'ORD-2024-0001', 'a1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'a5000000-0000-0000-0000-000000000001', 'delivered', '123 MG Road, Koramangala', 12.9352, 77.6245, 4500.00, 150.00, 810.00, 5460.00, 45),
  ('bb000000-0000-0000-0000-000000000002', 'ORD-2024-0002', 'a2000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', 'a5000000-0000-0000-0000-000000000003', 'out_for_delivery', '100 Industrial Area', 12.9141, 77.6411, 25000.00, 500.00, 4500.00, 30000.00, 60),
  ('bb000000-0000-0000-0000-000000000003', 'ORD-2024-0003', 'a1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000003', NULL, 'pending', '78 Brigade Road', 12.9719, 77.6067, 8500.00, 200.00, 1530.00, 10230.00, 45);

-- Order Items
INSERT INTO order_items (order_id, product_id, inventory_id, quantity, unit_price, total_price, is_available)
SELECT
  'bb000000-0000-0000-0000-000000000001',
  '01000000-0000-0000-0000-000000000001',
  i.id,
  10,
  380.00,
  3800.00,
  true
FROM inventory i
WHERE i.shop_id = 'e1000000-0000-0000-0000-000000000001'
AND i.product_id = '01000000-0000-0000-0000-000000000001';

INSERT INTO order_items (order_id, product_id, inventory_id, quantity, unit_price, total_price, is_available)
SELECT
  'bb000000-0000-0000-0000-000000000001',
  '01000000-0000-0000-0000-000000000012',
  i.id,
  5,
  120.00,
  600.00,
  true
FROM inventory i
WHERE i.shop_id = 'e1000000-0000-0000-0000-000000000001'
AND i.product_id = '01000000-0000-0000-0000-000000000012';

-- =============================================
-- SAMPLE LABOR REQUESTS
-- =============================================

INSERT INTO labor_requests (id, request_number, customer_id, worker_id, skill_required, description, work_address, work_latitude, work_longitude, scheduled_date, scheduled_time, duration_hours, offered_rate, status) VALUES
  ('cc000000-0000-0000-0000-000000000001', 'LBR-2024-0001', 'a1000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000001', 'coolie', 'Need help unloading cement bags from truck', '123 MG Road, Koramangala', 12.9352, 77.6245, '2024-02-15', '09:00', 2, 200.00, 'completed'),
  ('cc000000-0000-0000-0000-000000000002', 'LBR-2024-0002', 'a1000000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000003', 'electrician', 'Install ceiling fan and fix wiring issue', '45 Park Street', 12.9716, 77.5946, '2024-02-16', '10:00', 3, 450.00, 'accepted'),
  ('cc000000-0000-0000-0000-000000000003', 'LBR-2024-0003', 'a1000000-0000-0000-0000-000000000004', NULL, 'plumber', 'Fix leaking pipe in bathroom', '22 Indiranagar', 12.9784, 77.6408, '2024-02-17', '14:00', 2, 300.00, 'pending');

-- =============================================
-- SAMPLE TRANSACTIONS
-- =============================================

INSERT INTO transactions (transaction_number, wallet_id, type, amount, status, reference_type, reference_id, from_user_id, to_user_id, description, completed_at)
SELECT
  'TXN-2024-0001',
  w.id,
  'payment',
  5460.00,
  'completed',
  'order',
  'bb000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'a4000000-0000-0000-0000-000000000001',
  'Payment for Order ORD-2024-0001',
  CURRENT_TIMESTAMP
FROM wallets w WHERE w.user_id = 'a1000000-0000-0000-0000-000000000001';

INSERT INTO transactions (transaction_number, wallet_id, type, amount, status, reference_type, reference_id, from_user_id, to_user_id, description)
SELECT
  'TXN-2024-0002',
  w.id,
  'hold',
  30000.00,
  'held',
  'order',
  'bb000000-0000-0000-0000-000000000002',
  'a2000000-0000-0000-0000-000000000001',
  'a4000000-0000-0000-0000-000000000002',
  'Payment held for Order ORD-2024-0002'
FROM wallets w WHERE w.user_id = 'a2000000-0000-0000-0000-000000000001';

INSERT INTO transactions (transaction_number, wallet_id, type, amount, status, reference_type, reference_id, from_user_id, to_user_id, description)
SELECT
  'TXN-2024-0003',
  w.id,
  'hold',
  50000.00,
  'held',
  'agreement',
  'aa000000-0000-0000-0000-000000000001',
  'a2000000-0000-0000-0000-000000000001',
  'a3000000-0000-0000-0000-000000000001',
  'Escrow for Agreement AGR-2024-001'
FROM wallets w WHERE w.user_id = 'a2000000-0000-0000-0000-000000000001';

-- =============================================
-- SAMPLE NOTIFICATIONS
-- =============================================

INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id, is_read) VALUES
  ('a3000000-0000-0000-0000-000000000004', 'ID Verification Pending', 'Your ID verification is pending. An admin will review it shortly.', 'verification', 'verification', 'd1000000-0000-0000-0000-000000000004', false),
  ('a3000000-0000-0000-0000-000000000004', 'New Agreement Offer', 'You have received a new agreement offer from Metro Constructions', 'agreement', 'agreement', 'aa000000-0000-0000-0000-000000000005', false),
  ('a1000000-0000-0000-0000-000000000001', 'Order Delivered', 'Your order ORD-2024-0001 has been delivered successfully', 'order', 'order', 'bb000000-0000-0000-0000-000000000001', true),
  ('a5000000-0000-0000-0000-000000000003', 'New Delivery Assignment', 'You have been assigned a new delivery for Order ORD-2024-0002', 'order', 'order', 'bb000000-0000-0000-0000-000000000002', false),
  ('a6000000-0000-0000-0000-000000000001', 'New Verification Request', 'Worker Ganesh Babu has submitted ID for verification', 'verification', 'verification', 'd1000000-0000-0000-0000-000000000004', false);
