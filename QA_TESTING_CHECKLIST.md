# QA Testing Checklist - BuildMart Construction Marketplace

## Overview
This document outlines the testing scenarios for the BuildMart mobile application prototype. Each scenario covers a critical user flow or feature that must be verified.

---

## Phase 5: QA Testing Scenarios (10 Critical Tests)

### Test 1: Customer Material Order Flow
**Objective:** Verify complete order placement and checkout process

**Steps:**
1. Login as Customer (phone: `9876543101`)
2. Navigate to Shop tab
3. Browse products by category (e.g., Cement)
4. Add "UltraTech Cement 50kg" (qty: 10) to cart
5. Add "Cement Nails 3 inch" (qty: 5) to cart
6. Go to Checkout
7. Verify order summary shows correct:
   - Subtotal
   - GST (18%)
   - Delivery fee (free if > ₹5000)
   - Total
8. Enter delivery address
9. Verify wallet balance is sufficient
10. Place order

**Expected Result:**
- Order is created with status "Pending"
- Funds are held from wallet (escrow)
- User sees confirmation
- Order appears in "My Orders"

---

### Test 2: Contractor Creates Long-term Agreement
**Objective:** Verify agreement creation workflow for contractors

**Steps:**
1. Login as Contractor (phone: `9876543201`)
2. Navigate to Workers tab
3. Select an available verified worker (e.g., Ramu Yadav)
4. Click "Create Agreement" (or navigate via Contracts tab > New)
5. Fill Step 1: Select Worker
6. Fill Step 2: Agreement Details
   - Title: "Site Labor for New Project"
   - Scope: "Loading, unloading materials"
   - Start Date: Tomorrow's date
   - End Date: 30 days from start
   - Rate Type: Daily
   - Rate Amount: ₹600
   - Work Location: Test address
7. Fill Step 3: Review & Terms
   - Add termination terms
8. Submit agreement

**Expected Result:**
- Agreement created with status "Pending Signature"
- Total value calculated correctly
- Funds held in escrow
- Worker receives notification (mock)

---

### Test 3: Worker Accepts Job Request
**Objective:** Verify worker can view and accept short-term job requests

**Steps:**
1. Login as Worker (phone: `9876543301`)
2. Navigate to Jobs tab
3. View "Requests" tab
4. Find a pending job request
5. Review job details:
   - Customer name
   - Work description
   - Location & distance
   - Duration & rate
6. Click "Accept Job"

**Expected Result:**
- Job moves to "Active" tab
- Status changes to "Accepted"
- Customer notified (mock)
- Worker can see navigation option

---

### Test 4: Worker Signs Agreement
**Objective:** Verify worker can review and sign contractor agreements

**Steps:**
1. Login as Worker (phone: `9876543301`)
2. Navigate to Agreements tab
3. Find agreement with status "Pending Signature"
4. Review agreement details:
   - Title & scope
   - Duration (start/end dates)
   - Rate (daily/weekly/monthly)
   - Total value
   - Termination terms
5. Click "Sign Agreement"

**Expected Result:**
- Agreement status changes to "Active"
- Both parties notified
- Escrow remains held
- Agreement appears in "Active" list

---

### Test 5: Shopkeeper Manages Orders
**Objective:** Verify shopkeeper order management workflow

**Steps:**
1. Login as Shopkeeper (phone: `9876543401`)
2. Navigate to Dashboard
3. View pending orders count
4. Navigate to Orders tab
5. Find a pending order
6. Review order items
7. Click "Accept" on the order
8. Verify order moves to processing

**Expected Result:**
- Order status changes to "Accepted"
- Customer notified
- Order appears in "Active" orders
- Can assign driver later

---

### Test 6: Shopkeeper Handles Out-of-Stock (Concierge Trigger)
**Objective:** Verify hybrid fulfillment logic triggers correctly

**Steps:**
1. Login as Shopkeeper (phone: `9876543401`)
2. Navigate to Inventory tab
3. Find a product with "Low Stock" status
4. Update stock to 0 (out of stock)
5. When an order comes for that product:
   - System should detect unavailability
   - Trigger concierge task creation
   - Notify freelance driver

**Expected Result:**
- Out-of-stock item flagged
- System identifies alternate shop
- Concierge task created
- Driver can see special task with bonus

---

### Test 7: Driver Completes Delivery
**Objective:** Verify driver delivery workflow

**Steps:**
1. Login as Driver (phone: `9876543501`)
2. Navigate to Deliveries tab
3. View "Active" deliveries
4. Select an active delivery
5. View pickup and delivery addresses
6. Click "Navigate" (mock navigation)
7. Mark as "Picked Up"
8. Navigate to customer
9. Mark as "Delivered"

**Expected Result:**
- Delivery status updates correctly
- Pickup → Delivering → Completed
- Earnings added to driver wallet
- Customer order marked as delivered
- Escrow released to shopkeeper

---

### Test 8: Admin Verifies Worker ID
**Objective:** Verify admin worker verification workflow

**Steps:**
1. Login as Admin (phone: `9876543601`)
2. Navigate to Verifications tab
3. View "Pending" verifications
4. Select unverified worker (e.g., Ganesh Babu)
5. Review submitted documents:
   - ID Front image
   - ID Back image
   - Selfie (if submitted)
6. Verify ID type and number
7. Click "Approve" (or "Reject" with reason)

**Expected Result:**
- Worker profile updated (is_verified = true)
- Worker notified of approval
- Worker can now accept jobs
- Verification moves to "Approved" list

---

### Test 9: Wallet Transaction & Escrow Flow
**Objective:** Verify complete wallet payment cycle

**Steps:**
1. Login as Customer (phone: `9876543101`)
2. Check wallet balance
3. Place an order worth ₹5000
4. Verify:
   - Balance decreased by order total
   - Held balance increased
5. Wait for order to be delivered (mock)
6. Verify:
   - Held balance released
   - Shopkeeper wallet credited
   - Driver earnings added

**Expected Result:**
- Escrow system works correctly
- Funds flow: Customer → Hold → Shopkeeper + Driver
- Transaction history shows all movements
- Balances reconcile correctly

---

### Test 10: Multi-Role Navigation & Dashboard
**Objective:** Verify role-based UI rendering

**Steps:**
1. Test each role's dashboard:
   - Customer: Shop, Workers, Orders tabs
   - Contractor: Shop, Hire, Contracts tabs
   - Worker: Jobs, Contracts, Wallet tabs
   - Shopkeeper: Dashboard, Inventory, Orders tabs
   - Driver: Deliveries, Wallet tabs
   - Admin: Dashboard, Verifications, Users tabs

2. For each role verify:
   - Correct tabs appear
   - Dashboard shows relevant info
   - Quick actions work
   - Navigation functions correctly

**Expected Result:**
- Each role sees appropriate tabs
- Dashboard content matches role
- No access to unauthorized features
- Smooth navigation between screens

---

## Test User Credentials (Quick Login)

| Role | Phone | Name |
|------|-------|------|
| Customer | 9876543101 | Rahul Sharma |
| Contractor | 9876543201 | Rajesh Constructions |
| Worker (Verified) | 9876543301 | Ramu Yadav |
| Worker (Unverified) | 9876543304 | Ganesh Babu |
| Shopkeeper | 9876543401 | Anand Hardware |
| Driver | 9876543501 | Krishna Driver |
| Admin | 9876543601 | Admin One |

---

## Additional Edge Cases to Test

### Edge Case A: Insufficient Wallet Balance
- Attempt to place order with balance < total
- Should show "Add Funds" prompt
- Should not allow order placement

### Edge Case B: Worker Declines Agreement
- Worker declines pending agreement
- Escrow should be refunded to contractor
- Agreement status → "Rejected"

### Edge Case C: Order Cancellation
- Customer cancels pending order
- Escrow refunded
- Shopkeeper notified
- Order status → "Cancelled"

### Edge Case D: Unverified Worker Tries to Accept Job
- Should show verification prompt
- Cannot accept until verified
- Clear messaging about requirements

---

## Bug Reporting Template

When reporting issues, include:

```
**Bug Title:** [Brief description]
**Role:** [Customer/Contractor/Worker/Shopkeeper/Driver/Admin]
**Screen:** [Which screen the bug occurred on]
**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happened]
**Screenshots:** [If applicable]
**Device/OS:** [e.g., iPhone 14, iOS 17]
```

---

## Sign-Off Checklist

- [ ] All 10 critical test scenarios passed
- [ ] All 6 user roles tested
- [ ] Wallet/escrow flows verified
- [ ] Navigation works correctly
- [ ] UI renders properly on different screen sizes
- [ ] No critical bugs remaining
- [ ] Performance acceptable (no major lag)

---

*Last Updated: February 2024*
*Version: 1.0.0*
