-- Add columns one by one with error handling
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_categories' AND column_name='display_order') THEN
    ALTER TABLE product_categories ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_categories' AND column_name='is_visible_in_menu') THEN
    ALTER TABLE product_categories ADD COLUMN is_visible_in_menu BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_categories' AND column_name='icon') THEN
    ALTER TABLE product_categories ADD COLUMN icon TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_categories' AND column_name='seo_title') THEN
    ALTER TABLE product_categories ADD COLUMN seo_title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_categories' AND column_name='seo_description') THEN
    ALTER TABLE product_categories ADD COLUMN seo_description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_categories' AND column_name='og_image') THEN
    ALTER TABLE product_categories ADD COLUMN og_image TEXT;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON cms_products(category_id);