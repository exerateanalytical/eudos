-- Create Driver's Licenses category
INSERT INTO product_categories (name, slug, description, display_order, is_visible_in_menu)
VALUES (
  'Driver''s Licenses',
  'drivers-licenses',
  'International driver''s licenses from various countries',
  1,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Update the driver's license product to use this category
UPDATE cms_products
SET category_id = (SELECT id FROM product_categories WHERE slug = 'drivers-licenses')
WHERE category_type = 'license';