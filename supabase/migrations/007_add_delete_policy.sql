-- Quick Fix: Add DELETE policy for profiles
-- Execute this in Supabase Dashboard → SQL Editor

-- Add DELETE policy for profiles table
CREATE POLICY "allow_delete_profiles"
ON profiles FOR DELETE
TO authenticated
USING (true);

-- Verification
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;
