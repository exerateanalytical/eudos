-- Create bitcoin_addresses table
CREATE TABLE public.bitcoin_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text UNIQUE NOT NULL,
  is_used boolean DEFAULT false,
  assigned_to_order uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  assigned_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create index for quick lookups of available addresses
CREATE INDEX idx_bitcoin_addresses_available ON public.bitcoin_addresses(is_used) WHERE is_used = false;

-- Enable RLS
ALTER TABLE public.bitcoin_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage bitcoin addresses" 
ON public.bitcoin_addresses
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can select available addresses"
ON public.bitcoin_addresses
FOR SELECT
USING (true);

-- Seed with the 30 Bitcoin addresses
INSERT INTO public.bitcoin_addresses (address) VALUES
  ('bc1qhvga7znl7cpyarf2lq6fwzt22nwa9v07ca596v'),
  ('bc1q3pz36vpsrpt3n6ckuuhqh2c8mamg084mf5acty'),
  ('bc1qk6zxtfhc2t5ttgq73ye7afmx8rv3egkn9szw7z'),
  ('bc1qunz4238f7x6dyeyzjclj5nd72qx68z8wm6m58e'),
  ('bc1qjxmmjw9jusxvj460rpp4rlzq8s50ur2rd07epe'),
  ('bc1qtf298dpmxj3j9g762al92vsy2r05vg8tnnm02r'),
  ('bc1q9l2k8e7ym3zd6q58uec07vh9qsy8zu4x6upp39'),
  ('bc1qp60xj3tyw5xufvzvwcl3vyuk6ve5hykqf096d2'),
  ('bc1qgzjd00yyasa6zkz0tjh0agzu3th7c43w9gf53f'),
  ('bc1qdy8g5laztzkfvd480gglp7vrplennp4057m8yv'),
  ('bc1qel9v75cnqz7h78k2hvvdfwqnt0phfhhtntexwx'),
  ('bc1qcrs23ty7faue57cnll0ya33fkke7tuepm2f6wz'),
  ('bc1q36p9lruuwk5mpr905psfprrtl26qgn24z5xqxe'),
  ('bc1qjjxpzezyn2nvceeux7tl3adldqwfc38alj9w09'),
  ('bc1qp7d7jw8gv286mz0vn7jucyq3ge2ulg22yt4f97'),
  ('bc1qangg4hlajfmmuqtrajlnsyve5962vevlzmy3yn'),
  ('bc1q8cwd6g3xf0smlyc9wclwzpzkzvdm46tzgtvhxl'),
  ('bc1q6yaxqks3ckexhqmldv4s9sf7rd0qt47k2jace4'),
  ('bc1qhm0qd34wl4q6hltx5ja3rw8m60zrrpmf3j9snm'),
  ('bc1quhhhmfgjhj4zrpac8prle0tnnnh2kjgtnuuruf'),
  ('bc1qrf4u5vu57lr0peyev323n2w65qanx22476s4nq'),
  ('bc1ql8vq7uskys44s9gcv8zjnukpdfj2vv5avegfmf'),
  ('bc1qp3ue7v6cwtn3s2wcy2euw7anu83w83rgjva352'),
  ('bc1qgcu84djck5ntq0y5wk7aefryk73asukqv7leka'),
  ('bc1qlzecslxseskmrxdq7zsvq3qy429f0kdrrz8xm9'),
  ('bc1q6mwlfvdmc9pfu42ya9m56nj5fuevglwg2u0kd2'),
  ('bc1qdqdg4ey60tzmf9pkrffncn6rmulz0jsfht2wak'),
  ('bc1qy24ac030zttznva4mqaxh38zp49f30sh6uertl'),
  ('bc1qqzay93cknz9ng2z6w58z7xprgsxq0k8ekxu72c'),
  ('bc1qc77xgje8y0pm9ck6c0hyx37wzs86y685t9j4mg');