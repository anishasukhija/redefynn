
-- First, let's make sure you have admin privileges
-- Replace 'your-email@example.com' with your actual email address
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- Update RLS policies for applications to allow admins to see all details
-- but regular users to only see limited information

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own applications OR admins can view all" ON public.applications;

-- Create new policies for different levels of access
-- Regular users can only see their own applications
CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all applications with full details
CREATE POLICY "Admins can view all applications" 
ON public.applications 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create a view for public application statistics (location and count only)
CREATE OR REPLACE VIEW public.application_stats AS
SELECT 
  SPLIT_PART(TRIM(SPLIT_PART(address, ',', -1)), ' ', -1) as state,
  SPLIT_PART(TRIM(SPLIT_PART(address, ',', -2)), ' ', 1) as city,
  COUNT(*) as application_count,
  DATE_TRUNC('month', created_at) as month_year
FROM public.applications
GROUP BY 
  SPLIT_PART(TRIM(SPLIT_PART(address, ',', -1)), ' ', -1),
  SPLIT_PART(TRIM(SPLIT_PART(address, ',', -2)), ' ', 1),
  DATE_TRUNC('month', created_at);

-- Allow authenticated users to view application statistics
GRANT SELECT ON public.application_stats TO authenticated;
