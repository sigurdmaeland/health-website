-- =============================================
-- Update User Favorites to store product data
-- =============================================

-- Drop the foreign key constraint to products table
ALTER TABLE public.user_favorites 
DROP CONSTRAINT IF EXISTS user_favorites_product_id_fkey;

-- Add columns to store product data directly
ALTER TABLE public.user_favorites 
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_slug TEXT,
ADD COLUMN IF NOT EXISTS product_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS product_image TEXT,
ADD COLUMN IF NOT EXISTS product_description TEXT;

-- Update the comment
COMMENT ON TABLE public.user_favorites IS 'User wishlist/favorites with embedded product data';
