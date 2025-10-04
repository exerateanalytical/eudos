-- Create product categories for US and France universities
INSERT INTO product_categories (name, slug, description, seo_title, seo_description)
SELECT 'US Universities', 'us-universities', 'Diplomas from top US universities and colleges', 'US University Diplomas', 'Official diplomas from accredited US universities and institutions'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'us-universities');

INSERT INTO product_categories (name, slug, description, seo_title, seo_description)
SELECT 'France Universities', 'france-universities', 'Diplomas from prestigious French universities', 'French University Diplomas', 'Official diplomas from top-ranked French universities'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'france-universities');

-- Update all existing US university diplomas to the US Universities category
UPDATE cms_products 
SET category_id = (SELECT id FROM product_categories WHERE slug = 'us-universities')
WHERE country = 'USA' 
  AND category_type = 'diploma'
  AND category_id = (SELECT id FROM product_categories WHERE slug = 'diplomas');

-- Add French universities to France Universities category
WITH france_category AS (
  SELECT id FROM product_categories WHERE slug = 'france-universities'
),
french_universities AS (
  SELECT * FROM (VALUES
    ('Sorbonne University', 'sorbonne-fr', 'Paris', 14000),
    ('École Polytechnique', 'polytechnique-fr', 'Palaiseau', 14000),
    ('École Normale Supérieure', 'ens-paris', 'Paris', 14000),
    ('Sciences Po', 'sciences-po', 'Paris', 13000),
    ('HEC Paris', 'hec-paris', 'Jouy-en-Josas', 14000),
    ('ESSEC Business School', 'essec', 'Cergy', 13000),
    ('ESCP Business School', 'escp', 'Paris', 13000),
    ('University of Paris', 'paris-university', 'Paris', 12000),
    ('Paris-Saclay University', 'paris-saclay', 'Gif-sur-Yvette', 12000),
    ('Grenoble Alpes University', 'grenoble', 'Grenoble', 11000),
    ('Aix-Marseille University', 'aix-marseille', 'Marseille', 11000),
    ('University of Strasbourg', 'strasbourg', 'Strasbourg', 11000),
    ('University of Montpellier', 'montpellier', 'Montpellier', 10000),
    ('University of Bordeaux', 'bordeaux', 'Bordeaux', 11000),
    ('University of Lille', 'lille', 'Lille', 10000),
    ('Toulouse University', 'toulouse', 'Toulouse', 11000),
    ('University of Lyon', 'lyon', 'Lyon', 11000),
    ('École Centrale Paris', 'centrale-paris', 'Châtenay-Malabry', 12000),
    ('École des Ponts ParisTech', 'ponts-paristech', 'Marne-la-Vallée', 12000),
    ('CentraleSupélec', 'centralesupelec', 'Gif-sur-Yvette', 12000),
    ('Institut Polytechnique de Paris', 'ip-paris', 'Palaiseau', 13000),
    ('INSA Lyon', 'insa-lyon', 'Lyon', 10000),
    ('University of Nantes', 'nantes', 'Nantes', 10000),
    ('University of Rennes', 'rennes', 'Rennes', 10000),
    ('University of Nice', 'nice', 'Nice', 10000),
    ('Panthéon-Sorbonne University', 'pantheon-sorbonne', 'Paris', 11000),
    ('Panthéon-Assas University', 'pantheon-assas', 'Paris', 11000),
    ('Sorbonne Nouvelle University', 'sorbonne-nouvelle', 'Paris', 10000),
    ('Paris Cité University', 'paris-cite', 'Paris', 11000),
    ('CY Cergy Paris University', 'cy-cergy', 'Cergy', 9500),
    ('University of Angers', 'angers', 'Angers', 9000),
    ('University of Avignon', 'avignon', 'Avignon', 9000),
    ('University of Caen Normandy', 'caen', 'Caen', 9500),
    ('University of Clermont Auvergne', 'clermont', 'Clermont-Ferrand', 9500),
    ('University of Dijon', 'dijon', 'Dijon', 9000),
    ('University of Le Havre', 'le-havre', 'Le Havre', 9000),
    ('University of Limoges', 'limoges', 'Limoges', 9000),
    ('University of Orléans', 'orleans', 'Orléans', 9000),
    ('University of Pau', 'pau', 'Pau', 9000),
    ('University of Perpignan', 'perpignan', 'Perpignan', 9000),
    ('University of Poitiers', 'poitiers', 'Poitiers', 9500),
    ('University of Reims', 'reims', 'Reims', 9000),
    ('University of La Rochelle', 'la-rochelle', 'La Rochelle', 9000),
    ('University of Rouen', 'rouen', 'Rouen', 9500),
    ('University of Saint-Étienne', 'saint-etienne', 'Saint-Étienne', 9000),
    ('University of Tours', 'tours', 'Tours', 9500),
    ('University of Versailles', 'versailles', 'Versailles', 10000),
    ('University of Brest', 'brest', 'Brest', 9000),
    ('University of Mulhouse', 'mulhouse', 'Mulhouse', 9000),
    ('University of Toulon', 'toulon', 'Toulon', 9000)
  ) AS t(name, slug, location, price)
)
INSERT INTO cms_products (
  name, slug, description, category_type, country, price, 
  status, category_id, stock_status, stock_quantity, features, seo_description
)
SELECT 
  name || ' Diploma' as name,
  slug as slug,
  'Official academic diploma from ' || name || ' located in ' || location || ', France. Features holographic security, embossed seals, and official verification.' as description,
  'diploma' as category_type,
  'France' as country,
  price as price,
  'active' as status,
  (SELECT id FROM france_category) as category_id,
  'in_stock' as stock_status,
  50 as stock_quantity,
  jsonb_build_array(
    'Embossed university seal', 'Holographic security features', 'Official signatures',
    'Watermarked paper', 'Raised ink printing', 'UV security elements',
    'Official transcript available', 'Verification code included'
  ) as features,
  'Get your official diploma from ' || name || ' with authentic security features and verification.' as seo_description
FROM french_universities
WHERE NOT EXISTS (
  SELECT 1 FROM cms_products WHERE cms_products.slug = french_universities.slug
);