-- =============================================
-- Update User Cart to store product data
-- =============================================

-- Drop the foreign key constraint to products table
ALTER TABLE public.user_carts 
DROP CONSTRAINT IF EXISTS user_carts_product_id_fkey;

-- Add columns to store product data directly
ALTER TABLE public.user_carts 
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_slug TEXT,
ADD COLUMN IF NOT EXISTS product_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS product_image TEXT,
ADD COLUMN IF NOT EXISTS product_description TEXT,
ADD COLUMN IF NOT EXISTS product_category TEXT,
ADD COLUMN IF NOT EXISTS product_compare_at_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS product_in_stock BOOLEAN DEFAULT true;

-- Update the comment
COMMENT ON TABLE public.user_carts IS 'User shopping cart with embedded product data';
