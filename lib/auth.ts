import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES, USER_ROLES } from '@/lib/constants';
import type { User } from '@supabase/supabase-js';

/**
 * Auth Helper Functions
 * 
 * Server-side utilities for authentication and authorization
 */

/**
 * Get current authenticated user
 * Returns null if not authenticated
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current user's profile from profiles table
 * Returns null if no profile found
 */
export async function getProfile(): Promise<{
  id: string;
  full_name: string;
  nim: string | null;
  role: string;
  created_at: string;
  updated_at: string;
} | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

/**
 * Get user with profile data
 * Returns null if not authenticated
 */
export async function getUserWithProfile() {
  const user = await getUser();
  if (!user) return null;

  const profile = await getProfile();
  return { user, profile };
}

/**
 * Require authentication
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect(ROUTES.LOGIN);
  }
  return user;
}

/**
 * Require specific role
 * Redirects to appropriate dashboard if wrong role
 */
export async function requireRole(role: 'admin' | 'student'): Promise<{
  user: User;
  profile: { id: string; full_name: string; nim: string | null; role: string; created_at: string; updated_at: string };
}> {
  const user = await requireAuth();
  const profile = await getProfile();

  if (!profile || profile.role !== role) {
    // Redirect to correct dashboard based on actual role
    if (profile?.role === USER_ROLES.ADMIN) {
      redirect(ROUTES.ADMIN_DASHBOARD);
    } else if (profile?.role === USER_ROLES.STUDENT) {
      redirect(ROUTES.STUDENT_DASHBOARD);
    } else {
      redirect(ROUTES.LOGIN);
    }
  }

  return { user, profile: profile! };
}

/**
 * Redirect user based on their role
 */
export function redirectByRole(role: 'admin' | 'student') {
  if (role === USER_ROLES.ADMIN) {
    redirect(ROUTES.ADMIN_DASHBOARD);
  } else {
    redirect(ROUTES.STUDENT_DASHBOARD);
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === USER_ROLES.ADMIN;
}

/**
 * Check if user is student
 */
export async function isStudent(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === USER_ROLES.STUDENT;
}
