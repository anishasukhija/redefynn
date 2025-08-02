-- Fix Security Definer View Issue
-- Drop the existing view
DROP VIEW IF EXISTS public.application_stats;

-- Recreate as a regular view without SECURITY DEFINER
CREATE VIEW public.application_stats AS
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

-- Grant access to authenticated users for the view
GRANT SELECT ON public.application_stats TO authenticated;

-- Update admin email - replace with your actual email
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'anishasukhija01@gmail.com';