# BuildMart — Supabase Setup Guide

This guide walks you through setting up the Supabase backend for BuildMart from scratch.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**.
3. Fill in:
   - **Organization**: your org or personal account
   - **Project Name**: `buildmart`
   - **Database Password**: choose a strong password and save it somewhere safe
   - **Region**: `Southeast Asia (Singapore)` — closest to Hyderabad
4. Click **Create new project** and wait ~2 minutes for provisioning.

---

## 2. Run schema.sql in the SQL Editor

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open `supabase/schema.sql` from this repo and paste the entire contents.
4. Click **Run** (or press Ctrl+Enter).
5. You should see "Success. No rows returned." — this means all tables and indexes were created.

> If you see errors about types already existing, that is fine — it means you are re-running. The ENUMs are created with `CREATE TYPE IF NOT EXISTS` logic. If you need a clean slate, go to **Database > Tables** and drop everything first, or use `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` before running.

---

## 3. Run policies.sql

1. In the SQL Editor, click **New query**.
2. Open `supabase/policies.sql` and paste the entire contents.
3. Click **Run**.
4. This enables Row-Level Security on all tables and sets up the access policies.

> Note: Our backend uses the **service role key** (`supabaseAdmin`), which bypasses all RLS policies. The RLS policies only protect direct client-side access (e.g., if someone uses the anon key directly from a mobile app).

---

## 4. Run seed.sql

1. In the SQL Editor, click **New query**.
2. Open `supabase/seed.sql` and paste the entire contents.
3. Click **Run**.
4. This inserts sample users, a shop, products, inventory, wallets, orders, labor requests, and notifications.

---

## 5. Get Your API Keys

1. In your Supabase dashboard, click **Project Settings** (gear icon in the left sidebar).
2. Click **API** under the Configuration section.
3. You will find:

| Key | Where to find it | Description |
|-----|-----------------|-------------|
| **Project URL** | `Project URL` field | Base URL like `https://xyzxyz.supabase.co` |
| **anon / public key** | `Project API keys > anon public` | Safe to use in frontend apps |
| **service_role key** | `Project API keys > service_role secret` | Backend-only, bypasses RLS — keep secret |

---

## 6. Update Your .env File

Create (or update) the `.env` file in `/backend/`:

```env
# Supabase
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# JWT
JWT_SECRET=your_random_256_bit_secret_here

# Server
PORT=3000
NODE_ENV=development
```

Replace `YOUR_PROJECT_ID`, `your_anon_key_here`, and `your_service_role_key_here` with the values from step 5.

For `JWT_SECRET`, generate a strong random string — for example:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 7. Seed Users — Phone Numbers and Roles

These are the test users inserted by `seed.sql`. Use their phone numbers to log in via `POST /api/auth/login`.

| Phone | Name | Role | Description |
|-------|------|------|-------------|
| `9000000001` | Rajesh Kumar | `customer` | Customer who places material orders and hires workers |
| `9000000002` | Ravi Shankar | `worker` | Mason worker with 8 years experience, KYC verified |
| `9000000003` | Venkat Reddy | `shopkeeper` | Owns "Sri Venkat Building Materials" shop |
| `9000000004` | Suresh Babu | `contractor` | Contractor who places bulk orders and hires via agreements |
| `9000000005` | Krishna Rao | `driver` | Freelance delivery driver with mini truck |
| `9000000006` | Admin BuildMart | `admin` | Platform administrator with full access |

### Login Example

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "9000000001"}'
```

This returns a JWT token. Use it as `Authorization: Bearer <token>` for all authenticated routes.

---

## 8. Verify the Setup

After running all SQL files and starting the backend:

```bash
cd /path/to/Buildmart/backend
npm run dev
```

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

Test admin dashboard (log in as admin first to get token):
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9000000006"}' | jq -r '.token')

curl http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## Troubleshooting

- **"relation does not exist"**: You skipped schema.sql or it failed — re-run it.
- **"permission denied for table"**: Your `.env` is using the anon key instead of the service role key for `SUPABASE_SERVICE_KEY`.
- **"invalid JWT"**: Your `JWT_SECRET` in `.env` does not match the one used to sign the token.
- **Seed conflicts**: All seed inserts use `ON CONFLICT DO NOTHING`, so re-running is safe.
