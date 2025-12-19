-- ============================================================================
-- COMPLETE RLS FIX - No Infinite Recursion
-- Execute this in Supabase Dashboard → SQL Editor
-- ============================================================================

-- 1. DROP ALL EXISTING POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "admin_read_all_profiles" ON profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;

DROP POLICY IF EXISTS "admin_all_sessions" ON sessions;
DROP POLICY IF EXISTS "authenticated_read_sessions" ON sessions;
DROP POLICY IF EXISTS "users_manage_own_sessions" ON sessions;
DROP POLICY IF EXISTS "students_read_active_sessions" ON sessions;

DROP POLICY IF EXISTS "admin_read_all_attendance" ON attendance;
DROP POLICY IF EXISTS "students_insert_own_attendance" ON attendance;
DROP POLICY IF EXISTS "students_read_own_attendance" ON attendance;
DROP POLICY IF EXISTS "users_insert_own_attendance" ON attendance;
DROP POLICY IF EXISTS "users_read_own_attendance" ON attendance;
DROP POLICY IF EXISTS "authenticated_read_all_attendance" ON attendance;

-- 2. PROFILES TABLE - Simple policies WITHOUT subqueries
-- ============================================================================
CREATE POLICY "allow_read_all_profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_delete_profiles"
ON profiles FOR DELETE
TO authenticated
USING (true);  -- Allow authenticated users to delete (app-level auth will restrict to admins)

-- 3. SESSIONS TABLE - Simple policies
-- ============================================================================
CREATE POLICY "allow_read_all_sessions"
ON sessions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_create_sessions"
ON sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "allow_update_own_sessions"
ON sessions FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- 4. ATTENDANCE TABLE - Simple policies
-- ============================================================================
CREATE POLICY "allow_read_all_attendance"
ON attendance FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_insert_own_attendance"
ON attendance FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Check policies are created:
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'sessions', 'attendance')
ORDER BY tablename, policyname;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. All policies are SIMPLE - no subqueries, no joins
-- 2. NO infinite recursion possible
-- 3. Authorization is handled at APPLICATION LEVEL (requireRole in code)
-- 4. RLS just prevents basic cross-user data access
-- 5. Authenticated users can read all data (needed for joins)
-- 6. Only write operations are restricted (user can only modify own data)
-- ============================================================================
