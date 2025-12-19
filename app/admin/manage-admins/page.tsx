import { getAllAdmins } from '@/actions/admin';
import { requireRole } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateAdminForm } from '@/components/admin/create-admin-form';
import { AdminList } from '@/components/admin/admin-list';
import { UserPlus } from 'lucide-react';

export default async function ManageAdminsPage() {
  await requireRole('admin');
  
  const admins = await getAllAdmins();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kelola Admin</h1>
        <p className="text-muted-foreground">
          Buat dan kelola akun admin/dosen
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Admin Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Buat Admin Baru
            </CardTitle>
            <CardDescription>
              Tambahkan admin atau dosen baru ke sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateAdminForm />
          </CardContent>
        </Card>

        {/* Admin List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Admin ({admins.length})</CardTitle>
            <CardDescription>
              Admin dan dosen yang terdaftar di sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminList admins={admins} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
