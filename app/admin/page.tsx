import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/admin/stat-card';
import { Users, ClipboardCheck, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animated/fade-in';
import { StaggerChildren } from '@/components/animated/stagger-container';
import { slideUp } from '@/lib/animations';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get today's attendance count
  const today = new Date().toISOString().split('T')[0];
  const { count: todayAttendance } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .gte('scanned_at', `${today}T00:00:00`)
    .lte('scanned_at', `${today}T23:59:59`);

  // Get active sessions count
  const { count: activeSessions } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Get total students
  const { count: totalStudents } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student');

  // Get recent sessions
  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('id, course_name, created_at, is_active')
    .order('created_at', { ascending: false })
    .limit(5)
    .returns<Array<{
      id: string;
      course_name: string;
      created_at: string;
      is_active: boolean;
    }>>();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Ringkasan sistem absensi mahasiswa
        </p>
      </div>

      {/* Statistics Cards */}
      <StaggerChildren fast className="grid gap-4 md:grid-cols-3">
        <FadeIn type="slideUp">
          <StatCard
            title="Kehadiran Hari Ini"
            value={todayAttendance || 0}
            icon={ClipboardCheck}
            description="Total mahasiswa hadir hari ini"
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
        <FadeIn type="slideUp">
          <StatCard
            title="Total Mahasiswa"
            value={totalStudents || 0}
            icon={Users}
            description="Mahasiswa terdaftar"
          />
        </FadeIn>
      </StaggerChildren>

      {/* Recent Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sesi Terbaru</CardTitle>
          <Link href="/admin/sessions">
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentSessions && recentSessions.length > 0 ? (
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{session.course_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={session.is_active ? 'default' : 'secondary'}>
                      {session.is_active ? 'Aktif' : 'Ditutup'}
                    </Badge>
                    <Link href={`/admin/sessions/${session.id}`}>
                      <Button variant="ghost" size="sm">
                        Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Belum ada sesi dibuat
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
