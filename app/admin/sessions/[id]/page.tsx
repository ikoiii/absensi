import { getSessionWithAttendance, closeSessionAction, exportAttendanceCSV } from '@/actions/session';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { QRCodeDisplay } from '@/components/shared/qr-code-display';
import { AttendanceList } from '@/components/admin/attendance-list';
import { CloseSessionButton } from '@/components/admin/close-session-button';
import { DeleteSessionButton } from '@/components/admin/delete-session-button';
import { NotFoundState } from '@/components/ui/states';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSessionWithAttendance(id);

  if (!data) {
    return (
      <NotFoundState
        title="Sesi Tidak Ditemukan"
        message="Sesi yang Anda cari tidak ditemukan. Mungkin sudah dihapus atau ID tidak valid."
        backHref="/admin/sessions"
        backLabel="Kembali ke Daftar Sesi"
      />
    );
  }

  const { session, attendance } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/sessions">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {session.course_name}
            </h1>
            <p className="text-muted-foreground">
              Dibuat: {new Date(session.created_at).toLocaleString('id-ID')}
            </p>
          </div>
          <Badge variant={session.is_active ? 'default' : 'secondary'}>
            {session.is_active ? 'Aktif' : 'Ditutup'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>
              Tampilkan QR code ini untuk mahasiswa scan
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <QRCodeDisplay
              value={session.id}
              title={session.course_name}
              size={300}
              showDownload={true}
            />
            {session.is_active && (
              <p className="text-sm text-muted-foreground text-center">
                Mahasiswa dapat scan QR ini untuk absen
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi</CardTitle>
            <CardDescription>
              Kelola sesi absensi ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {session.is_active ? (
              <CloseSessionButton
                sessionId={session.id}
                sessionName={session.course_name}
              />
            ) : (
              <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                Sesi telah ditutup. Mahasiswa tidak dapat lagi melakukan absen.
              </div>
            )}

            <Button variant="outline" className="w-full" asChild>
              <Link href={`/admin/sessions/${session.id}/export`}>
                <Download className="mr-2 h-4 w-4" />
                Export ke CSV
              </Link>
            </Button>

            {/* Delete button - only show for closed sessions */}
            {!session.is_active && (
              <DeleteSessionButton
                sessionId={session.id}
                sessionName={session.course_name}
              />
            )}

            <div className="pt-4 space-y-2 text-sm text-muted-foreground">
              <p>📊 Total Kehadiran: {attendance.length} mahasiswa</p>
              <p>🆔 Session ID: {session.id.slice(0, 8)}...</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kehadiran</CardTitle>
          <CardDescription>
            Real-time attendance updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceList
            sessionId={session.id}
            initialAttendance={attendance as any}
          />
        </CardContent>
      </Card>
    </div>
  );
}
