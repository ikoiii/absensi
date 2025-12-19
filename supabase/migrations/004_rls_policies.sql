-- Migration: Row Level Security Policies
-- Description: Security policies to control data access based on user roles

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Policy: Admin can read all profiles
CREATE POLICY "admin_read_all_profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Users can read their own profile
CREATE POLICY "users_read_own_profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policy: Users can update their own profile
CREATE POLICY "users_update_own_profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Policy: Allow insert during registration (handled by trigger)
CREATE POLICY "users_insert_own_profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- ============================================================================
-- SESSIONS TABLE POLICIES
-- ============================================================================

-- Policy: Admin can do all operations on sessions
CREATE POLICY "admin_all_sessions"
ON public.sessions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Students can read active sessions
CREATE POLICY "students_read_active_sessions"
ON public.sessions
FOR SELECT
TO authenticated
USING (
  is_active = true
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'student'
  )
);

-- ============================================================================
-- ATTENDANCE TABLE POLICIES
-- ============================================================================

-- Policy: Admin can read all attendance records
CREATE POLICY "admin_read_all_attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Students can insert their own attendance
CREATE POLICY "students_insert_own_attendance"
ON public.attendance
FOR INSERT
TO authenticated
WITH CHECK (
  student_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'student'
  )
);

-- Policy: Students can read their own attendance
CREATE POLICY "students_read_own_attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (
  student_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'student'
  )
);

-- Add comments
COMMENT ON POLICY "admin_read_all_profiles" ON public.profiles IS 'Admin can view all user profiles';
COMMENT ON POLICY "users_read_own_profile" ON public.profiles IS 'Users can view their own profile';
COMMENT ON POLICY "admin_all_sessions" ON public.sessions IS 'Admin has full access to sessions';
COMMENT ON POLICY "students_read_active_sessions" ON public.sessions IS 'Students can only view active sessions';
COMMENT ON POLICY "admin_read_all_attendance" ON public.attendance IS 'Admin can view all attendance records';
COMMENT ON POLICY "students_insert_own_attendance" ON public.attendance IS 'Students can record their own attendance';
COMMENT ON POLICY "students_read_own_attendance" ON public.attendance IS 'Students can view their own attendance history';
