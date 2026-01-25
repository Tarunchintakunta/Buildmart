# Database Setup Guide for Neon DB

## Prerequisites

1. A Neon DB account and database created
2. Your `DATABASE_URL` connection string from Neon dashboard
3. PostgreSQL client (psql) or Neon SQL Editor

## Step 1: Get Your Connection String

1. Go to your Neon dashboard: https://console.neon.tech
2. Select your project
3. Copy the connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)
4. Set it in your `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

## Step 2: Run the Schema

You have two options:

### Option A: Using Neon SQL Editor (Recommended)

1. Go to your Neon dashboard
2. Click on "SQL Editor"
3. Copy the entire contents of `schema.sql`
4. Paste and run it in the SQL Editor
5. Wait for all tables to be created

### Option B: Using psql Command Line

```bash
# From the project root directory
psql $DATABASE_URL -f database/schema.sql
```

Or if you have the connection string:
```bash
psql "postgresql://user:password@host/database?sslmode=require" -f database/schema.sql
```

## Step 3: Seed the Database

After the schema is created, run the seed data:

### Option A: Using Neon SQL Editor

1. In the SQL Editor, copy the entire contents of `seed.sql`
2. Paste and run it
3. Verify data was inserted

### Option B: Using psql

```bash
psql $DATABASE_URL -f database/seed.sql
```

## Step 4: Verify Setup

Run this query in Neon SQL Editor to verify:

```sql
-- Check users
SELECT COUNT(*) as user_count FROM users;

-- Check products
SELECT COUNT(*) as product_count FROM products;

-- Check shops
SELECT COUNT(*) as shop_count FROM shops;

-- Should return: 30 users, 20 products, 5 shops
```

## Test Users Created

After seeding, you can use these phone numbers to login:
- Customer: `9876543101`
- Contractor: `9876543201`
- Worker: `9876543301`
- Shopkeeper: `9876543401`
- Driver: `9876543501`
- Admin: `9876543601`

## Next Steps

⚠️ **Important**: The mobile app currently uses **mock data**. To connect it to your Neon DB, you'll need to:

1. Create a backend API (Node.js/Express, Python/FastAPI, etc.)
2. Replace mock data calls with API calls
3. Use the `DATABASE_URL` in your backend, not in the mobile app directly

The mobile app should call your backend API, and the backend connects to Neon DB.

## Troubleshooting

### Connection Issues
- Make sure your `DATABASE_URL` includes `?sslmode=require`
- Check that your Neon project is active
- Verify your IP is allowed (Neon allows all by default)

### Schema Errors
- Make sure you run `schema.sql` before `seed.sql`
- Check that UUID extension is enabled
- Verify all ENUM types are created first

### Seed Errors
- Ensure all foreign key relationships exist
- Check that UUIDs match between related tables
- Verify no duplicate phone numbers or unique constraints
