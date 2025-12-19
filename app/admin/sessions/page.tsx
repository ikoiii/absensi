import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Plus, Eye } from 'lucide-react';

export default async function SessionsPage() {
  const supabase = await createClient();

  // Get all sessions with attendance count
  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      id,
      course_name,
      created_at,
      is_active,
      attendance (count)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Sesi</h1>
          <p className="text-muted-foreground">
            Kelola sesi absensi untuk mata kuliah
          </p>
        </div>
        <Link href="/admin/sessions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Sesi Baru
          </Button>
        </Link>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Sesi</CardTitle>
          <CardDescription>
            Semua sesi absensi yang telah dibuat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions && sessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kehadiran</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session: any) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.course_name}
                    </TableCell>
                    <TableCell>
                      {new Date(session.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={session.is_active ? 'default' : 'secondary'}
                      >
                        {session.is_active ? 'Aktif' : 'Ditutup'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {session.attendance?.[0]?.count || 0} mahasiswa
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/sessions/${session.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Detail
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Belum ada sesi dibuat
              </p>
              <Link href="/admin/sessions/new">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Sesi Pertama
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
