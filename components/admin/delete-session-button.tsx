'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteSessionAction } from '@/actions/session';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface DeleteSessionButtonProps {
  sessionId: string;
  sessionName: string;
}

export function DeleteSessionButton({ sessionId, sessionName }: DeleteSessionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleDeleteSession() {
    setIsLoading(true);
    try {
      const result = await deleteSessionAction(sessionId);

      // Check for NEXT_REDIRECT (expected on success)
      if (result && result.success) {
        toast({
          title: 'Sesi Dihapus',
          description: 'Sesi berhasil dihapus beserta semua data kehadiran.',
        });
        // Action will redirect automatically
      } else if (result && !result.success) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      // Check if error is from Next.js redirect (expected behavior)
      if (error?.message?.includes('NEXT_REDIRECT')) {
        // This is expected, do nothing
        return;
      }
      
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat menghapus sesi',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full"
          disabled={isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus Sesi
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Hapus Sesi</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Anda yakin ingin menghapus sesi "{sessionName}"?
            </p>
            <p className="font-semibold text-destructive">
              ⚠️ PERINGATAN: Tindakan ini akan menghapus SEMUA data kehadiran untuk sesi ini dan TIDAK DAPAT dibatalkan.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteSession}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Menghapus...' : 'Ya, Hapus Permanent'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
