-- Drop the problematic security definer view if it exists
DROP VIEW IF EXISTS public.application_stats;

-- Create a secure function to get application stats
-- This extracts city/state info from the address field
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
    -- Extract state/city from address - simplified for now, returns NULL
    NULL::text as state,
    NULL::text as city,
    COUNT(*)::bigint as application_count,
    DATE_TRUNC('month', apps.created_at) as month_year
  FROM public.applications apps
  WHERE auth.uid() IS NOT NULL
  GROUP BY DATE_TRUNC('month', apps.created_at)
  ORDER BY month_year DESC;
$$;