# BuildMart Design System

This document outlines the design system applied across the entire BuildMart mobile application, based on the provided design specifications.

## Design Principles

### 1. Color Palette

**Backgrounds:**
- Primary Background: `#111827` (bg-gray-900)
- Card/Container Background: `#1F2937` (bg-gray-800)
- Tertiary Background: `#374151` (bg-gray-700)

**Text Colors:**
- Primary Text: `#FFFFFF` (white)
- Secondary Text: `#9CA3AF` (text-gray-400)
- Tertiary Text: `#6B7280` (text-gray-500)
- Placeholder Text: `#6B7280`

**Accent Colors:**
- Primary Orange: `#F97316` (orange-500) - Used for primary actions, active states
- Success Green: `#10B981` (green-500)
- Warning Amber: `#F59E0B` (amber-500)
- Error Red: `#EF4444` (red-500)
- Info Blue: `#3B82F6` (blue-500)
- Purple: `#8B5CF6` (purple-500)

**Borders:**
- Primary Border: `#374151` (border-gray-700)
- Secondary Border: `#4B5563` (border-gray-600)

### 2. Typography

**Headings:**
- H1: 32px, Bold (700), White
- H2: 24px, Bold (700), White
- H3: 20px, Semi-bold (600), White

**Body:**
- Body: 16px, Regular (400)
- Body Small: 14px, Regular (400)

**Labels:**
- Label: 14px, Medium (500)
- Label Small: 12px, Medium (500)

### 3. Spacing

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### 4. Border Radius

- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px (rounded-xl)
- xxl: 24px (rounded-2xl)
- full: 9999px (rounded-full)

### 5. Shadows

**Card Shadow:**
```javascript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
}
```

**Button Shadow (Primary):**
```javascript
{
  shadowColor: '#F97316',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
}
```

**Elevated Shadow:**
```javascript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
}
```

## Component Styles

### Buttons

**Primary Button:**
- Background: `#F97316` (orange-500)
- Text: White, Bold
- Border Radius: `rounded-2xl` (20px)
- Padding: `py-4 px-5` (16px vertical, 20px horizontal)
- Shadow: Orange glow shadow

**Secondary Button:**
- Background: `#374151` (gray-700)
- Text: White, Bold
- Border Radius: `rounded-2xl`
- Padding: `py-4 px-5`

**Outline Button:**
- Background: Transparent
- Border: 1px solid `#374151`
- Text: White, Bold

### Cards

**Standard Card:**
- Background: `#1F2937` (gray-800)
- Border Radius: `rounded-2xl` (20px)
- Padding: `p-5` or `p-6` (20-24px)
- Shadow: Card shadow

**Elevated Card:**
- Same as standard but with elevated shadow

### Input Fields

**Text Input:**
- Background: `#1F2937` (gray-800)
- Border: 1px solid `#374151`
- Border Radius: `rounded-2xl` (20px)
- Padding: `px-4 py-4` (16px)
- Text Color: White
- Placeholder: `#6B7280`

**Search Bar:**
- Same as text input
- Icon on left (search icon)
- Clear button on right (when text exists)

### Navigation

**Bottom Tab Bar:**
- Background: `#1F2937`
- Border Top: 1px solid `#374151`
- Height: 70px
- Active Tab: Orange text and icon (`#F97316`)
- Inactive Tab: Gray text and icon (`#9CA3AF`)
- Font Weight: Semi-bold (600)

**Top Header:**
- Background: `#111827` (matches screen)
- Border Bottom: 1px solid `#374151`
- Padding: `px-5 py-4`
- Title: 32px, Bold, White

### Status Badges/Tags

**Success:**
- Background: `rgba(16, 185, 129, 0.2)`
- Text: `#10B981`, Bold

**Warning:**
- Background: `rgba(245, 158, 11, 0.2)`
- Text: `#F59E0B`, Bold

**Error:**
- Background: `rgba(239, 68, 68, 0.2)`
- Text: `#EF4444`, Bold

**Info:**
- Background: `rgba(59, 130, 246, 0.2)`
- Text: `#3B82F6`, Bold

## Updated Screens

The following screens have been updated to match the design system:

1. ✅ Login Screen (`app/(auth)/login.tsx`)
2. ✅ Customer Dashboard (`src/components/dashboards/CustomerDashboard.tsx`)
3. ✅ Contractor Dashboard (`src/components/dashboards/ContractorDashboard.tsx`)
4. ✅ Worker Dashboard (`src/components/dashboards/WorkerDashboard.tsx`)
5. ✅ Shopkeeper Dashboard (`src/components/dashboards/ShopkeeperDashboard.tsx`)
6. ✅ Driver Dashboard (`src/components/dashboards/DriverDashboard.tsx`)
7. ✅ Admin Dashboard (`src/components/dashboards/AdminDashboard.tsx`)
8. ✅ Shop Screen (`app/(app)/(tabs)/shop.tsx`)
9. ✅ Orders Screen (`app/(app)/(tabs)/orders.tsx`)
10. ✅ Workers Screen (`app/(app)/(tabs)/workers.tsx`)
11. ✅ Wallet Screen (`app/(app)/(tabs)/wallet.tsx`)
12. ✅ Inventory Screen (`app/(app)/(tabs)/inventory.tsx`)
13. ✅ Tab Navigation (`app/(app)/(tabs)/_layout.tsx`)
14. ✅ Index Header (`app/(app)/(tabs)/index.tsx`)

## Reusable Components

Created reusable UI components:

1. **Button Component** (`src/components/ui/Button.tsx`)
   - Supports primary, secondary, outline variants
   - Size options: sm, md, lg
   - Loading states
   - Icon support

2. **Card Component** (`src/components/ui/Card.tsx`)
   - Default, elevated, outlined variants
   - Customizable padding

3. **Design System Constants** (`src/theme/designSystem.ts`)
   - Colors, spacing, typography, shadows
   - Component style definitions

## Key Design Features Applied

1. **Consistent Dark Theme**: All screens use dark gray backgrounds
2. **Rounded Corners**: All cards, buttons, inputs use `rounded-2xl` (20px)
3. **Card-Based Layout**: Content organized in elevated cards with shadows
4. **Orange Accent**: Primary actions use orange (`#F97316`)
5. **Status Colors**: Green for success, yellow for warning, red for errors
6. **Consistent Typography**: Bold headings, medium labels, regular body text
7. **Generous Spacing**: Consistent padding and margins throughout
8. **Shadow Effects**: Cards and buttons have appropriate shadows for depth
9. **Icon Styling**: Icons in rounded containers with colored backgrounds
10. **Active States**: Orange highlights for active tabs, selected items

## Remaining Screens to Update

The following screens may need updates to fully match the design system:

- Agreements Screen (`app/(app)/(tabs)/agreements.tsx`)
- Jobs Screen (`app/(app)/(tabs)/jobs.tsx`)
- Deliveries Screen (`app/(app)/(tabs)/deliveries.tsx`)
- Verifications Screen (`app/(app)/(tabs)/verifications.tsx`)
- Users Screen (`app/(app)/(tabs)/users.tsx`)
- Profile Screen (`app/(app)/(tabs)/profile.tsx`)
- Checkout Screen (`app/(app)/checkout.tsx`)
- Hire Screen (`app/(app)/hire.tsx`)
- Agreement Detail/Create Screens
- Order Detail Screen
- Worker Detail Screen

All screens should follow the same design principles outlined above.
