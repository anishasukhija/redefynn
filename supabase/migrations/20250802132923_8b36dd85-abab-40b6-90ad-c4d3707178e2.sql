-- Fix Security Issues: Phase 1 Critical Fixes (Final)

-- 1. Since application_stats was a view, create a secure function for admin-only access
-- First drop the existing view
DROP VIEW IF EXISTS public.application_stats;

-- Create a secure function that only admins can access
CREATE OR REPLACE FUNCTION public.get_application_stats()
RETURNS TABLE (
  state text,
  city text,
  application_count bigint,
  month_year timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    a.address as state,
    a.address as city,
    COUNT(*)::bigint as application_count,
    DATE_TRUNC('month', a.created_at) as month_year
  FROM public.applications a
  WHERE is_admin(auth.uid())
  GROUP BY a.address, DATE_TRUNC('month', a.created_at)
  ORDER BY DATE_TRUNC('month', a.created_at) DESC;
$$;

-- 2. Fix admin privilege escalation vulnerability in profiles table
-- Drop the existing update policy that allows unrestricted updates
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a more restrictive update policy that prevents is_admin modification
CREATE POLICY "Users can update their own profile (except admin status)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  -- Prevent users from changing their admin status
  (OLD.is_admin IS NOT DISTINCT FROM NEW.is_admin)
);

-- 3. Create a separate policy for admin status changes (admin-only)
CREATE POLICY "Only existing admins can modify admin status" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id AND 
  is_admin(auth.uid()) AND 
  -- Allow changing is_admin field only if user is already an admin
  (OLD.is_admin != NEW.is_admin)
)
WITH CHECK (
  auth.uid() = user_id AND 
  is_admin(auth.uid())
);

-- 4. Create audit log table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  changed_by UUID,
  old_value TEXT,
  new_value TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log (admin-only access)
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add audit trigger for admin privilege changes
CREATE OR REPLACE FUNCTION public.audit_admin_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when admin status changes
  IF OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
    INSERT INTO public.security_audit_log (
      event_type,
      user_id,
      changed_by,
      old_value,
      new_value,
      timestamp
    ) VALUES (
      'admin_status_change',
      NEW.user_id,
      auth.uid(),
      OLD.is_admin::text,
      NEW.is_admin::text,
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add the audit trigger to profiles table
DROP TRIGGER IF EXISTS audit_admin_status_changes ON public.profiles;
CREATE TRIGGER audit_admin_status_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_admin_changes();