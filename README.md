# BuildMart - Construction Materials & Labor Marketplace

A production-grade mobile application prototype for a construction materials and on-demand labor marketplace. Built with React Native (Expo) and TypeScript.

## Overview

BuildMart connects customers and contractors with construction material suppliers and skilled workers. The app supports 6 distinct user roles with tailored experiences for each.

### Key Features

- **Heavy Materials Delivery**: 30-60 minute delivery for construction materials
- **Labor Marketplace**: Short-term bookings and long-term digital agreements
- **Wallet System**: Escrow-based payments for secure transactions
- **Hybrid Fulfillment**: Concierge service for out-of-stock items
- **Admin Verification**: Worker ID verification system

## Tech Stack

- **Frontend**: React Native (Expo SDK 51) with TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand
- **Navigation**: Expo Router (file-based routing)
- **Database**: PostgreSQL (NeonDB) - Schema provided
- **Maps**: React Native Maps (placeholder coordinates)

## User Roles

| Role | Description | Key Features |
|------|-------------|--------------|
| **Customer** | Homeowners ordering materials and hiring workers | Browse shop, book workers, track orders |
| **Contractor** | Power users with bulk orders and long-term hiring | Create digital agreements, bulk ordering |
| **Worker** | Skilled laborers accepting jobs | Working/Waiting status, ID verification, agreements |
| **Shopkeeper** | Store owners managing inventory | Order management, inventory alerts, driver assignment |
| **Driver** | Delivery personnel (shop or freelance) | Delivery tracking, concierge tasks |
| **Admin** | Platform administrators | Worker verification, user management |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator (or Expo Go app)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

### Test Credentials (Quick Login)

| Role | Phone Number | Name |
|------|--------------|------|
| Customer | 9876543101 | Rahul Sharma |
| Contractor | 9876543201 | Rajesh Constructions |
| Worker (Verified) | 9876543301 | Ramu Yadav |
| Worker (Unverified) | 9876543304 | Ganesh Babu |
| Shopkeeper | 9876543401 | Anand Hardware |
| Driver | 9876543501 | Krishna Driver |
| Admin | 9876543601 | Admin One |

## Project Structure

```
├── app/                      # Expo Router pages
│   ├── (auth)/              # Authentication screens
│   │   ├── index.tsx        # Welcome screen
│   │   └── login.tsx        # Phone login
│   └── (app)/               # Main app screens
│       ├── (tabs)/          # Tab-based navigation
│       │   ├── index.tsx    # Role-based dashboard
│       │   ├── shop.tsx     # Product catalog
│       │   ├── workers.tsx  # Worker listings
│       │   ├── orders.tsx   # Order management
│       │   ├── agreements.tsx
│       │   ├── wallet.tsx
│       │   └── ...
│       ├── checkout.tsx     # Checkout flow
│       ├── hire.tsx         # Worker booking
│       └── agreement/
│           └── create.tsx   # Agreement wizard
├── src/
│   ├── components/
│   │   └── dashboards/      # Role-specific dashboards
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication state
│   ├── store/
│   │   └── useStore.ts      # Zustand stores
│   ├── services/
│   │   └── mockData.ts      # Mock API services
│   ├── hooks/
│   │   └── useWalletLogic.ts
│   ├── types/
│   │   └── database.ts      # TypeScript definitions
│   └── utils/
│       └── helpers.ts       # Utility functions
├── database/
│   ├── schema.sql           # PostgreSQL schema
│   └── seed.sql             # Seed data
└── QA_TESTING_CHECKLIST.md  # Testing scenarios
```

## Database Schema

The app uses PostgreSQL with the following main tables:

- `users` - All user accounts with role differentiation
- `worker_profiles` - Extended worker information
- `shops` - Shopkeeper stores
- `products` / `inventory` - Product catalog
- `orders` / `order_items` - Material orders
- `agreements` - Long-term contracts
- `labor_requests` - Short-term job bookings
- `wallets` / `transactions` - Payment system
- `verifications` - Worker ID verification

See `database/schema.sql` for complete schema and `database/seed.sql` for sample data.

## Key Flows

### 1. Material Ordering
1. Customer browses products by category
2. Adds items to cart (single shop per order)
3. Proceeds to checkout with delivery address
4. Funds held in escrow
5. Shopkeeper accepts/processes order
6. Driver assigned and delivers
7. Funds released on delivery

### 2. Long-term Agreement (Contractor)
1. Contractor selects verified worker
2. Creates agreement with terms:
   - Duration (start/end dates)
   - Rate (daily/weekly/monthly)
   - Scope of work
   - Termination terms
3. Worker receives notification
4. Worker signs agreement
5. Funds held in escrow
6. Periodic releases based on work

### 3. Worker Verification (Admin)
1. Worker uploads ID documents
2. Admin reviews submissions
3. Approve/Reject with notes
4. Worker profile updated
5. Verified workers can accept jobs

### 4. Hybrid Fulfillment (Concierge)
1. Order placed with Shop A
2. Shop A marks item as out-of-stock
3. System finds alternate Shop B
4. Concierge task created for driver
5. Driver picks from Shop B
6. Completes original order
7. Driver receives bonus

## Wallet & Escrow System

- Every user has a wallet balance
- Orders/agreements hold funds in escrow
- Funds released on completion
- Refunds on cancellation
- Transaction history tracked

## Testing

See `QA_TESTING_CHECKLIST.md` for comprehensive testing scenarios covering:

1. Customer order flow
2. Contractor agreement creation
3. Worker job acceptance
4. Agreement signing
5. Shopkeeper order management
6. Concierge (out-of-stock) handling
7. Driver delivery completion
8. Admin worker verification
9. Wallet/escrow transactions
10. Multi-role navigation

## Development Notes

- **Mock Data**: All data is mocked for prototype purposes
- **Authentication**: Simulated phone OTP (use "123456")
- **Payments**: Wallet system is simulated
- **Maps**: Using dummy Bangalore coordinates
- **Images**: Placeholder icons used

## Next Steps for Production

1. Connect to real NeonDB PostgreSQL database
2. Implement actual phone OTP via Twilio/Firebase
3. Add real payment gateway (Razorpay/Stripe)
4. Integrate Google Maps with real locations
5. Add push notifications (Expo Notifications)
6. Implement image upload (Cloudinary/S3)
7. Add real-time updates (WebSockets/Supabase)
8. Performance optimization and caching

## License

Private - For demonstration purposes only.

---

Built with React Native & Expo
