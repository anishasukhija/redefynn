-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  address TEXT NOT NULL,
  annual_income TEXT NOT NULL,
  job_description TEXT NOT NULL,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE profiles.user_id = $1),
    FALSE
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create policies for applications that allow admins full access
CREATE POLICY "Users can view their own applications OR admins can view all" 
ON public.applications 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update applications" 
ON public.applications 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete applications" 
ON public.applications 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, is_admin)
  VALUES (NEW.id, NEW.email, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();