'use client';

import { useState } from 'react';
import { QRScanner } from '@/components/shared/qr-scanner';
import { scanAttendanceAction } from '@/actions/attendance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, QrCode as QrCodeIcon, Keyboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  async function handleScanSuccess(decodedText: string) {
    if (isProcessing) return; // Prevent multiple scans

    setIsProcessing(true);
    setIsScanning(false);

    try {
      // decodedText should be the session ID
      const result = await scanAttendanceAction(decodedText);

      if (result.success) {
        toast({
          title: 'Berhasil!',
          description: result.message,
          variant: 'default',
        });
        
        // Redirect to dashboard after successful scan
        setTimeout(() => {
          router.push('/student');
        }, 1500);
      } else {
        toast({
          title: 'Gagal',
          description: result.error,
          variant: 'destructive',
        });
        setIsProcessing(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat memproses absensi',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  }

  function handleScanError(error: string) {
    console.error('QR Scan error:', error);
    // Don't show error toast for every scan error, only on critical errors
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionId.trim()) {
      toast({
        title: 'Error',
        description: 'Masukkan Session ID',
        variant: 'destructive',
      });
      return;
    }
    await handleScanSuccess(sessionId.trim());
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Scan QR Code</h1>
        <p className="text-muted-foreground">
          Arahkan kamera ke QR code untuk absen
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={!manualMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setManualMode(false);
            setIsScanning(false);
          }}
        >
          <QrCodeIcon className="mr-2 h-4 w-4" />
          Scan QR
        </Button>
        <Button
          variant={manualMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setManualMode(true);
            setIsScanning(false);
          }}
        >
          <Keyboard className="mr-2 h-4 w-4" />
          Input Manual
        </Button>
      </div>

      {/* Scanner Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {manualMode ? <Keyboard className="h-5 w-5" /> : <QrCodeIcon className="h-5 w-5" />}
            {manualMode ? 'Input Session ID' : 'QR Code Scanner'}
          </CardTitle>
          <CardDescription>
            {manualMode 
              ? 'Masukkan Session ID secara manual (untuk testing)'
              : isScanning
              ? 'Scan QR code yang ditampilkan oleh dosen'
              : 'Klik tombol di bawah untuk mulai scan'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {manualMode ? (
            // Manual Input Mode
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Input
                placeholder="Paste Session ID here..."
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                disabled={isProcessing}
                className="font-mono text-sm"
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isProcessing || !sessionId.trim()}
              >
                {isProcessing ? 'Memproses...' : 'Submit Absen'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                💡 Tip: Salin Session ID dari URL detail sesi (admin panel)
              </p>
            </form>
          ) : (
            // QR Scanner Mode
            isScanning ? (
              <div className="space-y-4">
                <QRScanner
                  onScanSuccess={handleScanSuccess}
                  onScanError={handleScanError}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsScanning(false)}
                  disabled={isProcessing}
                >
                  Batal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                  <div className="text-center">
                    <QrCodeIcon className="mx-auto h-16 w-16 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Kamera akan aktif setelah Anda klik tombol di bawah
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setIsScanning(true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Memproses...' : 'Mulai Scan'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  ⚠️ Camera error? Gunakan mode "Input Manual" di atas
                </p>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Petunjuk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {manualMode ? (
            <>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Cara mendapatkan Session ID:</p>
                  <p className="text-muted-foreground">
                    1. Buka admin panel → Sessions → Detail sesi
                    <br />
                    2. Salin Session ID dari URL atau info sesi
                    <br />
                    3. Paste di form di atas
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Pastikan QR code terlihat jelas</p>
                  <p className="text-muted-foreground">
                    Posisikan kamera agar QR code berada di tengah frame
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Sesi harus aktif</p>
                  <p className="text-muted-foreground">
                    Anda hanya bisa absen pada sesi yang masih aktif
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium">Tidak bisa absen dua kali</p>
                  <p className="text-muted-foreground">
                    Setiap mahasiswa hanya bisa absen sekali per sesi
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
