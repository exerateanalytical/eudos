-- Step 8: Consolidate and organize passports
-- Consolidate all passports to main category first
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'passports')
WHERE category_type = 'passport'
  AND category_id IN (
    SELECT id FROM product_categories 
    WHERE slug IN ('citizenship')
  );

-- Move passports to regional categories
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'us-passports')
WHERE category_type = 'passport'
  AND (country = 'United States' OR name LIKE '%United States%' OR name LIKE '%USA%')
  AND category_id = (SELECT id FROM product_categories WHERE slug = 'passports');

UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'uk-passports')
WHERE category_type = 'passport'
  AND (country = 'United Kingdom' OR name LIKE '%United Kingdom%' OR name LIKE '%UK %')
  AND category_id = (SELECT id FROM product_categories WHERE slug = 'passports');

UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'eu-passports')
WHERE category_type = 'passport'
  AND country IN ('Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden')
  AND category_id = (SELECT id FROM product_categories WHERE slug = 'passports');

-- Create Canadian Passports category
INSERT INTO product_categories (name, slug, description, seo_title, seo_description)
SELECT 'Canadian Passports', 'canadian-passports', 'Canadian passport documents', 'Canadian Passports', 'Official Canadian passport documents'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'canadian-passports');

UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'canadian-passports')
WHERE category_type = 'passport'
  AND (country = 'Canada' OR name LIKE '%Canada%')
  AND category_id = (SELECT id FROM product_categories WHERE slug = 'passports');