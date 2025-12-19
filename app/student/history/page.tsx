import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

export default async function AttendanceHistoryPage() {
  const { user } = await requireRole('student');
  const supabase = await createClient();

  // Get all attendance records
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
    .order('scanned_at', { ascending: false })
    .returns<Array<{
      id: string;
      scanned_at: string;
      sessions: {
        id: string;
        course_name: string;
        created_at: string;
      } | null;
    }>>();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Riwayat Absensi</h1>
        <p className="text-muted-foreground">
          Semua riwayat kehadiran Anda
        </p>
      </div>

      {/* Summary Card */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Kehadiran
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendance?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Sesi yang diikuti
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Absensi Terakhir
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendance && attendance.length > 0
                ? new Date(attendance[0].scanned_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {attendance && attendance.length > 0
                ? attendance[0].sessions?.course_name
                : 'Belum ada absensi'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kehadiran</CardTitle>
          <CardDescription>
            Riwayat lengkap kehadiran Anda di semua sesi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendance && attendance.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Tanggal Sesi</TableHead>
                  <TableHead>Waktu Scan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record: any, index: number) => (
                  <TableRow key={record.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {record.sessions?.course_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {record.sessions?.created_at
                        ? new Date(record.sessions.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(record.scanned_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge>Hadir</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                Belum ada riwayat absensi
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Scan QR code untuk mulai absen
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
