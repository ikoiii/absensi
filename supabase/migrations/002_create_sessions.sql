-- Migration: Create sessions table
-- Description: Attendance sessions created by admin for classes
-- Each session has a unique ID used for QR code generation

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sessions_created_by ON public.sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_sessions_is_active ON public.sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Add comments to table
COMMENT ON TABLE public.sessions IS 'Attendance sessions for classes';
COMMENT ON COLUMN public.sessions.id IS 'Unique session ID (used in QR code)';
COMMENT ON COLUMN public.sessions.course_name IS 'Name of the course/class';
COMMENT ON COLUMN public.sessions.created_by IS 'Admin user who created this session';
COMMENT ON COLUMN public.sessions.is_active IS 'Whether the session is active for scanning';
