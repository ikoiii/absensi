-- Add DELETE policy for sessions table
-- This allows authenticated users to delete sessions
-- Application-level logic restricts deletion to session creators only

CREATE POLICY "allow_delete_sessions"
ON sessions FOR DELETE
TO authenticated
USING (true);

-- Add DELETE policy for attendance table  
-- This allows authenticated users to delete attendance records
-- Application-level logic restricts this to admins only

CREATE POLICY "allow_delete_attendance"
ON attendance FOR DELETE
TO authenticated
USING (true);
