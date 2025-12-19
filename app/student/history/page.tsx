import { Suspense } from 'react';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { AttendanceListSkeleton } from '@/components/ui/skeletons';
import { EmptyState } from '@/components/ui/states';

async function AttendanceHistory() {
  const { user } = await requireRole('student');
  const supabase = await createClient();

  const { data: attendance, error } = await supabase
    .from('attendance')
    .select(`
      id,
      created_at,
      sessions (
        id,
        course_name,
        created_at
      )
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
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

  return (
    <div className="space-y-4">
      {attendance.map((record: any) => (
        <Card key={record.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  {record.sessions?.course_name || 'Unknown Course'}
                </CardTitle>
              </div>
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Hadir
              </Badge>
            </div>
            <CardDescription>
              {new Date(record.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Waktu absen:{' '}
              {new Date(record.created_at).toLocaleTimeString('id-ID')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
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
