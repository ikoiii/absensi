# Supabase Database Setup

## Overview

This directory contains SQL migration scripts for setting up the database schema for the attendance system.

## Migration Files

Run these migrations in order:

1. **[001_create_profiles.sql](./migrations/001_create_profiles.sql)** - User profiles table
2. **[002_create_sessions.sql](./migrations/002_create_sessions.sql)** - Attendance sessions table
3. **[003_create_attendance.sql](./migrations/003_create_attendance.sql)** - Attendance records table
4. **[004_rls_policies.sql](./migrations/004_rls_policies.sql)** - Row Level Security policies
5. **[005_triggers.sql](./migrations/005_triggers.sql)** - Database triggers

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended for first-time)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Open each migration file in order
5. Copy the SQL content
6. Paste into SQL Editor
7. Click **Run**
8. Verify success message

### Option 2: Supabase CLI

If you have Supabase CLI installed:

```bash
# Initialize Supabase in your project (if not done)
supabase init

# Link to your remote project
supabase link --project-id YOUR_PROJECT_ID

# Push migrations
supabase db push
```

## Database Schema

### Tables

#### `profiles`

- Extends `auth.users` with additional user information
- Stores `full_name`, `nim` (student ID), and `role`
- Role can be 'admin' or 'student'

#### `sessions`

- Created by admin for each class session
- Has unique ID used for QR code
- Tracks whether session is active (`is_active`)

#### `attendance`

- Records when students scan QR codes
- Prevents duplicate scans with unique constraint
- Links to both `sessions` and `profiles`

### Relationships

```
auth.users (1) ←→ (1) profiles
profiles (1) ←→ (many) attendance [as student]
profiles (1) ←→ (many) sessions [as creator]
sessions (1) ←→ (many) attendance
```

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Profiles

- ✅ Admin: Read all profiles
- ✅ Users: Read and update own profile
- ✅ Auto-insert on registration

### Sessions

- ✅ Admin: Full CRUD access
- ✅ Students: Read active sessions only

### Attendance

- ✅ Admin: Read all records
- ✅ Students: Create own attendance, read own history

## Triggers

### `handle_new_user()`

Automatically creates a profile when a user signs up via Supabase Auth.

Metadata expected during registration:

```json
{
  "full_name": "John Doe",
  "nim": "123456789", // optional for admin
  "role": "student" // or "admin"
}
```

### `handle_updated_at()`

Automatically updates `updated_at` timestamp on profile updates.

## Verification

After running migrations, verify:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'sessions', 'attendance');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

## Generate TypeScript Types

After migrations, generate types for TypeScript:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > ../types/database.ts
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

## Rollback (Development Only)

To reset database (⚠️ **deletes all data**):

```sql
-- Drop tables in reverse order
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
```

## Troubleshooting

### Error: "relation already exists"

- Tables already created. Skip that migration or drop tables first.

### Error: "permission denied"

- Make sure you're logged in to Supabase with correct permissions
- Check RLS policies aren't blocking your operations

### Error: "foreign key constraint"

- Run migrations in order (001 → 002 → 003 → 004 → 005)
- Don't skip migrations

### RLS blocking INSERT/UPDATE

- During development, you can temporarily disable RLS:
  ```sql
  ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
  ```
- Re-enable before production!

## Next Steps

After database setup:

1. ✅ Run all migrations
2. ✅ Generate TypeScript types
3. 🔜 Test RLS policies
4. 🔜 Create test users (admin & student)
5. 🔜 Build authentication pages
