import { Suspense } from 'react';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { AttendanceListSkeleton } from '@/components/ui/skeletons';
import { EmptyState } from '@/components/ui/states';
import { AnimatedAttendanceList } from '@/components/student/animated-attendance-list';

async function AttendanceHistory() {
  const { user } = await requireRole('student');
  const supabase = await createClient();

  const { data: attendance, error } = await supabase
    .from('attendance')
    .select(`
      id,
      scanned_at,
      sessions (
        id,
        course_name,
        created_at
      )
    `)
    .eq('student_id', user.id)
    .order('scanned_at', { ascending: false });

  if (error) {
    console.error('Error loading attendance:', error);
    throw new Error('Failed to load attendance history');
  }

  if (!attendance || attendance.length === 0) {
    return (
      <EmptyState
        title="Belum Ada Riwayat Absensi"
        description="Anda belum pernah melakukan absensi. Scan QR code pada sesi yang dibuat oleh dosen untuk mulai absen."
        action={{
          label: 'Scan QR Code',
          href: '/student/scan'
        }}
      />
    );
  }

  return <AnimatedAttendanceList attendance={attendance} />;
}

export default async function StudentHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Riwayat Absensi</h1>
        <p className="text-muted-foreground">
          Daftar semua absensi yang pernah Anda lakukan
        </p>
      </div>

      <Suspense fallback={<AttendanceListSkeleton count={5} />}>
        <AttendanceHistory />
      </Suspense>
    </div>
  );
}
