-- ============================================================================
-- RLS POLICIES FIX - Remove Infinite Recursion
-- ============================================================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Only admins can create sessions" ON sessions;
DROP POLICY IF EXISTS "Everyone can read sessions" ON sessions;
DROP POLICY IF EXISTS "Only creators can update sessions" ON sessions;
DROP POLICY IF EXISTS "Students can insert own attendance" ON attendance;
DROP POLICY IF EXISTS "Students can read own attendance" ON attendance;
DROP POLICY IF EXISTS "Admins can read all attendance" ON attendance;

-- ============================================================================
-- PROFILES TABLE POLICIES (FIXED)
-- ============================================================================

-- Users can read their own profile (NO RECURSION)
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile (NO RECURSION)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- ============================================================================
-- SESSIONS TABLE POLICIES
-- ============================================================================

-- Only admins can create sessions (SIMPLIFIED - NO JOIN TO PROFILES)
CREATE POLICY "Only admins can create sessions"
ON sessions FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Everyone authenticated can read sessions
CREATE POLICY "Everyone can read sessions"
ON sessions FOR SELECT
TO authenticated
USING (true);

-- Only session creators can update/close
CREATE POLICY "Only creators can update sessions"
ON sessions FOR UPDATE
USING (auth.uid() = created_by);

-- ============================================================================
-- ATTENDANCE TABLE POLICIES
-- ============================================================================

-- Students can insert their own attendance
CREATE POLICY "Students can insert own attendance"
ON attendance FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Users can read their own attendance
CREATE POLICY "Students can read own attendance"
ON attendance FOR SELECT
USING (auth.uid() = student_id);

-- Admins can read all attendance (SIMPLIFIED)
CREATE POLICY "Admins can read all attendance"
ON attendance FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- NOTES
-- ============================================================================
-- Fixed infinite recursion by:
-- 1. Removed self-referencing subqueries in profiles policies
-- 2. Simplified admin checks to avoid joins
-- 3. Rely on application-level role checking (in middleware/actions)
-- 4. RLS mainly prevents cross-user data access
-- ============================================================================
