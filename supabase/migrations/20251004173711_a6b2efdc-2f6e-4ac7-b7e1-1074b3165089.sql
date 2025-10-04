-- Insert all 32 driver's license products into the Driver's Licenses category
WITH category AS (
  SELECT id FROM product_categories WHERE slug = 'drivers-licenses'
)
INSERT INTO cms_products (
  name, slug, description, category_type, country, price, 
  status, category_id, stock_status, stock_quantity, 
  features, gallery_images
)
SELECT 
  country || ' Driver''s License' as name,
  'license-' || LOWER(REPLACE(country, ' ', '-')) as slug,
  'Secure ' || country || ' driver''s license with biometric data and tamper-proof features' as description,
  'license' as category_type,
  country,
  800 as price,
  'active' as status,
  (SELECT id FROM category) as category_id,
  'in_stock' as stock_status,
  100 as stock_quantity,
  jsonb_build_array(
    'Biometric data integration',
    'Holographic security features',
    'UV reactive elements',
    'Laser engraved personal details',
    'RFID chip technology',
    'International validity',
    'Tamper-proof design',
    'Machine-readable zone'
  ) as features,
  '[]'::jsonb as gallery_images
FROM (VALUES 
  ('Austria'), ('Belgium'), ('Bulgaria'), ('Croatia'), ('Cyprus'), 
  ('Czech Republic'), ('Denmark'), ('Estonia'), ('Finland'), ('France'),
  ('Germany'), ('Greece'), ('Hungary'), ('Ireland'), ('Italy'),
  ('Latvia'), ('Lithuania'), ('Luxembourg'), ('Malta'), ('Netherlands'),
  ('Poland'), ('Portugal'), ('Romania'), ('Slovakia'), ('Slovenia'),
  ('Spain'), ('Sweden'), ('United States'), ('United Kingdom'), 
  ('Canada'), ('Australia'), ('Switzerland')
) AS countries(country)
WHERE NOT EXISTS (
  SELECT 1 FROM cms_products 
  WHERE slug = 'license-' || LOWER(REPLACE(countries.country, ' ', '-'))
);