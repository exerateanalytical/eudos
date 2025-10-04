-- Create regional citizenship categories
INSERT INTO product_categories (name, slug, description, seo_title, seo_description, parent_id)
SELECT 
  'EU Citizenship Documents',
  'eu-citizenship',
  'European Union citizenship and naturalization documents',
  'EU Citizenship Documents',
  'Official European Union citizenship and naturalization documents',
  id
FROM product_categories
WHERE slug = 'citizenship'
  AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'eu-citizenship');

INSERT INTO product_categories (name, slug, description, seo_title, seo_description, parent_id)
SELECT 
  'Americas Citizenship Documents',
  'americas-citizenship',
  'Americas citizenship and naturalization documents',
  'Americas Citizenship Documents',
  'Official Americas citizenship and naturalization documents',
  id
FROM product_categories
WHERE slug = 'citizenship'
  AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'americas-citizenship');

INSERT INTO product_categories (name, slug, description, seo_title, seo_description, parent_id)
SELECT 
  'Asia-Pacific Citizenship Documents',
  'asia-pacific-citizenship',
  'Asia-Pacific citizenship and naturalization documents',
  'Asia-Pacific Citizenship Documents',
  'Official Asia-Pacific citizenship and naturalization documents',
  id
FROM product_categories
WHERE slug = 'citizenship'
  AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'asia-pacific-citizenship');

-- Move existing citizenship products to regional categories based on country
-- EU Citizenship
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'eu-citizenship')
WHERE category_type = 'citizenship'
  AND country IN ('Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'United Kingdom', 'Switzerland', 'Montenegro');

-- Americas Citizenship
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'americas-citizenship')
WHERE category_type = 'citizenship'
  AND country IN ('United States', 'Canada', 'Brazil', 'Argentina', 'Panama', 'Costa Rica', 'Uruguay', 'Colombia', 'Mexico', 'Chile');

-- Asia-Pacific Citizenship
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'asia-pacific-citizenship')
WHERE category_type = 'citizenship'
  AND country IN ('Australia', 'New Zealand', 'Singapore', 'Thailand', 'United Arab Emirates', 'Turkey', 'Japan', 'South Korea', 'Malaysia', 'Indonesia');