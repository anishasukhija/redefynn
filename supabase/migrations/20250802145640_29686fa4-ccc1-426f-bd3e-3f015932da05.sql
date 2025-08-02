-- Drop the problematic security definer view
DROP VIEW IF EXISTS public.application_stats;

-- Create a secure function to get application stats instead
CREATE OR REPLACE FUNCTION public.get_application_stats()
RETURNS TABLE(
  state text,
  city text,
  application_count bigint,
  month_year timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  -- Only allow authenticated users to access stats
  SELECT 
    CASE WHEN auth.uid() IS NULL THEN NULL ELSE apps.state END as state,
    CASE WHEN auth.uid() IS NULL THEN NULL ELSE apps.city END as city,
    CASE WHEN auth.uid() IS NULL THEN 0 ELSE COUNT(*)::bigint END as application_count,
    CASE WHEN auth.uid() IS NULL THEN NULL ELSE DATE_TRUNC('month', apps.created_at) END as month_year
  FROM public.applications apps
  WHERE auth.uid() IS NOT NULL
  GROUP BY apps.state, apps.city, DATE_TRUNC('month', apps.created_at)
  ORDER BY month_year DESC;
$$;