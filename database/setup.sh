#!/bin/bash

# Database Setup Script for Neon DB
# This script helps you set up your Neon database

set -e

echo "🚀 Neon DB Setup Script"
echo "======================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set it in your .env file or export it:"
    echo "  export DATABASE_URL='postgresql://user:password@host/database?sslmode=require'"
    echo ""
    echo "Or create a .env file with:"
    echo "  DATABASE_URL=postgresql://user:password@host/database?sslmode=require"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "⚠️  Warning: psql is not installed"
    echo "You can either:"
    echo "  1. Install PostgreSQL client tools"
    echo "  2. Use Neon SQL Editor instead (recommended)"
    echo ""
    echo "To use Neon SQL Editor:"
    echo "  1. Go to https://console.neon.tech"
    echo "  2. Open SQL Editor"
    echo "  3. Copy and paste contents of schema.sql, then seed.sql"
    exit 1
fi

echo "📋 Step 1: Creating database schema..."
psql "$DATABASE_URL" -f database/schema.sql
echo "✅ Schema created successfully"
echo ""

echo "🌱 Step 2: Seeding database with initial data..."
psql "$DATABASE_URL" -f database/seed.sql
echo "✅ Database seeded successfully"
echo ""

echo "✨ Setup complete!"
echo ""
echo "You can now verify the setup by running:"
echo "  psql \"$DATABASE_URL\" -c \"SELECT COUNT(*) FROM users;\""
echo ""
echo "Expected counts:"
echo "  - Users: 30"
echo "  - Products: 20"
echo "  - Shops: 5"
echo ""
