# Bitcoin Payment System - Troubleshooting Guide

## Quick Diagnostic Checklist

When encountering issues, work through this checklist:

- [ ] Check edge function logs
- [ ] Verify database state
- [ ] Check browser console for errors
- [ ] Review network requests in DevTools
- [ ] Verify Lovable Cloud status
- [ ] Check BlockCypher API status
- [ ] Review system health dashboard

---

## Common Issues & Solutions

### 1. Address Assignment Failures

#### Symptom 1.1: No Address Assigned to Order
**Error Message:** "Failed to assign Bitcoin address"

**Diagnostic Steps:**
1. Check `assign-bitcoin-address` edge function logs
2. Verify active XPUB exists:
   ```sql
   SELECT * FROM bitcoin_xpubs WHERE is_active = true;
   ```
3. Check available address pool:
   ```sql
   SELECT COUNT(*) FROM bitcoin_addresses WHERE is_used = false;
   ```

**Common Causes & Fixes:**

**Cause 1:** No active XPUB and no available addresses
```sql
-- Check both conditions
SELECT 
  (SELECT COUNT(*) FROM bitcoin_xpubs WHERE is_active = true) as active_xpubs,
  (SELECT COUNT(*) FROM bitcoin_addresses WHERE is_used = false) as available_addresses;
```
**Fix:** Add active XPUB or import pre-seeded addresses via Admin → Bitcoin Settings

**Cause 2:** Edge function timeout
**Fix:** Check Lovable Cloud status, retry operation, check function logs for specific error

**Cause 3:** Database connection issue
**Fix:** Verify Lovable Cloud database status, check RLS policies

---

#### Symptom 1.2: Duplicate Address Assigned
**Error Message:** Multiple orders have same Bitcoin address

**Diagnostic Query:**
```sql
SELECT address, COUNT(*) as order_count, 
       array_agg(assigned_to_order) as orders
FROM bitcoin_addresses 
WHERE assigned_to_order IS NOT NULL
GROUP BY address 
HAVING COUNT(*) > 1;
```

**Common Causes & Fixes:**

**Cause:** Race condition in address reservation
**Fix:** 
1. Manually reassign addresses:
   ```sql
   -- Keep first assignment, clear others
   UPDATE bitcoin_addresses 
   SET is_used = false, assigned_to_order = NULL
   WHERE id IN (
     SELECT id FROM bitcoin_addresses 
     WHERE address = 'duplicate-address-here'
     ORDER BY assigned_at DESC 
     OFFSET 1
   );
   ```
2. Review `get_available_bitcoin_address()` function for proper locking

---

### 2. Payment Detection Issues

#### Symptom 2.1: Payment Sent But Not Detected
**User Report:** "I sent Bitcoin but order still says pending"

**Diagnostic Steps:**
1. Get order's Bitcoin address:
   ```sql
   SELECT ba.address, o.order_number, o.total_amount
   FROM orders o
   JOIN bitcoin_addresses ba ON ba.assigned_to_order = o.id
   WHERE o.order_number = 'ORD-XXXXXXX-XXXXX';
   ```

2. Check blockchain explorer:
   - Mainnet: `https://live.blockcypher.com/btc/address/{address}/`
   - Testnet: `https://live.blockcypher.com/btc-testnet/address/{address}/`

3. Check `verify-bitcoin-payment` edge function logs

4. Manually trigger verification:
   - Navigate to order page
   - Click "Check Payment Status"

**Common Causes & Fixes:**

**Cause 1:** Payment not yet confirmed on blockchain
**Fix:** Wait 10-30 minutes for transaction to propagate, then retry check

**Cause 2:** BlockCypher API error
**Check logs for:**
```
Error fetching address data: 429 Rate limit exceeded
Error fetching address data: 401 Unauthorized
```
**Fix:** 
- If 429: Wait for rate limit reset (typically 1 hour)
- If 401: Verify `BLOCKCYPHER_API_TOKEN` secret is correct
- Consider upgrading BlockCypher plan for higher limits

**Cause 3:** Amount mismatch (outside ±2% tolerance)
**Diagnostic:**
```sql
SELECT o.total_amount as expected_usd,
       ba.address,
       -- Check if BTC price was stored
       (o.metadata->>'btc_price_at_order')::numeric as btc_price_at_order
FROM orders o
JOIN bitcoin_addresses ba ON ba.assigned_to_order = o.id
WHERE o.order_number = 'ORD-XXXXXXX-XXXXX';
```
**Fix:** 
- If amount close but outside tolerance, manually approve
- Update order status manually:
  ```sql
  UPDATE orders SET status = 'processing' WHERE id = 'order-uuid';
  UPDATE bitcoin_addresses SET payment_confirmed = true WHERE assigned_to_order = 'order-uuid';
  ```

**Cause 4:** Network mismatch (mainnet vs testnet)
**Diagnostic:** Check if address prefix matches network:
- Mainnet addresses start with: `bc1`, `1`, `3`
- Testnet addresses start with: `tb1`, `m`, `n`, `2`

**Fix:** Verify `BITCOIN_NETWORK` environment variable matches intended network

---

#### Symptom 2.2: Payment Detected But Not Confirmed
**Status:** Payment shows "Detected" but never moves to "Confirmed"

**Diagnostic Steps:**
1. Check transaction confirmations on blockchain explorer
2. Verify cron job running:
   ```bash
   # Check edge function logs for btc-check-payments
   # Should see: "Starting automated payment check..." every 2 minutes
   ```

**Common Causes & Fixes:**

**Cause 1:** Transaction stuck with 0 confirmations (low fee)
**Blockchain shows:** 0 confirmations for extended period
**Fix:** 
- If urgent: Contact user to RBF (Replace-By-Fee) or CPFP
- If not urgent: Wait - will eventually confirm
- Admin can manually confirm after verification:
  ```sql
  UPDATE bitcoin_addresses SET payment_confirmed = true WHERE address = 'address-here';
  UPDATE orders SET status = 'processing' WHERE id = 'order-uuid';
  ```

**Cause 2:** Cron job not running
**Check:** Edge function logs show no recent executions
**Fix:** Verify cron configuration in Lovable Cloud

**Cause 3:** Edge function throwing errors
**Check logs for:**
```
Error in payment verification
TypeError: Cannot read property 'txrefs' of undefined
```
**Fix:** 
- Review error details in logs
- Check if BlockCypher API response format changed
- Verify database connection

---

### 3. Email Notification Failures

#### Symptom 3.1: No Email Sent After Address Assignment
**User Report:** "I placed order but didn't get Bitcoin payment email"

**Diagnostic Steps:**
1. Check `send-bitcoin-payment-email` edge function logs
2. Verify Resend API key:
   ```bash
   # Check if secret exists (value hidden for security)
   # Lovable Cloud → Settings → Secrets → RESEND_API_KEY
   ```
3. Check user's email in database:
   ```sql
   SELECT p.email, o.order_number 
   FROM profiles p 
   JOIN orders o ON o.user_id = p.id 
   WHERE o.order_number = 'ORD-XXXXXXX-XXXXX';
   ```

**Common Causes & Fixes:**

**Cause 1:** Resend API error
**Check logs for:**
```
Error sending email: 403 Forbidden
Error sending email: 401 Unauthorized
```
**Fix:**
- If 401: Update `RESEND_API_KEY` secret
- If 403: Verify sending domain configured in Resend dashboard
- If rate limit: Wait or upgrade Resend plan

**Cause 2:** Invalid email address
**Diagnostic:**
```sql
-- Check for invalid emails
SELECT email FROM profiles 
WHERE email NOT LIKE '%@%.%' 
OR email IS NULL;
```
**Fix:** Update user's email address

**Cause 3:** Email in spam folder
**Fix:** 
- Ask user to check spam/junk
- Whitelist sender domain in Resend
- Improve email SPF/DKIM records

**Cause 4:** Edge function not invoked
**Check:** `assign-bitcoin-address` logs don't show email function call
**Fix:** Review address assignment logic, ensure email function called after successful assignment

---

### 4. Address Pool Exhaustion

#### Symptom 4.1: "No Available Addresses" Error
**Error Message:** "Unable to assign address - pool exhausted"

**Diagnostic Query:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE is_used = false) as available,
  COUNT(*) FILTER (WHERE is_used = true AND payment_confirmed = false) as reserved,
  COUNT(*) FILTER (WHERE payment_confirmed = true) as used,
  COUNT(*) as total
FROM bitcoin_addresses;
```

**Common Causes & Fixes:**

**Cause 1:** No addresses available and no active XPUB
**Fix:** 
- **Option A (Recommended):** Add active XPUB
  1. Admin → Bitcoin Settings → Add XPUB
  2. Trigger manual replenishment
- **Option B:** Import pre-seeded addresses
  1. Admin → Bitcoin Addresses → Import
  2. Paste addresses (one per line)

**Cause 2:** Replenishment cron not running
**Diagnostic:** Check last execution of `replenish-bitcoin-addresses`
**Fix:** 
- Verify cron schedule in Lovable Cloud
- Manually trigger replenishment via Admin panel

**Cause 3:** All addresses reserved but not yet expired
**Diagnostic:**
```sql
SELECT COUNT(*) as reserved_count, 
       MIN(reserved_until) as earliest_expiration
FROM bitcoin_addresses 
WHERE is_used = true 
AND payment_confirmed = false 
AND reserved_until > NOW();
```
**Fix:** 
- Wait for addresses to expire (2 hours default)
- Or manually release if orders cancelled:
  ```sql
  UPDATE bitcoin_addresses 
  SET is_used = false, assigned_to_order = NULL
  WHERE assigned_to_order IN (
    SELECT id FROM orders WHERE status = 'cancelled'
  );
  ```

---

### 5. System Health Issues

#### Symptom 5.1: Database Connection Errors
**Error Message:** "Database connection failed" in System Health Dashboard

**Diagnostic Steps:**
1. Check Lovable Cloud status page
2. Verify environment variables:
   ```bash
   # Check .env file (auto-generated, don't edit)
   VITE_SUPABASE_URL
   VITE_SUPABASE_PUBLISHABLE_KEY
   ```
3. Test database connection:
   ```sql
   SELECT NOW(); -- Simple test query
   ```

**Common Causes & Fixes:**

**Cause 1:** Lovable Cloud maintenance
**Fix:** Wait for maintenance to complete, check status page

**Cause 2:** Network issues
**Fix:** Check internet connection, retry after few minutes

**Cause 3:** RLS policy blocking query
**Fix:** Verify service role key used for admin queries

---

#### Symptom 5.2: BlockCypher API Failures
**Error Message:** "BlockCypher API Error" in System Health Dashboard

**Diagnostic Steps:**
1. Check BlockCypher status: https://status.blockcypher.com/
2. Verify API token in Lovable Cloud → Settings → Secrets
3. Check rate limits:
   - Free tier: 200 requests/hour
   - Paid tier: varies by plan

**Common Causes & Fixes:**

**Cause 1:** Rate limit exceeded
**Check logs for:** `429 Too Many Requests`
**Fix:**
- Wait for rate limit reset (typically 1 hour)
- Reduce polling frequency temporarily
- Upgrade to paid BlockCypher plan

**Cause 2:** Invalid API token
**Fix:** 
1. Generate new token at https://www.blockcypher.com/
2. Update `BLOCKCYPHER_API_TOKEN` secret
3. Redeploy edge functions

**Cause 3:** Network/region mismatch
**Fix:** Ensure API calls use correct network (`main` or `test3`)

---

### 6. Performance Issues

#### Symptom 6.1: Slow Address Assignment (>5 seconds)
**User Report:** "Order creation takes very long"

**Diagnostic Steps:**
1. Check edge function execution time in logs
2. Monitor database query performance
3. Check address derivation speed

**Common Causes & Fixes:**

**Cause 1:** Derivation algorithm slow
**Fix:** 
- Current implementation uses placeholder derivation
- For production, integrate proper BIP32 library
- Consider pre-generating addresses during low-traffic periods

**Cause 2:** Database query slow
**Diagnostic:** Check execution plan:
```sql
EXPLAIN ANALYZE 
SELECT * FROM bitcoin_addresses 
WHERE is_used = false 
LIMIT 1 FOR UPDATE SKIP LOCKED;
```
**Fix:** 
- Add index on `is_used` column:
  ```sql
  CREATE INDEX idx_bitcoin_addresses_is_used ON bitcoin_addresses(is_used);
  ```
- Add index on `reserved_until`:
  ```sql
  CREATE INDEX idx_bitcoin_addresses_reserved_until ON bitcoin_addresses(reserved_until) 
  WHERE reserved_until IS NOT NULL;
  ```

---

#### Symptom 6.2: Payment Check Takes Too Long
**Admin Report:** "Automated check times out with many pending payments"

**Diagnostic:**
```sql
SELECT COUNT(*) FROM orders 
WHERE status = 'pending_payment' 
AND payment_method = 'bitcoin';
```

**If count > 100:**

**Fix 1:** Batch process in smaller groups:
```typescript
// In btc-check-payments edge function
const BATCH_SIZE = 50;
const pendingOrders = await supabase
  .from('orders')
  .select('*')
  .eq('status', 'pending_payment')
  .eq('payment_method', 'bitcoin')
  .limit(BATCH_SIZE); // Process in batches
```

**Fix 2:** Increase edge function timeout (if available in Lovable Cloud)

**Fix 3:** Implement queue system for payment checks

---

### 7. Data Inconsistency Issues

#### Symptom 7.1: Order Status Mismatch
**Issue:** Order status is "processing" but payment not confirmed in database

**Diagnostic Query:**
```sql
SELECT o.order_number, o.status, 
       ba.payment_confirmed, ba.address
FROM orders o
LEFT JOIN bitcoin_addresses ba ON ba.assigned_to_order = o.id
WHERE o.status = 'processing' 
AND o.payment_method = 'bitcoin'
AND (ba.payment_confirmed = false OR ba.payment_confirmed IS NULL);
```

**Fix:**
```sql
-- Option 1: Revert order to pending if payment not confirmed
UPDATE orders 
SET status = 'pending_payment' 
WHERE id IN (/* IDs from query above */);

-- Option 2: Confirm payment if verified on blockchain
UPDATE bitcoin_addresses 
SET payment_confirmed = true 
WHERE assigned_to_order IN (/* order IDs verified on blockchain */);
```

---

#### Symptom 7.2: Missing Transaction Hash
**Issue:** Payment confirmed but no transaction hash stored

**Diagnostic:**
```sql
SELECT o.order_number, ba.address, ba.payment_confirmed,
       t.bitcoin_tx_hash
FROM orders o
JOIN bitcoin_addresses ba ON ba.assigned_to_order = o.id
LEFT JOIN transactions t ON t.order_id = o.id
WHERE ba.payment_confirmed = true 
AND (t.bitcoin_tx_hash IS NULL OR t.bitcoin_tx_hash = '');
```

**Fix:**
1. Look up transaction on blockchain explorer using address
2. Manually update transaction hash:
   ```sql
   UPDATE transactions 
   SET bitcoin_tx_hash = 'actual-tx-hash-here'
   WHERE order_id = 'order-uuid';
   ```

---

### 8. Security Issues

#### Symptom 8.1: Unauthorized Access to Bitcoin Addresses
**Alert:** User can view other users' Bitcoin addresses

**Diagnostic Test:**
```sql
-- Login as User A, try to query User B's address
-- This should return empty if RLS working correctly
SELECT * FROM bitcoin_addresses 
WHERE assigned_to_order IN (
  SELECT id FROM orders WHERE user_id != auth.uid()
);
```

**Fix:**
1. Verify RLS policies enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE schemaname = 'public' AND tablename = 'bitcoin_addresses';
   ```
   - `rowsecurity` should be `true`

2. If RLS disabled, enable it:
   ```sql
   ALTER TABLE bitcoin_addresses ENABLE ROW LEVEL SECURITY;
   ```

3. Verify policies exist and are correct

---

#### Symptom 8.2: XPUB Exposed in Client Code
**Security Audit:** XPUB visible in browser DevTools

**Check:**
1. Search codebase for `bitcoin_xpubs` queries
2. Verify no client-side XPUB fetching
3. Check edge function logs for unauthorized access

**Fix:**
- Remove any client-side XPUB queries
- Ensure derivation only happens in edge functions
- Verify RLS policy blocks non-admin access:
  ```sql
  -- Should return empty for non-admin users
  SELECT * FROM bitcoin_xpubs;
  ```

---

## Edge Function Specific Troubleshooting

### assign-bitcoin-address

**Common Errors:**

**Error:** "Failed to get next derivation index"
**Cause:** XPUB not found or database lock issue
**Fix:**
```sql
SELECT id, is_active, next_index FROM bitcoin_xpubs WHERE is_active = true;
-- If no results, activate an XPUB
```

**Error:** "Address derivation failed"
**Cause:** Derivation algorithm error
**Fix:** Review `derivation.ts` logic, check logs for specific error

---

### verify-bitcoin-payment

**Common Errors:**

**Error:** "No Bitcoin address found for order"
**Cause:** Order has no assigned address
**Fix:** Check address assignment process, reassign if needed

**Error:** "BlockCypher API error: 404"
**Cause:** Address not found on blockchain (never received payment)
**Fix:** Normal - means no transactions yet. Not an error.

**Error:** "Amount validation failed"
**Cause:** Payment amount outside ±2% tolerance
**Fix:** Review exchange rate at time of order, manually verify if close

---

### btc-check-payments

**Common Errors:**

**Error:** "Function timeout"
**Cause:** Too many pending payments, execution >30 seconds
**Fix:** Implement batching (process 50 at a time)

**Error:** "Rate limit exceeded"
**Cause:** Too many BlockCypher API calls
**Fix:**
- Reduce check frequency
- Upgrade BlockCypher plan
- Implement caching for recently checked addresses

---

### send-bitcoin-payment-email

**Common Errors:**

**Error:** "Resend API error: Invalid recipient"
**Cause:** Email address format invalid
**Fix:** Validate email before sending, update user profile

**Error:** "Email content rendering failed"
**Cause:** Missing data (e.g., Bitcoin address, amount)
**Fix:** Add null checks and fallbacks in email template

---

## Database Troubleshooting

### Slow Queries

**Query:** Find slow-running queries
```sql
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
WHERE query LIKE '%bitcoin%'
ORDER BY mean_time DESC
LIMIT 10;
```

**Fix:** Add appropriate indexes, optimize query logic

---

### Locked Rows

**Issue:** Address assignment hangs
**Diagnostic:**
```sql
SELECT pid, usename, query, state 
FROM pg_stat_activity 
WHERE query LIKE '%bitcoin_addresses%' AND state != 'idle';
```

**Fix:** 
- Wait for lock to release
- If stuck, terminate blocking process (use caution):
  ```sql
  SELECT pg_terminate_backend(pid) WHERE pid = <pid-from-above>;
  ```

---

### Disk Space

**Check database size:**
```sql
SELECT pg_size_pretty(pg_database_size('postgres'));
```

**Check table sizes:**
```sql
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Emergency Procedures

### Critical: All Payments Failing

**Immediate Actions:**
1. Check System Health Dashboard
2. Verify Lovable Cloud status
3. Check BlockCypher API status
4. Review recent edge function deployments
5. Check for database migrations that might have broken schema

**Temporary Fix:**
- Switch to manual payment verification
- Notify users of delays
- Process payments manually via admin panel

**Root Cause Analysis:**
- Review edge function logs from last 24 hours
- Check database for schema changes
- Verify all secrets (API keys) valid
- Test payment flow in testnet

---

### Critical: Address Pool Depleted

**Immediate Actions:**
1. Check available addresses:
   ```sql
   SELECT COUNT(*) FROM bitcoin_addresses WHERE is_used = false;
   ```
2. If zero, immediately:
   - Add active XPUB (if not already)
   - Trigger manual replenishment
   - Or import batch of pre-seeded addresses

**Prevention:**
- Set up proactive alerts when pool < 50
- Automate replenishment at higher threshold
- Monitor address usage trends

---

### Critical: Security Breach Suspected

**Immediate Actions:**
1. **DO NOT PANIC** - Bitcoin uses public/private key cryptography
2. Verify what was potentially exposed:
   - XPUB? (Can derive addresses but not spend funds)
   - Private keys? (CRITICAL - funds at risk)
   - API keys? (Moderate risk)

**If XPUB Exposed:**
- Moderate risk (privacy concern, not direct fund loss)
- Rotate XPUB:
  1. Deactivate current XPUB
  2. Add new XPUB from different wallet
  3. Monitor old addresses for suspicious activity

**If Private Keys Exposed:**
- CRITICAL - Immediate action required
- Move all funds to new wallet immediately
- Investigate how breach occurred
- Notify affected users

**If API Keys Exposed:**
- Rotate all API keys (BlockCypher, Resend)
- Review API usage logs for unauthorized calls
- Update keys in Lovable Cloud secrets

---

## Logging & Monitoring

### Enable Detailed Logging

**In edge functions:**
```typescript
console.log('[DEBUG] Starting payment verification', { orderId, address });
console.log('[DEBUG] BlockCypher response', JSON.stringify(response, null, 2));
```

### Monitor Key Metrics

**Daily:**
- Pending payment count
- Payment success rate
- Average confirmation time
- Email delivery rate

**Weekly:**
- Address pool levels
- XPUB derivation index growth
- BlockCypher API usage
- Error rates by edge function

**Monthly:**
- Security audit results
- Performance benchmarks
- User feedback trends

---

## Getting Additional Help

### Before Seeking Support:

1. ✅ Check this troubleshooting guide
2. ✅ Review edge function logs
3. ✅ Test in isolation (create test order)
4. ✅ Document error messages and steps to reproduce
5. ✅ Check if issue reproducible

### Information to Provide:

- Detailed description of issue
- Steps to reproduce
- Error messages (full text)
- Edge function logs (relevant portions)
- Database queries and results
- Environment (mainnet/testnet)
- Approximate time issue started

### Escalation Path:

1. Check documentation and logs
2. Consult admin team
3. Review codebase for recent changes
4. Contact developer/platform support

---

## Maintenance Schedule

### Regular Maintenance Tasks:

**Daily:**
- Review edge function error logs
- Check pending payment queue
- Monitor system health dashboard

**Weekly:**
- Clear old notifications
- Audit payment discrepancies
- Review address pool usage trends

**Monthly:**
- Database cleanup (old logs, expired sessions)
- API key rotation (if policy requires)
- Performance benchmarking
- Security audit

**Quarterly:**
- XPUB rotation
- Comprehensive system review
- Disaster recovery test
- Documentation updates

---

This troubleshooting guide should be updated as new issues are discovered and resolved. Keep it as a living document reflecting real-world experiences.
