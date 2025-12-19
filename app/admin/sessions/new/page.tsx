'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSessionSchema, type CreateSessionFormData } from '@/lib/validations';
import { createSessionAction } from '@/actions/session';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateSessionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      course_name: '',
    },
  });

  async function onSubmit(data: CreateSessionFormData) {
    setIsLoading(true);
    try {
      const result = await createSessionAction(data);

      // Only show error if there's actually an error
      // redirect() will throw NEXT_REDIRECT which is expected
      if (result && !result.success) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        setIsLoading(false);
      }
      // If successful, server action will redirect (no need to handle)
    } catch (error: any) {
      // Check if error is from Next.js redirect (expected behavior)
      if (error?.message?.includes('NEXT_REDIRECT')) {
        // This is expected, do nothing
        return;
      }
      
      // Only show toast for actual errors
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Buat Sesi Baru</h1>
        <p className="text-muted-foreground">
          Buat sesi absensi baru untuk mata kuliah
        </p>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi Sesi</CardTitle>
          <CardDescription>
            Masukkan informasi untuk sesi absensi baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="course_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Mata Kuliah</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Struktur Data dan Algoritma"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Nama mata kuliah atau kegiatan untuk sesi ini
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Link href="/admin/sessions" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    Batal
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Membuat...' : 'Buat Sesi'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Sesi akan dibuat dengan status aktif</p>
          <p>• QR code akan di-generate otomatis</p>
          <p>• Mahasiswa dapat langsung melakukan scan setelah sesi dibuat</p>
          <p>• Anda dapat menutup sesi kapan saja dari halaman detail</p>
        </CardContent>
      </Card>
    </div>
  );
}
