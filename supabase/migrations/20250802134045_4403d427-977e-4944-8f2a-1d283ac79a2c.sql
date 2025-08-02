-- Fix critical security vulnerabilities

-- 1. Drop existing vulnerable policies on profiles table
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- 2. Create secure is_admin function to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE profiles.user_id = $1),
    FALSE
  );
$$;

-- 3. Create security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  event_details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view security audit logs
CREATE POLICY "Only admins can view security audit logs"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only system can insert security audit logs
CREATE POLICY "System can insert security audit logs"
ON public.security_audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id uuid,
  p_event_type text,
  p_event_details jsonb DEFAULT '{}'::jsonb,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, 
    event_type, 
    event_details, 
    ip_address, 
    user_agent
  )
  VALUES (
    p_user_id, 
    p_event_type, 
    p_event_details, 
    p_ip_address, 
    p_user_agent
  );
END;
$$;

-- 5. Create function to prevent admin privilege escalation
CREATE OR REPLACE FUNCTION public.prevent_admin_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Check if is_admin is being changed
  IF OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
    -- Log the attempt
    PERFORM public.log_security_event(
      NEW.user_id,
      'admin_privilege_change_attempt',
      jsonb_build_object(
        'old_admin_status', OLD.is_admin,
        'new_admin_status', NEW.is_admin,
        'changed_by_user_id', auth.uid()
      )
    );
    
    -- Only allow if the user making the change is an admin
    IF NOT public.is_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Access denied: Only administrators can modify admin privileges';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 6. Add trigger to prevent unauthorized admin privilege changes
DROP TRIGGER IF EXISTS prevent_admin_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_admin_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_admin_escalation();

-- 7. Create new secure RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update non-admin fields of their profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  (OLD.is_admin = NEW.is_admin OR public.is_admin(auth.uid()))
);

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 8. Drop the insecure application_stats view
DROP VIEW IF EXISTS public.application_stats;

-- 9. Create secure function to get application statistics (admin only)
CREATE OR REPLACE FUNCTION public.get_application_stats()
RETURNS TABLE (
  state text,
  city text,
  application_count bigint,
  month_year timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  -- Only allow admins to access application statistics
  SELECT 
    CASE 
      WHEN public.is_admin(auth.uid()) THEN apps.address
      ELSE NULL
    END as state,
    CASE 
      WHEN public.is_admin(auth.uid()) THEN apps.address  
      ELSE NULL
    END as city,
    CASE 
      WHEN public.is_admin(auth.uid()) THEN COUNT(*)::bigint
      ELSE 0::bigint
    END as application_count,
    CASE 
      WHEN public.is_admin(auth.uid()) THEN date_trunc('month', apps.created_at)
      ELSE NULL
    END as month_year
  FROM public.applications apps
  WHERE public.is_admin(auth.uid())
  GROUP BY 
    apps.address,
    date_trunc('month', apps.created_at)
  ORDER BY month_year DESC;
$$;

-- 10. Log this security update
SELECT public.log_security_event(
  auth.uid(),
  'security_policies_updated',
  jsonb_build_object(
    'action', 'comprehensive_security_fix',
    'timestamp', now(),
    'changes', ARRAY[
      'fixed_privilege_escalation_vulnerability',
      'secured_application_stats_access',
      'implemented_security_audit_logging',
      'created_admin_privilege_protection'
    ]
  )
);