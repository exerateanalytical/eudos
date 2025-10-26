# Bitcoin Payment System - User Guide

## Overview
This guide explains how to pay for your order using Bitcoin. The process is secure, private, and typically completes within minutes.

---

## How to Pay with Bitcoin

### Step 1: Select Bitcoin as Payment Method
1. Add items to your cart
2. Proceed to checkout
3. Select **Bitcoin** as your payment method
4. Review your order details
5. Click **Place Order**

### Step 2: Receive Your Payment Address
After placing your order, you'll receive:
- ✅ A unique Bitcoin address (for this order only)
- ✅ The exact amount to send in BTC
- ✅ A QR code for easy scanning
- ✅ Email confirmation with payment details

**Important Notes:**
- Your Bitcoin address is unique to this order
- Do not reuse this address for future orders
- The address expires in **2 hours**
- You must send the exact amount shown (±2% tolerance)

### Step 3: Send Bitcoin Payment
You can pay using any Bitcoin wallet:

#### Option A: Scan QR Code (Mobile Wallets)
1. Open your Bitcoin wallet app
2. Tap **Send** or **Pay**
3. Scan the QR code displayed on screen
4. Verify the amount matches
5. Confirm and send the transaction

**Popular Mobile Wallets:**
- BlueWallet
- Muun Wallet
- Electrum Mobile
- Trust Wallet

#### Option B: Copy & Paste Address (Desktop Wallets)
1. Copy the Bitcoin address from your order page
2. Open your Bitcoin wallet
3. Create a new transaction
4. Paste the address
5. Enter the exact BTC amount shown
6. Double-check details
7. Send the transaction

**Popular Desktop Wallets:**
- Electrum
- Sparrow Wallet
- Bitcoin Core
- Exodus

#### Option C: Use an Exchange
1. Login to your exchange (Coinbase, Kraken, Binance, etc.)
2. Navigate to **Send** or **Withdraw**
3. Select **Bitcoin (BTC)**
4. Paste the payment address
5. Enter the amount
6. Complete withdrawal

**Important**: Exchanges may charge withdrawal fees. Factor this into your payment amount.

### Step 4: Wait for Confirmation
After sending payment:
1. You'll receive an email: "Payment Detected"
2. Your order page will show transaction details
3. Wait for blockchain confirmations (typically 10-60 minutes)
4. After 1 confirmation, you'll receive: "Payment Confirmed"
5. Your order status changes to "Processing"

**What are confirmations?**
- Confirmations = number of blocks mined after your transaction
- 1 confirmation = Your payment is verified
- More confirmations = More security
- Most orders process after 1 confirmation

---

## Understanding Your Payment Details

### Bitcoin Address
**Example**: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`

- Starts with `bc1` (mainnet) or `tb1` (testnet)
- 42 characters long
- Case-sensitive
- Unique to your order

**⚠️ Warning**: Always verify the address before sending. Bitcoin transactions are irreversible.

### Payment Amount
**Example**: `0.00125000 BTC` (≈ $50 USD)

- Displayed in both BTC and USD
- Based on current exchange rate
- ±2% tolerance allowed (to account for rate fluctuations)
- Must send at least the minimum amount

**Tip**: If exchange rates change between order creation and payment, the ±2% tolerance ensures your payment is still accepted.

### QR Code
- Contains the Bitcoin address and amount
- Scannable by any Bitcoin wallet
- Ensures accuracy (no typing errors)

### Expiration Time
- Default: **2 hours** from order creation
- Displayed as countdown timer
- Address released back to pool after expiration

**What if payment expires?**
- Send payment before expiration to ensure automatic processing
- Late payments may require manual verification
- Contact support if you paid after expiration

---

## Checking Payment Status

### Automatic Updates
- Your order page auto-refreshes every 30 seconds
- Status updates automatically when payment detected
- Email notifications sent at each stage

### Manual Check
1. Navigate to **My Orders**
2. Click on your order
3. Click **Check Payment Status**
4. View updated confirmation count

### Payment Stages
1. **Pending Payment** (🟡)
   - Order created, waiting for payment
   - Bitcoin address assigned
   - Send payment to proceed

2. **Payment Detected** (🟠)
   - Transaction seen on blockchain
   - Waiting for confirmations
   - Do not send additional payment

3. **Payment Confirmed** (🟢)
   - 1+ blockchain confirmations received
   - Order processing begins
   - Estimated completion time provided

4. **Processing** (🔵)
   - Payment fully confirmed
   - Order being fulfilled
   - Tracking information coming soon

5. **Completed** (✅)
   - Order delivered
   - Transaction complete

---

## Viewing Your Transaction History

### My Payments Dashboard
1. Login to your account
2. Navigate to **My Payments**
3. View all Bitcoin transactions

**Information Displayed:**
- Order number
- Bitcoin address
- Amount paid (BTC and USD)
- Transaction hash
- Confirmations
- Status
- Date/time

### Transaction Hash
**Example**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

- Unique identifier for your transaction
- Click to view on blockchain explorer
- Proof of payment
- Verify on public blockchain

**Blockchain Explorers:**
- https://live.blockcypher.com/btc/
- https://www.blockchain.com/explorer
- https://blockstream.info/

---

## Troubleshooting

### Issue: Payment Not Detected
**Possible Causes:**
- Transaction not yet confirmed on blockchain
- Sent incorrect amount
- Sent to wrong address
- Network congestion

**Solutions:**
1. Check if transaction appears on blockchain explorer
2. Verify amount sent matches required amount (±2%)
3. Wait 10-15 minutes for blockchain propagation
4. Click "Check Payment Status" manually
5. Contact support with transaction hash if issue persists

### Issue: Address Expired
**Scenario:** You sent payment after 2-hour expiration window

**Solutions:**
1. Don't panic - your Bitcoin is not lost
2. Check blockchain to confirm payment was sent
3. Contact support immediately with:
   - Order number
   - Bitcoin address
   - Transaction hash
   - Amount sent
4. Support will manually verify and process your order

### Issue: Sent Wrong Amount
**Scenario:** Sent less or more than required amount

**Solutions:**
- **Underpayment** (>2% less):
  - Contact support for options
  - May need to send additional payment
  - Or request partial refund

- **Overpayment** (>2% more):
  - Order will process normally
  - Excess will be refunded
  - Or applied to future order (your choice)

### Issue: Sent to Wrong Address
**Scenario:** Accidentally sent to incorrect address

**Important**: Bitcoin transactions are irreversible. If sent to wrong address:
1. Verify on blockchain where payment went
2. If sent to your own wallet, resend correctly
3. If sent to unknown address, funds may be unrecoverable
4. Contact support, but recovery not guaranteed

**Prevention**: Always double-check address before sending!

### Issue: Transaction Stuck (Low Fee)
**Scenario:** Sent with very low transaction fee, not confirming

**Solutions:**
1. Wait - low-fee transactions eventually confirm (may take hours/days)
2. Use RBF (Replace-By-Fee) if your wallet supports it
3. Use CPFP (Child-Pays-For-Parent) to accelerate
4. Contact support if urgent - may manually verify 0-conf

### Issue: No Confirmation Email Received
**Solutions:**
1. Check spam/junk folder
2. Verify email address in account settings
3. Check order page for payment address (email not required)
4. Contact support to resend email

---

## Security & Best Practices

### ✅ DO:
- Verify Bitcoin address before sending payment
- Use reputable wallets
- Send exact amount specified (±2%)
- Save transaction hash for your records
- Pay before expiration time (2 hours)
- Keep your wallet secure
- Enable 2FA on exchange accounts

### ❌ DON'T:
- Reuse Bitcoin addresses from previous orders
- Send from exchange if withdrawal fees are high
- Send payment after expiration without contacting support
- Share your private keys with anyone
- Use unverified/suspicious wallets
- Send from addresses you don't control

### Privacy Tips
- Bitcoin transactions are public on the blockchain
- Anyone can see transactions for a given address
- Use a new address for each purchase (done automatically)
- Consider using privacy-focused wallets if needed

---

## Frequently Asked Questions

### How long does Bitcoin payment take?
- **Payment detection**: 1-30 minutes (when transaction broadcasts)
- **First confirmation**: 10-60 minutes (average)
- **Order processing**: After 1 confirmation

### What are the fees?
- **Our fees**: No additional fees for Bitcoin payments
- **Network fees**: Paid to Bitcoin miners (set by your wallet)
- **Exchange fees**: If withdrawing from exchange

### Is Bitcoin payment safe?
- ✅ Cryptographically secure
- ✅ Irreversible (no chargebacks)
- ✅ No middleman required
- ✅ Transparent on blockchain
- ⚠️ You are responsible for security (wallet, private keys)

### Can I get a refund?
- Yes, refunds are processed to your Bitcoin address
- Refund policy same as other payment methods
- Refunds sent to address you paid from (if possible)
- May take 1-3 business days to process

### What happens if Bitcoin price changes?
- Price locked at time of order creation
- ±2% tolerance for exchange rate fluctuations
- If price changes >2%, contact support

### Can I pay partially now and rest later?
- No, full payment required in single transaction
- Partial payments not automatically processed
- Contact support for payment plan options

### Do you accept other cryptocurrencies?
- Currently Bitcoin (BTC) only
- Check back for updates on alt-coin support

---

## Contact Support

If you need help with your Bitcoin payment:

**Before Contacting:**
- [ ] Check your order page for status
- [ ] Verify transaction on blockchain explorer
- [ ] Review this user guide

**Include in Your Message:**
- Order number
- Bitcoin address
- Transaction hash (if payment sent)
- Screenshot of issue (if applicable)
- Description of problem

**Response Time:** 
- Typically within 2-4 hours
- Urgent payment issues prioritized

---

## Additional Resources

### Learn About Bitcoin
- https://bitcoin.org/en/getting-started
- https://www.lopp.net/bitcoin-information.html

### Bitcoin Wallets
- https://bitcoin.org/en/choose-your-wallet

### Blockchain Explorers
- https://live.blockcypher.com/btc/
- https://blockstream.info/

### Current Bitcoin Price
- https://www.coinbase.com/price/bitcoin
- https://www.kraken.com/prices/bitcoin

---

Thank you for choosing Bitcoin payment! Enjoy the benefits of fast, secure, and private transactions.
