-- Fix order_id foreign key relationship in btc_payments table
-- Step 1: Since both tables are empty, truncate in correct order
TRUNCATE TABLE orders CASCADE;

-- Step 2: Alter order_id column from TEXT to UUID
ALTER TABLE btc_payments
  ALTER COLUMN order_id TYPE UUID USING order_id::UUID;

-- Step 3: Add foreign key constraint to orders table
ALTER TABLE btc_payments
  ADD CONSTRAINT fk_btc_payments_order
  FOREIGN KEY (order_id) 
  REFERENCES orders(id) 
  ON DELETE CASCADE;

-- Step 4: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_btc_payments_order_id ON btc_payments(order_id);

-- Step 5: Insert your Bitcoin wallet
INSERT INTO btc_wallets (
  name,
  xpub,
  network,
  derivation_path,
  next_index
) VALUES (
  'Primary Wallet',
  'zpub6nXBJB56BbW7d4kg4PHdzQNCzcx5XVj3aczVTa12PSbM9KZfVKBfph6jgfsZLq87rDCAJe4GyhaX5shDsntm8t5XFTBtVA94T1nirEFkpyw',
  'mainnet',
  'm/84''/0''/0''/0',
  0
) ON CONFLICT DO NOTHING;