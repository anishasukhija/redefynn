-- Fix Auth OTP expiry settings (reduce from default to recommended 10 minutes)
UPDATE auth.config 
SET 
  otp_expiry = 600, -- 10 minutes instead of default 1 hour
  password_min_length = 8,
  security_captcha_enabled = true,
  security_update_password_require_reauthentication = true
WHERE true;

-- Enable leaked password protection
INSERT INTO auth.config (name, value) 
VALUES ('password_leaked_protection', 'true')
ON CONFLICT (name) 
DO UPDATE SET value = 'true';