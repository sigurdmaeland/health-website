-- Add FAQs column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- Add a comment to describe the column
COMMENT ON COLUMN products.faqs IS 'Frequently asked questions as JSON array with question and answer fields';
