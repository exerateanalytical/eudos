-- Update existing categories with display order
UPDATE product_categories SET display_order = 1, is_visible_in_menu = true WHERE slug = 'passports';
UPDATE product_categories SET display_order = 2, is_visible_in_menu = true WHERE slug = 'driver-licenses';
UPDATE product_categories SET display_order = 3, is_visible_in_menu = true WHERE slug = 'citizenship-documents';
UPDATE product_categories SET display_order = 4, is_visible_in_menu = true WHERE slug = 'educational-certificates';
UPDATE product_categories SET display_order = 5, is_visible_in_menu = true WHERE slug = 'professional-certifications';

-- Insert subcategories if they don't exist
INSERT INTO product_categories (name, slug, description, parent_id, display_order, is_visible_in_menu)
SELECT 'US Passports', 'us-passports', 'United States passport documents', pc.id, 1, true
FROM product_categories pc WHERE pc.slug = 'passports'
AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'us-passports');

INSERT INTO product_categories (name, slug, description, parent_id, display_order, is_visible_in_menu)
SELECT 'UK Passports', 'uk-passports', 'United Kingdom passport documents', pc.id, 2, true
FROM product_categories pc WHERE pc.slug = 'passports'
AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'uk-passports');

INSERT INTO product_categories (name, slug, description, parent_id, display_order, is_visible_in_menu)
SELECT 'EU Passports', 'eu-passports', 'European Union member state passports', pc.id, 3, true
FROM product_categories pc WHERE pc.slug = 'passports'
AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'eu-passports');

INSERT INTO product_categories (name, slug, description, parent_id, display_order, is_visible_in_menu)
SELECT 'US Driver Licenses', 'us-driver-licenses', 'State-issued driver licenses from the USA', pc.id, 1, true
FROM product_categories pc WHERE pc.slug = 'driver-licenses'
AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'us-driver-licenses');

INSERT INTO product_categories (name, slug, description, parent_id, display_order, is_visible_in_menu)
SELECT 'International Driver Permits', 'international-driver-permits', 'International driving permits', pc.id, 2, true
FROM product_categories pc WHERE pc.slug = 'driver-licenses'
AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'international-driver-permits');

INSERT INTO product_categories (name, slug, description, parent_id, display_order, is_visible_in_menu)
SELECT 'High School Diplomas', 'high-school-diplomas', 'High school graduation certificates', pc.id, 1, true
FROM product_categories pc WHERE pc.slug = 'educational-certificates'
AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'high-school-diplomas');

INSERT INTO product_categories (name, slug, description, parent_id, display_order, is_visible_in_menu)
SELECT 'University Degrees', 'university-degrees', 'Bachelor, Master, and Doctoral degrees', pc.id, 2, true
FROM product_categories pc WHERE pc.slug = 'educational-certificates'
AND NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'university-degrees');

-- Update products to use category_id
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'passports' LIMIT 1)
WHERE category_type ILIKE '%passport%' AND category_id IS NULL;

UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'driver-licenses' LIMIT 1)
WHERE category_type ILIKE '%license%' AND category_id IS NULL;