-- =============================================
-- Shopping Cart System
-- =============================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.user_carts CASCADE;

-- User shopping carts table
CREATE TABLE public.user_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure user can't have duplicate products in cart
  UNIQUE(user_id, product_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_carts_user_id ON public.user_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_carts_product_id ON public.user_carts(product_id);

-- Enable RLS
ALTER TABLE public.user_carts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own cart" ON public.user_carts;
CREATE POLICY "Users can view own cart"
  ON public.user_carts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert to own cart" ON public.user_carts;
CREATE POLICY "Users can insert to own cart"
  ON public.user_carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cart" ON public.user_carts;
CREATE POLICY "Users can update own cart"
  ON public.user_carts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from own cart" ON public.user_carts;
CREATE POLICY "Users can delete from own cart"
  ON public.user_carts FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_user_carts_updated_at ON public.user_carts;
CREATE TRIGGER update_user_carts_updated_at
  BEFORE UPDATE ON public.user_carts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comment
COMMENT ON TABLE public.user_carts IS 'User shopping cart items';
