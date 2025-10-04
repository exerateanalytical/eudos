
-- Update EU country passports to link to EU Passports category
WITH eu_category AS (
  SELECT id FROM product_categories WHERE slug = 'eu-passports' LIMIT 1
)
UPDATE cms_products
SET category_id = (SELECT id FROM eu_category)
WHERE country IN (
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
  'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
  'Slovenia', 'Spain', 'Sweden'
)
