'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { CreateSessionFormData } from '@/lib/validations';
import { requireRole } from '@/lib/auth';

/**
 * Server Actions for Session Management
 */

/**
 * Create new session
 */
export async function createSessionAction(formData: CreateSessionFormData) {
  const { user } = await requireRole('admin');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sessions')
    // @ts-ignore - Supabase type inference limitation
    .insert({
      course_name: formData.course_name,
      created_by: user.id,
      is_active: true,
    })
    .select()
    .single<{
      id: string;
      course_name: string;
      created_by: string;
      created_at: string;
      is_active: boolean;
    }>();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/admin/sessions');
  redirect(`/admin/sessions/${data.id}`);
}

/**
 * Close session (set is_active = false)
 */
export async function closeSessionAction(sessionId: string) {
  await requireRole('admin');
  const supabase = await createClient();

  const updatePayload = { is_active: false };
  const { error } = await supabase
    .from('sessions')
    // @ts-ignore - Supabase type inference limitation
    .update(updatePayload)
    .eq('id', sessionId);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(`/admin/sessions/${sessionId}`);
  revalidatePath('/admin/sessions');
  
  return {
    success: true,
  };
}

/**
 * Delete session permanently (also deletes all attendance records)
 */
export async function deleteSessionAction(sessionId: string) {
  const { user } = await requireRole('admin');
  const supabase = await createClient();

  // First, delete all attendance records for this session
  const { error: attendanceError } = await supabase
    .from('attendance')
    .delete()
    .eq('session_id', sessionId);

  if (attendanceError) {
    return {
      success: false,
      error: 'Gagal menghapus data kehadiran: ' + attendanceError.message,
    };
  }

  // Then delete the session itself
  const { error: sessionError } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId)
    .eq('created_by', user.id); // Only creator can delete

  if (sessionError) {
    return {
      success: false,
      error: 'Gagal menghapus sesi: ' + sessionError.message,
    };
  }

  revalidatePath('/admin/sessions');
  redirect('/admin/sessions');
}

/**
 * Get session with attendance data
 */
export async function getSessionWithAttendance(sessionId: string) {
  const supabase = await createClient();

  // Get session details
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single<{
      id: string;
      course_name: string;
      created_by: string;
      created_at: string;
      is_active: boolean;
    }>();

  if (sessionError || !session) {
    return null;
  }

  // Get attendance with student profiles
  const { data: attendance } = await supabase
    .from('attendance')
    .select(`
      id,
      scanned_at,
      profiles:student_id (
        id,
        full_name,
        nim
      )
    `)
    .eq('session_id', sessionId)
    .order('scanned_at', { ascending: false });

  return {
    session,
    attendance: attendance || [],
  };
}

/**
 * Export attendance to CSV
 */
export async function exportAttendanceCSV(sessionId: string) {
  const supabase = await createClient();

  const { data: session } = await supabase
    .from('sessions')
    .select('course_name')
    .eq('id', sessionId)
    .single<{ course_name: string }>();

  const { data: attendance } = await supabase
    .from('attendance')
    .select(`
      scanned_at,
      profiles:student_id (
        full_name,
        nim
      )
    `)
    .eq('session_id', sessionId)
    .order('scanned_at', { ascending: true });

  if (!attendance) {
    return '';
  }

  // Generate CSV
  const headers = ['No', 'Nama', 'NIM', 'Waktu Scan'];
  const rows = attendance.map((record: any, index: number) => [
    index + 1,
    record.profiles?.full_name || '-',
    record.profiles?.nim || '-',
    new Date(record.scanned_at).toLocaleString('id-ID'),
  ]);

  const csv = [
    [`Laporan Kehadiran: ${session?.course_name || 'Session'}`],
    [],
    headers,
    ...rows,
  ]
    .map((row) => row.join(','))
    .join('\n');

  return csv;
}
