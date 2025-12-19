import { createClient } from '@/lib/supabase/server';
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
import { Users } from 'lucide-react';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const searchQuery = params.search || '';

  // Get all students with attendance count
  let query = supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      nim,
      created_at,
      attendance(count)
    `)
    .eq('role', 'student')
    .order('full_name');

  // Apply search filter if provided
  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,nim.ilike.%${searchQuery}%`);
  }

  const { data: students } = await query;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Mahasiswa</h1>
        <p className="text-muted-foreground">
          Daftar mahasiswa yang terdaftar dalam sistem
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Cari Mahasiswa</CardTitle>
          <CardDescription>
            Cari berdasarkan nama atau NIM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/admin/students" method="get" className="flex gap-2">
            <input
              type="text"
              name="search"
              placeholder="Masukkan nama atau NIM..."
              defaultValue={searchQuery}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Cari
            </button>
            {searchQuery && (
              <a
                href="/admin/students"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Reset
              </a>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Mahasiswa</CardTitle>
              <CardDescription>
                {students?.length || 0} mahasiswa terdaftar
                {searchQuery && ` (hasil pencarian: "${searchQuery}")`}
              </CardDescription>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {students && students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Total Kehadiran</TableHead>
                  <TableHead>Terdaftar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student: any, index: number) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {student.full_name}
                    </TableCell>
                    <TableCell>{student.nim || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {student.attendance?.[0]?.count || 0} sesi
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(student.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                {searchQuery
                  ? `Tidak ada mahasiswa dengan "${searchQuery}"`
                  : 'Belum ada mahasiswa terdaftar'}
              </p>
              {!searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Mahasiswa dapat mendaftar melalui halaman register
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Mahasiswa dapat mendaftar sendiri melalui halaman register</p>
          <p>• Data mahasiswa dapat dikelola melalui Supabase Dashboard</p>
          <p>• Total kehadiran dihitung dari jumlah sesi yang diikuti</p>
        </CardContent>
      </Card>
    </div>
  );
}
