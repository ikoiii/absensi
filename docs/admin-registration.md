# Admin Registration

## How to Create Admin Accounts

**IMPORTANT:** Admin/Dosen accounts CANNOT be created through public registration for security reasons.

### Creating the First Admin

Since the system needs at least one admin to create other admins, you have two options:

**Option 1: Direct Database Insert (Recommended for first admin)**

Execute this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Insert admin user in auth.users (replace with actual admin email/password)
-- Note: You'll need to do this through Supabase Auth UI or use Supabase dashboard

-- Then insert profile with admin role
INSERT INTO profiles (id, full_name, email, nim, role)
VALUES (
  'USER_ID_FROM_AUTH',  -- Get this from auth.users table after creating user
  'Admin Name',
  'admin@example.com',
  NULL,  -- Admin doesn't need NIM
  'admin'
);
```

**Option 2: Temporarily Allow Admin Registration**

1. Temporarily modify `app/(auth)/register/page.tsx`:
   - Change `role: 'student'` to `role: 'admin'` in defaultValues
   - Remove NIM field requirement
2. Register your admin account
3. Revert the changes immediately
4. Commit the reverted code to prevent security issues

### Creating Additional Admins (Future Enhancement)

**TODO:** Create admin management feature in Admin Panel:

- Add `/admin/manage-admins` page
- Allow existing admins to create new admin accounts
- Implement server action: `createAdminAction(email, full_name, password)`
- Requires `requireRole('admin')` authorization

## Current Security Model

- ✅ Public registration = Student only
- ✅ Students must provide NIM
- ✅ No role selection exposed to users
- ⚠️ Admin creation currently manual (via database or temp code change)
- 📋 Future: Admin panel feature for admin creation

## Notes

- All registration goes through the same `/register` page
- Role is forced to `'student'` in the form submission
- Login page works for both students and admins
- After login, middleware redirects based on role in database
