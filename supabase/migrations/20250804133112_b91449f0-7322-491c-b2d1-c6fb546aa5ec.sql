-- Create a table for email signups
CREATE TABLE public.email_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for email signups
CREATE POLICY "Anyone can insert email signups" 
ON public.email_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view email signups" 
ON public.email_signups 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_email_signups_updated_at
BEFORE UPDATE ON public.email_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();