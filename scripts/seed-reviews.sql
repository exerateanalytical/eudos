-- Seed script to populate database with realistic reviews
-- This creates 300 diverse user profiles and 7-13 reviews per product
-- Reviews range from 3.5-5 stars and span 2019-present

-- Note: Run this manually from Supabase SQL editor
-- First, you'll need to create the users via signup, then link profiles

-- Sample insert for reviews (to be executed after users are created)
-- This is a template showing the structure

/*
Example Usage:
1. Create 300 user accounts via the signup form or Supabase Auth
2. Note their user IDs
3. Update this script with actual user IDs
4. Run this script to populate reviews
*/

-- Product IDs for Driver's Licenses (32 countries)
-- license-austria, license-belgium, license-bulgaria, license-croatia, license-cyprus, 
-- license-czech-republic, license-denmark, license-estonia, license-finland, license-france,
-- license-germany, license-greece, license-hungary, license-ireland, license-italy,
-- license-latvia, license-lithuania, license-luxembourg, license-malta, license-netherlands,
-- license-poland, license-portugal, license-romania, license-slovakia, license-slovenia,
-- license-spain, license-sweden, license-united-states, license-united-kingdom, license-canada,
-- license-australia, license-switzerland

-- Product IDs for Passports (32 countries)
-- passport-austria, passport-belgium, passport-bulgaria, etc.

-- Review text templates (realistic and varied)
-- Quality-focused reviews:
-- "Outstanding quality document. The security features are exactly as described and passed verification without issues."
-- "Received my license last week. Print quality is exceptional, all holograms look authentic."
-- "Very impressed with the attention to detail. The microtext and UV features are spot-on."

-- Delivery reviews:
-- "Fast shipping, arrived 2 days earlier than expected. Package was discreet and secure."
-- "Excellent delivery time. Tracking was accurate and the document arrived in perfect condition."
-- "Delivery took exactly as promised - 7 business days. Well packaged and protected."

-- Customer service reviews:
-- "Customer support was very helpful with my questions. Professional and responsive."
-- "Had a question about specifications, got a detailed response within hours. Great service!"
-- "The team guided me through the entire process. Very professional experience."

-- Overall satisfaction reviews:
-- "Everything went smoothly from order to delivery. Would definitely recommend."
-- "Perfect transaction. Document quality exceeded my expectations."
-- "Legit service, exactly what I needed. The document works flawlessly."

-- Example INSERT statements (replace UUIDs with actual user IDs):
/*
INSERT INTO public.reviews (user_id, product_type, product_id, rating, review_text, status, created_at) VALUES
-- Austria Driver's License Reviews
('USER_UUID_1', 'license', 'license-austria', 5, 'Outstanding quality document. The security features are exactly as described and passed verification without issues.', 'approved', '2024-08-15 10:30:00+00'),
('USER_UUID_2', 'license', 'license-austria', 4.5, 'Fast shipping, arrived 2 days earlier than expected. The holograms look perfect.', 'approved', '2024-03-22 14:20:00+00'),
('USER_UUID_3', 'license', 'license-austria', 5, 'Very impressed with the attention to detail. All security features are authentic.', 'approved', '2023-11-10 09:15:00+00'),
-- ... continue for all products
*/

-- Note: This is a reference template. Actual implementation requires:
-- 1. User creation via Auth signup
-- 2. Profile data population
-- 3. Review insertion with proper user UUIDs
-- 4. Timestamps distributed from 2019 to present
-- 5. Ratings between 3.5 and 5.0
-- 6. Each user reviews maximum 2 products
-- 7. Each product gets 7-13 reviews
