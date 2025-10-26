# Bitcoin Payment System - Admin Guide

## Overview
This guide provides administrators with instructions for managing the Bitcoin payment system, monitoring health, and troubleshooting issues.

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [XPUB Management](#xpub-management)
3. [Address Pool Management](#address-pool-management)
4. [System Health Monitoring](#system-health-monitoring)
5. [Payment Verification](#payment-verification)
6. [Troubleshooting](#troubleshooting)
7. [Security Best Practices](#security-best-practices)

---

## Initial Setup

### 1. Configure BlockCypher API
1. Navigate to **Settings → Secrets**
2. Locate `BLOCKCYPHER_API_TOKEN`
3. Enter your BlockCypher API token
4. Select network: `mainnet` or `testnet`

### 2. Configure Email Notifications
1. Navigate to **Settings → Secrets**
2. Locate `RESEND_API_KEY`
3. Enter your Resend API key
4. Test email delivery by creating a test order

### 3. Add Initial XPUB (Recommended)
1. Navigate to **Admin → Bitcoin Settings**
2. Click **Add XPUB**
3. Enter XPUB details:
   - **Label**: Descriptive name (e.g., "Main Wallet")
   - **XPUB Key**: Your extended public key (starts with `xpub` or `tpub`)
   - **Network**: mainnet or testnet
   - **Set as Active**: Yes
4. Click **Save**

**Security Note**: XPUBs allow address derivation without exposing private keys. Never share or expose XPUBs publicly.

### 4. Seed Initial Addresses (Optional Fallback)
If you prefer pre-seeded addresses instead of XPUB derivation:
1. Navigate to **Admin → Bitcoin Addresses**
2. Click **Add Addresses**
3. Paste addresses (one per line)
4. Click **Import**

**Recommendation**: Use XPUB derivation for better scalability.

---

## XPUB Management

### Adding a New XPUB
**When to add:**
- Setting up the system for the first time
- Rotating to a new wallet
- Adding backup XPUB for redundancy

**Steps:**
1. Admin → Bitcoin Settings → Add XPUB
2. Fill in required fields
3. Set as active if replacing existing XPUB
4. Click Save

**Validation:**
```sql
SELECT id, label, network, is_active, next_index 
FROM bitcoin_xpubs 
ORDER BY created_at DESC;
```

### Deactivating an XPUB
**When to deactivate:**
- Wallet compromise suspected
- Migrating to new wallet
- Testing different address generation strategies

**Steps:**
1. Admin → Bitcoin Settings
2. Locate XPUB in list
3. Toggle "Active" switch to OFF
4. Confirm deactivation

**Important**: Deactivating all XPUBs will cause system to fall back to pre-seeded addresses.

### Monitoring Derivation Index
**What it means:**
- Derivation index tracks the next address number to generate
- Each order increments this counter
- Higher index = more addresses generated

**Check current index:**
```sql
SELECT label, next_index, 
       (SELECT COUNT(*) FROM bitcoin_addresses WHERE xpub_id = bitcoin_xpubs.id) as addresses_generated
FROM bitcoin_xpubs 
WHERE is_active = true;
```

**Best Practice**: Monitor index growth. If approaching BIP44 gap limit (typically 20), consider rotating XPUB.

---

## Address Pool Management

### Understanding the Address Pool
- **Target Size**: 100 available addresses
- **Low Threshold**: 20 addresses
- **Auto-Replenishment**: Runs every 6 hours

### Manual Address Check
**Dashboard View:**
1. Navigate to **Admin → System Health**
2. Check "Bitcoin Address Pool" metric
3. Green = Healthy (>20 addresses)
4. Yellow = Low (10-20 addresses)
5. Red = Critical (<10 addresses)

**Database Query:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE is_used = false) as available,
  COUNT(*) FILTER (WHERE is_used = true AND payment_confirmed = false) as reserved,
  COUNT(*) FILTER (WHERE payment_confirmed = true) as used_confirmed
FROM bitcoin_addresses;
```

### Manual Replenishment
**When to trigger:**
- Available addresses < 20
- Anticipating high order volume
- After system downtime

**Steps:**
1. Navigate to **Admin → Bitcoin Settings**
2. Click **Replenish Addresses**
3. Confirm action
4. Monitor edge function logs for completion

**Edge Function**: `replenish-bitcoin-addresses`

**Expected Outcome:**
- New addresses generated to reach 100 available
- Admin email notification sent
- System Health Dashboard updated

### Address Expiration Management
**Automatic Process:**
- Cron job runs every 5 minutes
- Releases addresses reserved > 2 hours
- Makes them available for reassignment

**Manual Release:**
```sql
-- View expired but unreleased addresses
SELECT address, assigned_to_order, reserved_until 
FROM bitcoin_addresses 
WHERE reserved_until < NOW() 
AND is_used = true 
AND payment_confirmed = false;

-- Manually release (use with caution)
UPDATE bitcoin_addresses 
SET is_used = false, 
    assigned_to_order = NULL,
    reserved_until = NULL
WHERE reserved_until < NOW() 
AND payment_confirmed = false;
```

---

## System Health Monitoring

### Dashboard Metrics
Navigate to **Admin → System Health** to view:

#### 1. Database Connectivity
- **Status**: Connected / Disconnected
- **Alert Trigger**: Any disconnection
- **Action**: Check Lovable Cloud status

#### 2. Bitcoin Address Pool
- **Metric**: Available addresses count
- **Alert Trigger**: < 20 available
- **Action**: Trigger manual replenishment or add XPUB

#### 3. BlockCypher API
- **Status**: Operational / Error
- **Response Time**: < 2000ms is healthy
- **Alert Trigger**: API errors or timeout
- **Action**: Check API token, verify rate limits

#### 4. Pending Payments
- **Metric**: Count of unconfirmed payments
- **Alert Trigger**: > 50 pending (warning), > 100 (critical)
- **Action**: Investigate delays, check blockchain congestion

#### 5. XPUB Status
- **Metric**: Active XPUB availability
- **Alert Trigger**: No active XPUB
- **Action**: Activate XPUB or verify fallback addresses available

### Setting Up Alerts
**Email Notifications:**
- Low address pool → Admins notified
- API failures → Admins notified
- Critical system errors → Admins notified

**Alert Configuration:**
1. Navigate to **Admin → System Alerts**
2. View all active alerts
3. Dismiss resolved alerts
4. Configure alert thresholds (if available)

### Health Check Schedule
The `system-health` edge function runs:
- **Frequency**: Every 10 minutes (configurable via cron)
- **Checks**: All metrics listed above
- **Logging**: View in edge function logs

**Manual Health Check:**
1. Admin → System Health → Refresh
2. Or call edge function directly via Lovable Cloud

---

## Payment Verification

### Monitoring Pending Payments
**Dashboard View:**
1. Navigate to **Admin → Orders**
2. Filter by Status: "Pending Payment"
3. View Bitcoin address and expiration time

**Database Query:**
```sql
SELECT o.order_number, ba.address, ba.reserved_until, 
       o.total_amount, o.created_at
FROM orders o
JOIN bitcoin_addresses ba ON ba.assigned_to_order = o.id
WHERE o.status = 'pending_payment' 
AND o.payment_method = 'bitcoin'
ORDER BY o.created_at DESC;
```

### Manual Payment Check
**When to use:**
- User reports payment sent but not detected
- Automated check failed
- Blockchain explorer shows confirmations but order still pending

**Steps:**
1. Navigate to **Admin → Orders**
2. Locate order by order number
3. Click **Check Payment Status**
4. Review API response in logs
5. Manually update if necessary

**Edge Function**: `verify-bitcoin-payment`

### Handling Payment Discrepancies
**Scenario 1: Amount Mismatch**
- **Tolerance**: ±2% allowed for exchange rate fluctuations
- **Action**: If payment within tolerance, manually confirm order
- **Database Update**:
  ```sql
  UPDATE orders SET status = 'processing' WHERE id = 'order-uuid';
  UPDATE bitcoin_addresses SET payment_confirmed = true WHERE assigned_to_order = 'order-uuid';
  ```

**Scenario 2: Late Payment (After Expiration)**
- **Detection**: Payment sent after 2-hour window
- **Action**: 
  1. Verify payment on blockchain explorer
  2. Contact user for confirmation
  3. Manually mark as paid if legitimate
  4. Issue refund if order cancelled

**Scenario 3: Double Payment**
- **Detection**: Multiple transactions to same address
- **Action**:
  1. Confirm on blockchain
  2. Calculate total received
  3. Issue partial refund or apply to future order
  4. Document in order notes

### Transaction Hash Verification
**Check stored TX hash:**
```sql
SELECT t.bitcoin_tx_hash, t.status, t.amount, o.order_number
FROM transactions t
JOIN orders o ON o.id = t.order_id
WHERE o.order_number = 'ORD-XXXXXXX-XXXXX';
```

**Verify on blockchain:**
1. Copy transaction hash
2. Visit BlockCypher explorer:
   - Mainnet: `https://live.blockcypher.com/btc/tx/{hash}`
   - Testnet: `https://live.blockcypher.com/btc-testnet/tx/{hash}`
3. Confirm amount, confirmations, and address match

---

## Troubleshooting

### Issue 1: Addresses Not Being Assigned
**Symptoms:**
- Orders created but no Bitcoin address assigned
- Users not receiving payment email

**Diagnosis:**
1. Check if active XPUB exists:
   ```sql
   SELECT * FROM bitcoin_xpubs WHERE is_active = true;
   ```
2. Check available address pool:
   ```sql
   SELECT COUNT(*) FROM bitcoin_addresses WHERE is_used = false;
   ```
3. Check edge function logs for `assign-bitcoin-address` errors

**Solutions:**
- If no active XPUB: Add and activate XPUB
- If no available addresses: Trigger replenishment
- If edge function errors: Check logs for specific error message

### Issue 2: Payments Not Being Detected
**Symptoms:**
- User paid but order still "pending_payment"
- Automated checks not running

**Diagnosis:**
1. Verify payment on blockchain explorer
2. Check `btc-check-payments` edge function logs
3. Verify BlockCypher API token valid
4. Check if cron job running:
   - Lovable Cloud → Edge Functions → btc-check-payments → Logs

**Solutions:**
- If payment exists on blockchain: Manually trigger verification
- If API errors: Verify API token, check rate limits
- If cron not running: Check Lovable Cloud cron configuration
- If amount mismatch: Verify tolerance settings (±2%)

### Issue 3: Email Notifications Not Sent
**Symptoms:**
- Address assigned but user didn't receive email
- Payment confirmed but no notification

**Diagnosis:**
1. Check `send-bitcoin-payment-email` edge function logs
2. Verify Resend API key configured
3. Check user's email address in database:
   ```sql
   SELECT p.email FROM profiles p 
   JOIN orders o ON o.user_id = p.id 
   WHERE o.order_number = 'ORD-XXXXXXX-XXXXX';
   ```

**Solutions:**
- If edge function errors: Check logs for specific error
- If API key invalid: Update Resend API key in secrets
- If email incorrect: Update user profile
- Manual workaround: Send email manually with address details

### Issue 4: Address Pool Not Replenishing
**Symptoms:**
- Available addresses < 20
- No new addresses being generated
- Admin alerts not being sent

**Diagnosis:**
1. Check if active XPUB exists
2. Check `replenish-bitcoin-addresses` edge function logs
3. Verify cron job schedule
4. Check XPUB derivation index:
   ```sql
   SELECT label, next_index FROM bitcoin_xpubs WHERE is_active = true;
   ```

**Solutions:**
- If no active XPUB: Activate XPUB
- If edge function errors: Check derivation logic
- If cron not running: Verify cron configuration
- Manual workaround: Trigger replenishment manually

### Issue 5: System Health Dashboard Not Updating
**Symptoms:**
- Dashboard shows stale data
- Metrics not refreshing

**Diagnosis:**
1. Check browser console for errors
2. Verify `system-health` edge function running
3. Check database connectivity

**Solutions:**
- Hard refresh browser (Ctrl+Shift+R)
- Check edge function logs for errors
- Verify Lovable Cloud database status

---

## Security Best Practices

### XPUB Security
✅ **DO:**
- Store XPUBs securely in database (encrypted)
- Use XPUB derivation instead of private keys
- Rotate XPUBs periodically (every 6-12 months)
- Monitor derivation index to prevent gap limit issues
- Use separate XPUBs for mainnet and testnet

❌ **DON'T:**
- Share XPUB publicly or in client-side code
- Use same XPUB across multiple platforms
- Derive addresses client-side
- Exceed BIP44 gap limit (20 unused addresses)

### Address Management
✅ **DO:**
- Use unique address per order
- Set reasonable expiration times (2 hours)
- Release expired addresses back to pool
- Monitor address reuse

❌ **DON'T:**
- Reuse addresses for multiple orders
- Keep addresses reserved indefinitely
- Allow manual address assignment by users

### Payment Verification
✅ **DO:**
- Require minimum 1 confirmation for order processing
- Validate payment amount within tolerance (±2%)
- Store transaction hashes for audit trail
- Monitor for double-spend attempts

❌ **DON'T:**
- Accept 0-confirmation for high-value orders
- Process payments without amount validation
- Rely solely on automated checks (manual review for large amounts)

### API Key Management
✅ **DO:**
- Store API keys as encrypted secrets
- Use environment variables (never hardcode)
- Rotate API keys periodically
- Monitor API usage and rate limits
- Use separate keys for production and testing

❌ **DON'T:**
- Commit API keys to version control
- Share API keys between environments
- Use API keys in client-side code

### Database Security
✅ **DO:**
- Implement Row Level Security (RLS) policies
- Limit admin access to authorized users only
- Audit database access logs regularly
- Backup database regularly

❌ **DON'T:**
- Disable RLS policies
- Grant direct database access to users
- Store sensitive data unencrypted

### Monitoring & Alerts
✅ **DO:**
- Monitor edge function logs daily
- Set up admin alerts for critical issues
- Review payment discrepancies weekly
- Track system health metrics

❌ **DON'T:**
- Ignore system alerts
- Disable monitoring during high traffic
- Delay investigating payment issues

---

## Admin Checklist

### Daily Tasks
- [ ] Review System Health Dashboard
- [ ] Check pending Bitcoin payments
- [ ] Monitor email notification delivery
- [ ] Review edge function error logs

### Weekly Tasks
- [ ] Verify address pool levels
- [ ] Review payment discrepancies
- [ ] Check BlockCypher API usage
- [ ] Audit admin access logs

### Monthly Tasks
- [ ] Rotate API keys (if needed)
- [ ] Review XPUB derivation index
- [ ] Backup database
- [ ] Update documentation

### Quarterly Tasks
- [ ] Security audit
- [ ] Performance review
- [ ] XPUB rotation planning
- [ ] Disaster recovery test

---

## Contact & Support

For technical issues or questions:
- Check edge function logs first
- Review this admin guide
- Consult developer documentation
- Contact system administrator

For BlockCypher API support:
- https://www.blockcypher.com/dev/

For Resend email support:
- https://resend.com/docs
