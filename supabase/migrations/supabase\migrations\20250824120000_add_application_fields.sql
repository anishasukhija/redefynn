-- Migration: add application fields for onboarding form
-- Adds: years_in_practice, cd_courses, preferred_location, fund_request, previous_loans
-- Run this against your Supabase/Postgres database.

BEGIN;

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS years_in_practice INTEGER,
  ADD COLUMN IF NOT EXISTS cd_courses TEXT,
  ADD COLUMN IF NOT EXISTS preferred_location VARCHAR(200),
  ADD COLUMN IF NOT EXISTS fund_request NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS previous_loans TEXT;

COMMIT;

-- NOTE: `previous_loans` is intentionally left nullable (optional).
