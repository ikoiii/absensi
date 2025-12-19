'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth';

/**
 * Server Actions for Student Attendance
 */

/**
 * Scan attendance - Student scans QR code to mark attendance
 */
export async function scanAttendanceAction(sessionId: string) {
  const { user } = await requireRole('student');
  const supabase = await createClient();

  // Check if session exists and is active
  const { data: session } = await supabase
    .from('sessions')
    .select('id, is_active, course_name')
    .eq('id', sessionId)
    .single<{
      id: string;
      is_active: boolean;
      course_name: string;
    }>();

  if (!session) {
    return {
      success: false,
      error: 'Sesi tidak ditemukan',
    };
  }

  if (!session.is_active) {
    return {
      success: false,
      error: 'Sesi sudah ditutup',
    };
  }

  // Check for duplicate scan
  const { data: existingAttendance } = await supabase
    .from('attendance')
    .select('id')
    .eq('session_id', sessionId)
    .eq('student_id', user.id)
    .single();

  if (existingAttendance) {
    return {
      success: false,
      error: 'Anda sudah absen untuk sesi ini',
    };
  }

  // Insert attendance record
  const { error: insertError } = await supabase
    .from('attendance')
    // @ts-ignore - Supabase type inference limitation
    .insert({
      session_id: sessionId,
      student_id: user.id,
    });

  if (insertError) {
    return {
      success: false,
      error: 'Gagal menyimpan absensi',
    };
  }

  revalidatePath('/student/history');
  revalidatePath('/student');

  return {
    success: true,
    message: `Absensi berhasil untuk ${session.course_name}`,
  };
}

/**
 * Get student's attendance history
 */
export async function getStudentAttendance() {
  const { user } = await requireRole('student');
  const supabase = await createClient();

  const { data: attendance } = await supabase
    .from('attendance')
    .select(`
      id,
      scanned_at,
      sessions:session_id (
        id,
        course_name,
        created_at
      )
    `)
    .eq('student_id', user.id)
    .order('scanned_at', { ascending: false });

  return attendance || [];
}
