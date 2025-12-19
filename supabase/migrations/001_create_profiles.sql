-- Migration: Create profiles table
-- Description: User profiles table that extends auth.users
-- This table stores additional user information and role

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  nim TEXT, -- Nullable for admin users
  role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add comment to table
COMMENT ON TABLE public.profiles IS 'User profiles table with role-based information';
COMMENT ON COLUMN public.profiles.id IS 'Foreign key to auth.users.id';
COMMENT ON COLUMN public.profiles.full_name IS 'User full name';
COMMENT ON COLUMN public.profiles.nim IS 'Student ID number (Nomor Induk Mahasiswa), null for admin';
COMMENT ON COLUMN public.profiles.role IS 'User role: admin or student';
