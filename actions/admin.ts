'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth';

/**
 * Server Actions for Admin Management
 */

/**
 * Create new admin account (admin-only)
 */
export async function createAdminAction(formData: {
  email: string;
  full_name: string;
  password: string;
}) {
  // Only admins can create admin accounts
  await requireRole('admin');
  
  const supabase = await createClient();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
        role: 'admin',
      },
    },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || 'Gagal membuat akun admin',
    };
  }

  // Profile will be auto-created by database trigger with admin role
  revalidatePath('/admin/manage-admins');
  
  return {
    success: true,
    message: 'Admin baru berhasil dibuat',
  };
}

/**
 * Get all admin accounts
 */
export async function getAllAdmins() {
  await requireRole('admin');
  
  const supabase = await createClient();

  const { data: admins, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Gagal mengambil data admin: ' + error.message);
  }

  return admins;
}

/**
 * Delete admin account (cannot delete self)
 */
export async function deleteAdminAction(adminId: string) {
  const { user } = await requireRole('admin');
  
  // Cannot delete self
  if (user.id === adminId) {
    return {
      success: false,
      error: 'Tidak dapat menghapus akun sendiri',
    };
  }

  const supabase = await createClient();

  // Delete profile (auth user will remain but won't be able to access app)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', adminId)
    .eq('role', 'admin'); // Extra safety: only delete admin profiles

  if (error) {
    return {
      success: false,
      error: 'Gagal menghapus admin: ' + error.message,
    };
  }

  revalidatePath('/admin/manage-admins');
  
  return {
    success: true,
    message: 'Admin berhasil dihapus',
  };
}
