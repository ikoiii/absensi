import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { StatCard } from '@/components/admin/stat-card';
import { CheckCircle, Activity, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animated/fade-in';
import { StaggerChildren } from '@/components/animated/stagger-container';

export default async function StudentDashboard() {
  const { user } = await requireRole('student');
  const supabase = await createClient();

  // Get today's attendance
  const today = new Date().toISOString().split('T')[0];
  const { count: todayAttendance } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .gte('scanned_at', `${today}T00:00:00`)
    .lte('scanned_at', `${today}T23:59:59`);

  // Get total attendance count
  const { count: totalAttendance } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user.id);

  // Get active sessions count
  const { count: activeSessions } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Get recent attendance
  const { data: recentAttendance } = await supabase
    .from('attendance')
    .select(`
      id,
      scanned_at,
      sessions:session_id (
        course_name
      )
    `)
    .eq('student_id', user.id)
    .order('scanned_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di sistem absensi mahasiswa
        </p>
      </div>

      {/* Quick Action */}
      <FadeIn type="slideUp">
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Scan QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Scan QR code untuk absen
                </p>
              </div>
              <Link href="/student/scan">
                <Button size="lg">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Scan Sekarang
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Statistics Cards */}
      <StaggerChildren fast className="grid gap-4 md:grid-cols-3">
        <FadeIn type="slideUp">
          <StatCard
            title="Absen Hari Ini"
            value={todayAttendance || 0}
            icon={CheckCircle}
            description="Sesi yang sudah diabsen"
          />
        </FadeIn>
        <FadeIn type="slideUp">
          <StatCard
            title="Total Kehadiran"
            value={totalAttendance || 0}
            icon={Clock}
            description="Total sesi yang diikuti"
          />
        </FadeIn>
        <FadeIn type="slideUp">
          <StatCard
            title="Sesi Aktif"
            value={activeSessions || 0}
            icon={Activity}
            description="Sesi yang sedang berjalan"
          />
        </FadeIn>
      </StaggerChildren>

      {/* Recent Attendance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Riwayat Absensi Terbaru</CardTitle>
            <CardDescription>5 absensi terakhir Anda</CardDescription>
          </div>
          <Link href="/student/history">
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentAttendance && recentAttendance.length > 0 ? (
            <div className="space-y-4">
              {recentAttendance.map((record: any) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {record.sessions?.course_name || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.scanned_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <Badge>Hadir</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4">Belum ada riwayat absensi</p>
              <p className="text-sm mt-2">
                Scan QR code untuk mulai absen
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
