-- =============================================
-- Add role column to user_profiles
-- =============================================

-- Add role column with default 'customer'
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' 
CHECK (role IN ('customer', 'admin'));

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Update comment
COMMENT ON COLUMN public.user_profiles.role IS 'User role: customer or admin';
