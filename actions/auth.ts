'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { LoginFormData, RegisterFormData } from '@/lib/validations';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, ROUTES } from '@/lib/constants';

/**
 * Server Actions for Authentication
 * 
 * Handle login, register, and logout operations
 */

/**
 * Login action
 * @param formData - Email and password
 * @returns Success or error message
 */
export async function loginAction(formData: LoginFormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return {
      success: false,
      error: ERROR_MESSAGES.INVALID_CREDENTIALS,
    };
  }

  // Get user's profile to determine role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single<{ role: string }>();

  // Revalidate and redirect based on role
  revalidatePath('/', 'layout');

  if (profile?.role === 'admin') {
    redirect(ROUTES.ADMIN_DASHBOARD);
  } else {
    redirect(ROUTES.STUDENT_DASHBOARD);
  }
}

/**
 * Register action
 * @param formData - Registration form data with metadata
 * @returns Success or error message
 */
export async function registerAction(formData: RegisterFormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
        nim: formData.nim || null,
        role: formData.role,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  if (!data.user) {
    return {
      success: false,
      error: 'Gagal membuat akun',
    };
  }

  // Profile will be auto-created by database trigger
  // Revalidate and redirect based on role
  revalidatePath('/', 'layout');

  if (formData.role === 'admin') {
    redirect(ROUTES.ADMIN_DASHBOARD);
  } else {
    redirect(ROUTES.STUDENT_DASHBOARD);
  }
}

/**
 * Logout action
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect(ROUTES.LOGIN);
}

/**
 * Get current user and profile
 * Used in server components
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}
