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
import { XCircle } from 'lucide-react';
import { closeSessionAction } from '@/actions/session';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface CloseSessionButtonProps {
  sessionId: string;
  sessionName: string;
}

export function CloseSessionButton({ sessionId, sessionName }: CloseSessionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleCloseSession() {
    setIsLoading(true);
    try {
      const result = await closeSessionAction(sessionId);

      if (result && result.success) {
        toast({
          title: 'Sesi Ditutup',
          description: 'Sesi berhasil ditutup. Mahasiswa tidak dapat lagi melakukan absen.',
        });
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: result?.error || 'Gagal menutup sesi',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan',
        variant: 'destructive',
      });
    } finally {
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
          <XCircle className="mr-2 h-4 w-4" />
          Tutup Sesi
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Tutup Sesi</AlertDialogTitle>
          <AlertDialogDescription>
            Anda yakin ingin menutup sesi "{sessionName}"?
            <br />
            <br />
            Setelah ditutup, mahasiswa tidak akan bisa melakukan absen lagi untuk sesi ini.
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCloseSession}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Menutup...' : 'Ya, Tutup Sesi'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
