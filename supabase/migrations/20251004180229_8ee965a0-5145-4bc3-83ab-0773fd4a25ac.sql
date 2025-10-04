-- Step 1: Move remaining Canadian universities from Diplomas to Canadian Universities
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'canadian-universities')
WHERE country = 'Canada' 
  AND category_type = 'diploma'
  AND category_id = (SELECT id FROM product_categories WHERE slug = 'diplomas');

-- Step 2: Move EU universities from general categories to EU Universities
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'eu-universities')
WHERE country = 'EU' 
  AND category_type = 'diploma'
  AND category_id != (SELECT id FROM product_categories WHERE slug = 'eu-universities');

-- Step 3: Move France universities to France Universities
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'france-universities')
WHERE country = 'France' 
  AND category_type = 'diploma'
  AND category_id != (SELECT id FROM product_categories WHERE slug = 'france-universities');

-- Step 4: Consolidate all driver's licenses to main category first
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'drivers-licenses')
WHERE category_type = 'license'
  AND category_id IN (
    SELECT id FROM product_categories 
    WHERE slug IN ('driver-licenses', 'drivers-license', 'international-driver-permits')
  );

-- Step 5: Create EU Driver Licenses category if it doesn't exist
INSERT INTO product_categories (name, slug, description, seo_title, seo_description)
SELECT 'EU Driver Licenses', 'eu-driver-licenses', 'Driver licenses from European Union countries', 'EU Driver Licenses', 'Official driver licenses from EU member states'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'eu-driver-licenses');

-- Step 6: Move driver's licenses to regional categories
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'us-driver-licenses')
WHERE category_type = 'license'
  AND (country = 'United States' OR name LIKE '%United States%')
  AND category_id = (SELECT id FROM product_categories WHERE slug = 'drivers-licenses');

UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'eu-driver-licenses')
WHERE category_type = 'license'
  AND country IN ('Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden')
  AND category_id = (SELECT id FROM product_categories WHERE slug = 'drivers-licenses');

-- Step 7: Create Canadian Driver Licenses category
INSERT INTO product_categories (name, slug, description, seo_title, seo_description)
SELECT 'Canadian Driver Licenses', 'canadian-driver-licenses', 'Driver licenses from Canadian provinces', 'Canadian Driver Licenses', 'Official driver licenses from Canadian provinces'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'canadian-driver-licenses');

UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'canadian-driver-licenses')
WHERE category_type = 'license'
  AND (country = 'Canada' OR name LIKE '%Canada%')
  AND category_id = (SELECT id FROM product_categories WHERE slug = 'drivers-licenses');