-- Create product categories for Canadian and EU universities
INSERT INTO product_categories (name, slug, description, seo_title, seo_description)
SELECT 'Canadian Universities', 'canadian-universities', 'Diplomas from top Canadian universities and colleges', 'Canadian University Diplomas', 'Official diplomas from accredited Canadian universities and institutions'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'canadian-universities');

INSERT INTO product_categories (name, slug, description, seo_title, seo_description)
SELECT 'EU Universities', 'eu-universities', 'Diplomas from prestigious European universities', 'European University Diplomas', 'Official diplomas from top-ranked European universities'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'eu-universities');

-- Add all remaining US universities to the existing Diplomas category
WITH diplomas_category AS (
  SELECT id FROM product_categories WHERE slug = 'diplomas'
),
remaining_us_universities AS (
  SELECT * FROM (VALUES
    ('University of Rochester', 'rochester', 'Rochester, NY', 12000, 'USA'),
    ('Case Western Reserve University', 'case-western', 'Cleveland, OH', 11000, 'USA'),
    ('Stony Brook University', 'stony-brook', 'Stony Brook, NY', 9500, 'USA'),
    ('University of California--Santa Cruz', 'ucsc', 'Santa Cruz, CA', 10000, 'USA'),
    ('Lehigh University', 'lehigh', 'Bethlehem, PA', 10000, 'USA'),
    ('Worcester Polytechnic Institute', 'wpi', 'Worcester, MA', 10000, 'USA'),
    ('Rensselaer Polytechnic Institute', 'rpi', 'Troy, NY', 10000, 'USA'),
    ('Brandeis University', 'brandeis', 'Waltham, MA', 10000, 'USA'),
    ('Colorado School of Mines', 'mines', 'Golden, CO', 9500, 'USA'),
    ('Oklahoma State University', 'okstate', 'Stillwater, OK', 8500, 'USA'),
    ('Miami University', 'miami-ohio', 'Oxford, OH', 9000, 'USA'),
    ('University at Buffalo--SUNY', 'buffalo', 'Buffalo, NY', 9000, 'USA'),
    ('Fordham University', 'fordham', 'New York, NY', 10000, 'USA'),
    ('University of Cincinnati', 'cincinnati', 'Cincinnati, OH', 9000, 'USA'),
    ('Baylor University', 'baylor', 'Waco, TX', 9000, 'USA'),
    ('George Washington University', 'gwu', 'Washington, DC', 10000, 'USA'),
    ('American University', 'american', 'Washington, DC', 9500, 'USA'),
    ('Southern Methodist University', 'smu', 'Dallas, TX', 9500, 'USA'),
    ('Temple University', 'temple', 'Philadelphia, PA', 9000, 'USA'),
    ('Oregon State University', 'oregon-state', 'Corvallis, OR', 8500, 'USA'),
    ('University of South Florida', 'usf', 'Tampa, FL', 8500, 'USA'),
    ('Hofstra University', 'hofstra', 'Hempstead, NY', 9000, 'USA'),
    ('St. Louis University', 'slu', 'St. Louis, MO', 9000, 'USA'),
    ('University of Richmond', 'richmond', 'Richmond, VA', 9500, 'USA'),
    ('Binghamton University--SUNY', 'binghamton', 'Binghamton, NY', 9000, 'USA'),
    ('Northern Illinois University', 'niu', 'DeKalb, IL', 8000, 'USA'),
    ('Clark University', 'clark', 'Worcester, MA', 9000, 'USA')
  ) AS t(name, slug, location, price, country)
)
INSERT INTO cms_products (
  name, slug, description, category_type, country, price, 
  status, category_id, stock_status, stock_quantity, features, seo_description
)
SELECT 
  name || ' Diploma' as name,
  slug as slug,
  'Official academic diploma from ' || name || ' located in ' || location || '. Features holographic security, embossed seals, and official verification.' as description,
  'diploma' as category_type,
  country,
  price as price,
  'active' as status,
  (SELECT id FROM diplomas_category) as category_id,
  'in_stock' as stock_status,
  50 as stock_quantity,
  jsonb_build_array(
    'Embossed university seal', 'Holographic security features', 'Official signatures',
    'Watermarked paper', 'Raised ink printing', 'UV security elements',
    'Official transcript available', 'Verification code included'
  ) as features,
  'Get your official diploma from ' || name || ' with authentic security features and verification.' as seo_description
FROM remaining_us_universities
WHERE NOT EXISTS (
  SELECT 1 FROM cms_products WHERE cms_products.slug = remaining_us_universities.slug
);

-- Add all Canadian universities to Canadian Universities category
WITH canadian_category AS (
  SELECT id FROM product_categories WHERE slug = 'canadian-universities'
),
canadian_universities AS (
  SELECT * FROM (VALUES
    ('Concordia University', 'concordia', 'Montreal, QC', 9000),
    ('Memorial University of Newfoundland', 'mun', 'St. John''s, NL', 9000),
    ('Ryerson University', 'ryerson', 'Toronto, ON', 9000),
    ('University of New Brunswick', 'unb', 'Fredericton, NB', 9000),
    ('University of Windsor', 'uwindsor', 'Windsor, ON', 8500),
    ('Brock University', 'brock', 'St. Catharines, ON', 9500),
    ('Trent University', 'trent', 'Peterborough, ON', 9500),
    ('Wilfrid Laurier University', 'wlu', 'Waterloo, ON', 9500),
    ('Lakehead University', 'lakehead', 'Thunder Bay, ON', 9000),
    ('University of Regina', 'uregina', 'Regina, SK', 9000),
    ('Laurentian University', 'laurentian', 'Sudbury, ON', 9000),
    ('University of Northern British Columbia', 'unbc', 'Prince George, BC', 9000),
    ('Acadia University', 'acadia', 'Wolfville, NS', 9000),
    ('Bishop''s University', 'bishops', 'Sherbrooke, QC', 9000),
    ('Mount Allison University', 'mta', 'Sackville, NB', 9000),
    ('St. Francis Xavier University', 'stfx', 'Antigonish, NS', 9000),
    ('University of Lethbridge', 'uleth', 'Lethbridge, AB', 9000),
    ('Thompson Rivers University', 'tru', 'Kamloops, BC', 8500),
    ('Vancouver Island University', 'viu', 'Nanaimo, BC', 8500),
    ('Nipissing University', 'nipissing', 'North Bay, ON', 8500),
    ('Brandon University', 'brandonu', 'Brandon, MB', 8500),
    ('Cape Breton University', 'cbu', 'Sydney, NS', 8500),
    ('University of Prince Edward Island', 'upei', 'Charlottetown, PE', 8500),
    ('Mount Saint Vincent University', 'msvu', 'Halifax, NS', 8500),
    ('Saint Mary''s University', 'smu-canada', 'Halifax, NS', 8500),
    ('Université de Moncton', 'umoncton', 'Moncton, NB', 9000),
    ('Université de Sherbrooke', 'usherbrooke', 'Sherbrooke, QC', 9500),
    ('École Polytechnique de Montréal', 'polymtl', 'Montreal, QC', 10000),
    ('HEC Montréal', 'hec', 'Montreal, QC', 10000),
    ('École de technologie supérieure', 'etsmtl', 'Montreal, QC', 9500),
    ('Royal Military College of Canada', 'rmc', 'Kingston, ON', 10000),
    ('University of Winnipeg', 'uwinnipeg', 'Winnipeg, MB', 8500),
    ('Algoma University', 'algomau', 'Sault Ste. Marie, ON', 8500),
    ('Université du Québec à Montréal', 'uqam', 'Montreal, QC', 9000),
    ('Ontario Tech University', 'ontariotechu', 'Oshawa, ON', 9000),
    ('MacEwan University', 'macewan', 'Edmonton, AB', 9000),
    ('Athabasca University', 'athabascau', 'Athabasca, AB', 8500),
    ('Trinity Western University', 'twu', 'Langley, BC', 8500)
  ) AS t(name, slug, location, price)
)
INSERT INTO cms_products (
  name, slug, description, category_type, country, price, 
  status, category_id, stock_status, stock_quantity, features, seo_description
)
SELECT 
  name || ' Diploma' as name,
  slug as slug,
  'Official academic diploma from ' || name || ' located in ' || location || ', Canada. Features holographic security, embossed seals, and official verification.' as description,
  'diploma' as category_type,
  'Canada' as country,
  price as price,
  'active' as status,
  (SELECT id FROM canadian_category) as category_id,
  'in_stock' as stock_status,
  50 as stock_quantity,
  jsonb_build_array(
    'Embossed university seal', 'Holographic security features', 'Official signatures',
    'Watermarked paper', 'Raised ink printing', 'UV security elements',
    'Official transcript available', 'Verification code included'
  ) as features,
  'Get your official diploma from ' || name || ' with authentic security features and verification.' as seo_description
FROM canadian_universities
WHERE NOT EXISTS (
  SELECT 1 FROM cms_products WHERE cms_products.slug = canadian_universities.slug
);

-- Add all EU universities to EU Universities category
WITH eu_category AS (
  SELECT id FROM product_categories WHERE slug = 'eu-universities'
),
eu_universities AS (
  SELECT * FROM (VALUES
    ('ETH Zurich', 'eth-zurich', 'Zurich, Switzerland', 15000),
    ('University of Copenhagen', 'copenhagen', 'Copenhagen, Denmark', 13000),
    ('LMU Munich', 'lmu-munich', 'Munich, Germany', 14000),
    ('Heidelberg University', 'heidelberg', 'Heidelberg, Germany', 14000),
    ('University of Amsterdam', 'uva-amsterdam', 'Amsterdam, Netherlands', 13000),
    ('Utrecht University', 'utrecht', 'Utrecht, Netherlands', 13000),
    ('Delft University of Technology', 'tudelft', 'Delft, Netherlands', 13000),
    ('KU Leuven', 'kuleuven', 'Leuven, Belgium', 12000),
    ('University of Vienna', 'univie', 'Vienna, Austria', 12000),
    ('University of Helsinki', 'helsinki', 'Helsinki, Finland', 12000),
    ('Technical University of Munich', 'tum', 'Munich, Germany', 14000),
    ('École Polytechnique', 'polytechnique', 'Paris, France', 14000),
    ('Sorbonne University', 'sorbonne', 'Paris, France', 14000),
    ('University of Barcelona', 'ub', 'Barcelona, Spain', 11000),
    ('University of Zurich', 'uzh', 'Zurich, Switzerland', 14000),
    ('University of Groningen', 'rug', 'Groningen, Netherlands', 12000),
    ('University of Geneva', 'unige', 'Geneva, Switzerland', 14000),
    ('University of Padua', 'unipd', 'Padua, Italy', 11000),
    ('University of Milan', 'unimi', 'Milan, Italy', 11000),
    ('Sapienza University of Rome', 'uniroma1', 'Rome, Italy', 11000),
    ('Politecnico di Milano', 'polimi', 'Milan, Italy', 12000),
    ('University of Bologna', 'unibo', 'Bologna, Italy', 11000),
    ('University of Lausanne', 'unil', 'Lausanne, Switzerland', 13000),
    ('Trinity College Dublin', 'tcd', 'Dublin, Ireland', 12000),
    ('University of Antwerp', 'uantwerpen', 'Antwerp, Belgium', 11000),
    ('University of Ghent', 'ugent', 'Ghent, Belgium', 11000),
    ('University of Oslo', 'uio', 'Oslo, Norway', 13000),
    ('University of Bergen', 'uib', 'Bergen, Norway', 12000),
    ('University of Stockholm', 'su', 'Stockholm, Sweden', 12000),
    ('Karolinska Institute', 'ki', 'Stockholm, Sweden', 13000),
    ('Uppsala University', 'uu', 'Uppsala, Sweden', 12000),
    ('Lund University', 'lu', 'Lund, Sweden', 12000),
    ('Technical University of Denmark', 'dtu', 'Lyngby, Denmark', 12000),
    ('University of Warsaw', 'uw', 'Warsaw, Poland', 9500),
    ('University of Wrocław', 'uwr', 'Wrocław, Poland', 9500),
    ('University of Turku', 'utu', 'Turku, Finland', 11000),
    ('University of Freiburg', 'unifreiburg', 'Freiburg, Germany', 13000),
    ('University of Tübingen', 'uni-tuebingen', 'Tübingen, Germany', 13000),
    ('University of Stuttgart', 'uni-stuttgart', 'Stuttgart, Germany', 13000),
    ('RWTH Aachen University', 'rwth-aachen', 'Aachen, Germany', 13000),
    ('University of Leipzig', 'uni-leipzig', 'Leipzig, Germany', 12000),
    ('Autonomous University of Barcelona', 'uab', 'Barcelona, Spain', 11000),
    ('Complutense University of Madrid', 'ucm', 'Madrid, Spain', 11000),
    ('University of Granada', 'ugr', 'Granada, Spain', 10000),
    ('University of Valencia', 'uv', 'Valencia, Spain', 10000),
    ('Polytechnic University of Valencia', 'upv', 'Valencia, Spain', 11000)
  ) AS t(name, slug, location, price)
)
INSERT INTO cms_products (
  name, slug, description, category_type, country, price, 
  status, category_id, stock_status, stock_quantity, features, seo_description
)
SELECT 
  name || ' Diploma' as name,
  slug as slug,
  'Official academic diploma from ' || name || ' located in ' || location || '. Features holographic security, embossed seals, and official verification.' as description,
  'diploma' as category_type,
  'EU' as country,
  price as price,
  'active' as status,
  (SELECT id FROM eu_category) as category_id,
  'in_stock' as stock_status,
  50 as stock_quantity,
  jsonb_build_array(
    'Embossed university seal', 'Holographic security features', 'Official signatures',
    'Watermarked paper', 'Raised ink printing', 'UV security elements',
    'Official transcript available', 'Verification code included'
  ) as features,
  'Get your official diploma from ' || name || ' with authentic security features and verification.' as seo_description
FROM eu_universities
WHERE NOT EXISTS (
  SELECT 1 FROM cms_products WHERE cms_products.slug = eu_universities.slug
);