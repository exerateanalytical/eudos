# Bitcoin Payment System - Testing Guide

## Overview
This guide covers end-to-end testing scenarios for the Bitcoin payment integration system.

## Prerequisites
- Access to testnet Bitcoin (use faucets: https://testnet-faucet.com/btc-testnet/)
- BlockCypher testnet API token
- Test user accounts with different roles

## Test Scenarios

### 1. Address Assignment Testing

#### Test Case 1.1: XPUB-Based Address Derivation
**Steps:**
1. Add active XPUB via Admin → Bitcoin Settings
2. Create a new order with Bitcoin payment
3. Verify unique address is generated
4. Check derivation index increments

**Expected Results:**
- ✅ Unique bc1q/tb1q address assigned
- ✅ Derivation index increases by 1
- ✅ Address stored in `bitcoin_addresses` table
- ✅ Assignment email sent to user

**Database Verification:**
```sql
SELECT address, derivation_index, assigned_to_order, is_used 
FROM bitcoin_addresses 
WHERE assigned_to_order = 'ORD-XXXXXXX-XXXXX';
```

#### Test Case 1.2: Pre-Seeded Address Assignment (Fallback)
**Steps:**
1. Disable all XPUBs
2. Ensure pre-seeded addresses exist
3. Create new order with Bitcoin payment
4. Verify pre-seeded address is assigned

**Expected Results:**
- ✅ Pre-seeded address assigned
- ✅ Address marked as used
- ✅ No new derivation occurred
- ✅ Assignment email sent

#### Test Case 1.3: Address Expiration
**Steps:**
1. Create order with Bitcoin payment
2. Wait for expiration time (2 hours default)
3. Verify address released back to pool

**Expected Results:**
- ✅ Address `is_used` set to false
- ✅ `assigned_to_order` set to NULL
- ✅ Address available for reassignment

**Cron Job Verification:**
```sql
SELECT * FROM bitcoin_addresses 
WHERE reserved_until < NOW() 
AND payment_confirmed = false;
```

### 2. Payment Detection Testing

#### Test Case 2.1: Payment Detection via Manual Check
**Steps:**
1. Get assigned Bitcoin address
2. Send testnet BTC to address (use exact amount)
3. Navigate to order details
4. Click "Check Payment Status"
5. Wait for BlockCypher API response

**Expected Results:**
- ✅ Transaction detected
- ✅ Amount validation passes (±2% tolerance)
- ✅ Confirmation count displayed
- ✅ Status updates to "processing" after 1+ confirmations

**Network Request Verification:**
- Check browser DevTools → Network tab
- Verify `verify-bitcoin-payment` function call
- Response should include `confirmations` count

#### Test Case 2.2: Automated Payment Check (Cron)
**Steps:**
1. Send BTC payment to assigned address
2. Wait for automated check (runs every 2 minutes)
3. Check edge function logs
4. Verify order status updated

**Expected Results:**
- ✅ Logs show "Found X pending Bitcoin orders"
- ✅ Payment detected automatically
- ✅ Order status transitions to "processing"
- ✅ Email notification sent

**Log Verification:**
```bash
# Check edge function logs
# Look for: "Payment confirmed for order ORD-..."
```

#### Test Case 2.3: Partial Payment Detection
**Steps:**
1. Send 50% of required BTC amount
2. Check payment status
3. Verify validation fails

**Expected Results:**
- ✅ Payment detected but not confirmed
- ✅ Error: "Payment amount insufficient"
- ✅ Order remains in "pending_payment" status

#### Test Case 2.4: Overpayment Tolerance
**Steps:**
1. Send 102% of required BTC amount
2. Check payment status

**Expected Results:**
- ✅ Payment accepted (within +2% tolerance)
- ✅ Order confirmed successfully

### 3. Transaction Recording Testing

#### Test Case 3.1: Transaction Hash Storage
**Steps:**
1. Complete successful payment
2. Query `transactions` table
3. Verify Bitcoin TX hash stored

**Expected Results:**
- ✅ `bitcoin_tx_hash` column populated
- ✅ Transaction visible in user dashboard
- ✅ Hash links to BlockCypher explorer

**Database Query:**
```sql
SELECT bitcoin_tx_hash, status, amount 
FROM transactions 
WHERE order_id = 'order-uuid-here';
```

#### Test Case 3.2: Escrow Status Update
**Steps:**
1. Complete payment with 1+ confirmations
2. Check `escrow_transactions` table
3. Verify status transition

**Expected Results:**
- ✅ Escrow status changes from "pending" → "held"
- ✅ Confirmation timestamp recorded
- ✅ Bitcoin address linked to escrow record

### 4. Address Pool Management Testing

#### Test Case 4.1: Auto-Replenishment Trigger
**Steps:**
1. Reduce available addresses to below threshold (20)
2. Wait for replenishment cron (6 hours) or trigger manually
3. Check admin email notifications
4. Verify new addresses generated

**Expected Results:**
- ✅ Admin alert email sent
- ✅ New addresses derived from active XPUB
- ✅ Pool refilled to target size (100)
- ✅ Edge function logs show "Replenishment complete"

**Manual Trigger:**
```bash
# Call replenish-bitcoin-addresses function manually via Lovable Cloud
```

#### Test Case 4.2: Low Address Pool Warning
**Steps:**
1. Assign addresses until pool < 20
2. Check System Health Dashboard
3. Verify admin alerts

**Expected Results:**
- ✅ Dashboard shows "Low Address Pool" warning
- ✅ Admin notification created
- ✅ Replenishment function auto-triggered

### 5. Email Notification Testing

#### Test Case 5.1: Address Assignment Email
**Steps:**
1. Create new order
2. Check recipient email inbox
3. Verify email content

**Expected Results:**
- ✅ Email received within 30 seconds
- ✅ Contains Bitcoin address and QR code
- ✅ Shows correct payment amount in BTC
- ✅ Includes expiration time (2 hours)

**Email Content Checklist:**
- [ ] Bitcoin address displayed
- [ ] QR code rendered
- [ ] Amount in BTC and USD
- [ ] Payment instructions
- [ ] Expiration warning

#### Test Case 5.2: Payment Detected Email
**Steps:**
1. Send payment to address
2. Wait for detection (manual or automated)
3. Check email

**Expected Results:**
- ✅ "Payment Detected" email sent
- ✅ Shows confirmation count
- ✅ Transaction hash included
- ✅ BlockCypher explorer link works

#### Test Case 5.3: Payment Confirmed Email
**Steps:**
1. Wait for 1+ blockchain confirmations
2. Check email after confirmation

**Expected Results:**
- ✅ "Payment Confirmed" email sent
- ✅ Order marked as processing
- ✅ Estimated completion time mentioned

### 6. System Health Monitoring Testing

#### Test Case 6.1: Database Connectivity Check
**Steps:**
1. Open Admin → System Health Dashboard
2. Verify database status is "Connected"
3. Simulate database issue (if possible)
4. Verify alert generated

**Expected Results:**
- ✅ Green status when healthy
- ✅ Red status on failure
- ✅ Admin alert created on failure

#### Test Case 6.2: BlockCypher API Health
**Steps:**
1. Check System Health Dashboard
2. Verify API response time < 2000ms
3. Test with invalid API token
4. Verify error detection

**Expected Results:**
- ✅ API status shows "Operational"
- ✅ Response time displayed
- ✅ Alert on failure

#### Test Case 6.3: Pending Payment Monitoring
**Steps:**
1. Create multiple pending orders
2. Check System Health Dashboard
3. Verify pending count accurate

**Expected Results:**
- ✅ Shows count of pending Bitcoin payments
- ✅ Warning if > 50 pending orders
- ✅ Alert if > 100 pending orders

### 7. Security Testing

#### Test Case 7.1: RLS Policy Verification
**Steps:**
1. Login as regular user
2. Attempt to access another user's Bitcoin address
3. Verify access denied

**Database Test:**
```sql
-- Should return empty if not your order
SELECT * FROM bitcoin_addresses 
WHERE assigned_to_order = 'someone-elses-order';
```

**Expected Results:**
- ✅ Users can only see their own addresses
- ✅ Admin can see all addresses
- ✅ Unauthorized access blocked

#### Test Case 7.2: XPUB Protection
**Steps:**
1. Login as regular user
2. Attempt to query `bitcoin_xpubs` table
3. Verify access denied

**Expected Results:**
- ✅ Only admins can view XPUBs
- ✅ XPUB never exposed in client-side code
- ✅ Derivation happens server-side only

#### Test Case 7.3: Rate Limiting
**Steps:**
1. Trigger multiple payment checks rapidly
2. Verify rate limiting applied

**Expected Results:**
- ✅ Maximum 1 check per 10 seconds per order
- ✅ User notified of rate limit
- ✅ No excessive API calls to BlockCypher

### 8. Edge Cases & Error Handling

#### Test Case 8.1: Expired Address Payment
**Steps:**
1. Let address expire (2 hours)
2. Send payment to expired address
3. Check if payment still detected

**Expected Results:**
- ✅ Payment detected with warning
- ✅ Admin notification sent
- ✅ Manual review required

#### Test Case 8.2: Double Payment Prevention
**Steps:**
1. Pay once successfully
2. Attempt to pay same order again
3. Verify system handles gracefully

**Expected Results:**
- ✅ Second payment rejected
- ✅ User warned order already paid
- ✅ No double-confirmation

#### Test Case 8.3: Network Congestion
**Steps:**
1. Send payment with very low fee
2. Wait for detection
3. Verify 0-confirmation handling

**Expected Results:**
- ✅ 0-conf payment detected but not confirmed
- ✅ Order remains "pending_payment"
- ✅ User instructed to wait for confirmations

#### Test Case 8.4: BlockCypher API Failure
**Steps:**
1. Use invalid API token
2. Trigger payment check
3. Verify graceful error handling

**Expected Results:**
- ✅ User-friendly error message shown
- ✅ Admin alert generated
- ✅ System attempts retry

### 9. Performance Testing

#### Test Case 9.1: Bulk Order Processing
**Steps:**
1. Create 50 orders simultaneously
2. Verify all get unique addresses
3. Check response times

**Expected Results:**
- ✅ All orders get addresses < 5 seconds
- ✅ No address collisions
- ✅ Database handles concurrent requests

#### Test Case 9.2: Payment Check Performance
**Steps:**
1. Have 100 pending payments
2. Trigger automated check
3. Measure execution time

**Expected Results:**
- ✅ Batch check completes < 60 seconds
- ✅ No timeout errors
- ✅ All payments checked accurately

### 10. User Dashboard Testing

#### Test Case 10.1: Payment History Display
**Steps:**
1. Login as user with payment history
2. Navigate to "My Payments"
3. Verify all payments listed

**Expected Results:**
- ✅ Shows all user's Bitcoin payments
- ✅ Displays status, amount, confirmations
- ✅ Real-time updates via polling
- ✅ Export functionality works

#### Test Case 10.2: QR Code Display
**Steps:**
1. View pending payment details
2. Verify QR code renders
3. Test scanning with Bitcoin wallet

**Expected Results:**
- ✅ QR code scannable
- ✅ Contains correct address and amount
- ✅ Compatible with major wallets

## Test Data Cleanup

After testing, clean up test data:

```sql
-- Delete test orders
DELETE FROM orders WHERE order_number LIKE 'TEST-%';

-- Release test addresses
UPDATE bitcoin_addresses 
SET is_used = false, assigned_to_order = NULL 
WHERE address LIKE 'tb1q%'; -- testnet addresses

-- Clear test notifications
DELETE FROM notifications WHERE created_at > NOW() - INTERVAL '1 hour';
```

## Continuous Testing Checklist

- [ ] Address derivation works correctly
- [ ] Payment detection accurate (±2% tolerance)
- [ ] Email notifications delivered
- [ ] Escrow status updates properly
- [ ] Address pool auto-replenishes
- [ ] System health monitoring functional
- [ ] RLS policies enforced
- [ ] Error handling graceful
- [ ] Performance acceptable under load
- [ ] User dashboard displays correctly

## Reporting Issues

If any test fails:
1. Check edge function logs for errors
2. Verify database state with SQL queries
3. Check browser console for client-side errors
4. Review network requests in DevTools
5. Document expected vs actual behavior

## Production Readiness Criteria

✅ All test cases pass
✅ No security vulnerabilities
✅ Performance benchmarks met
✅ Error handling comprehensive
✅ Monitoring and alerts functional
✅ Documentation complete
