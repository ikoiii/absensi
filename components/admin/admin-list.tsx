'use client';

import { useState } from 'react';
import { deleteAdminAction } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Shield } from 'lucide-react';

interface AdminListProps {
  admins: Array<{
    id: string;
    full_name: string;
    email: string;
    created_at: string;
  }>;
}

export function AdminList({ admins }: AdminListProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(adminId: string, adminName: string) {
    setDeletingId(adminId);
    try {
      const result = await deleteAdminAction(adminId);

      if (result.success) {
        toast({
          title: 'Berhasil',
          description: result.message,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat menghapus admin',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (admins.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada admin terdaftar
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {admins.map((admin) => (
        <div
          key={admin.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{admin.full_name}</p>
              <p className="text-sm text-muted-foreground">{admin.email}</p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={deletingId === admin.id}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Admin</AlertDialogTitle>
                <AlertDialogDescription>
                  Yakin ingin menghapus admin <strong>{admin.full_name}</strong>?
                  <br />
                  <span className="text-destructive">
                    Akun tidak akan bisa login lagi.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(admin.id, admin.full_name)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
