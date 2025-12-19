import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  TrendingUp,
  FileText,
  Scan,
  Clock,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Absensi QR</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="#features">Fitur</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#how-it-works">Cara Kerja</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Daftar</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="container relative z-10 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              ✨ Modern & Contactless
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Sistem Absensi
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Berbasis QR Code
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Solusi modern untuk mencatat kehadiran mahasiswa dengan cepat,
              akurat, dan real-time. Scan sekali, langsung tercatat!
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/register">
                  Mulai Sekarang
                  <span className="ml-2">→</span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/login">Login sebagai Admin</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-lg bg-white/50 p-4 backdrop-blur dark:bg-gray-800/50">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Akurasi</div>
              </div>
              <div className="rounded-lg bg-white/50 p-4 backdrop-blur dark:bg-gray-800/50">
                <div className="text-3xl font-bold text-primary">&lt;2s</div>
                <div className="text-sm text-muted-foreground">
                  Waktu Scan
                </div>
              </div>
              <div className="rounded-lg bg-white/50 p-4 backdrop-blur dark:bg-gray-800/50">
                <div className="text-3xl font-bold text-primary">Real-time</div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4">Fitur Unggulan</Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Kenapa Memilih Kami?
            </h2>
            <p className="text-lg text-muted-foreground">
              Sistem absensi yang dirancang khusus untuk kebutuhan kampus
              modern
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Scan className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>
                  Absensi cepat hanya dengan scan QR Code. Tidak perlu antri
                  atau tanda tangan manual.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>
                  Admin dapat melihat kehadiran mahasiswa secara langsung tanpa
                  delay.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Laporan Digital</CardTitle>
                <CardDescription>
                  Rekap absensi otomatis dalam bentuk digital. Export ke
                  CSV/PDF kapan saja.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Riwayat Lengkap</CardTitle>
                <CardDescription>
                  Mahasiswa dapat melihat history kehadiran mereka kapan saja,
                  di mana saja.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Aman & Terverifikasi</CardTitle>
                <CardDescription>
                  Data absensi tersimpan aman dengan enkripsi. Tidak bisa
                  dimanipulasi.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                  <QrCode className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Mobile Friendly</CardTitle>
                <CardDescription>
                  Desain responsif, optimal untuk HP. Mahasiswa scan langsung
                  dari smartphone.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-muted/50 py-20"
      >
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4">Cara Kerja</Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              3 Langkah Mudah
            </h2>
            <p className="text-lg text-muted-foreground">
              Proses absensi yang simpel dan efisien
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 text-xl font-bold">Dosen Buat Sesi</h3>
                <p className="text-muted-foreground">
                  Admin/Dosen membuat sesi absensi dan menampilkan QR Code di
                  layar proyektor
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 text-xl font-bold">Mahasiswa Scan</h3>
                <p className="text-muted-foreground">
                  Mahasiswa membuka aplikasi, scan QR Code, dan langsung
                  tercatat hadir
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 text-xl font-bold">Data Tersimpan</h3>
                <p className="text-muted-foreground">
                  Kehadiran otomatis tersimpan di database dan bisa dilihat
                  real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Siap Modernisasi Sistem Absensi?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                Bergabunglah dengan ribuan mahasiswa dan dosen yang sudah
                merasakan kemudahan absensi digital
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href="/register">Daftar Sekarang</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full border-white bg-transparent text-white hover:bg-white/10 sm:w-auto"
                >
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © 2025 Sistem Absensi QR Code. Built with Next.js & Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
}
