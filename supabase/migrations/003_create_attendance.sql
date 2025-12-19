-- Migration: Create attendance table
-- Description: Records of student attendance via QR code scanning
-- Prevents duplicate scans with unique constraint

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_session_student UNIQUE (session_id, student_id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_attendance_session_id ON public.attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_scanned_at ON public.attendance(scanned_at DESC);

-- Enable Row Level Security
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Add comments to table
COMMENT ON TABLE public.attendance IS 'Student attendance records';
COMMENT ON COLUMN public.attendance.id IS 'Unique attendance record ID';
COMMENT ON COLUMN public.attendance.session_id IS 'Reference to the session';
COMMENT ON COLUMN public.attendance.student_id IS 'Reference to the student profile';
COMMENT ON COLUMN public.attendance.scanned_at IS 'Timestamp when QR code was scanned';
COMMENT ON CONSTRAINT unique_session_student ON public.attendance IS 'Prevents duplicate attendance for same session';
