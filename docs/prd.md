PRD: Sistem Absensi Mahasiswa Berbasis QR Code

1. Ringkasan Proyek

Membangun aplikasi web sederhana untuk mencatat kehadiran mahasiswa di kelas menggunakan pemindaian QR Code. Admin (Dosen/Staf) membuat sesi absensi, dan Mahasiswa melakukan pemindaian melalui perangkat mereka sendiri.

Stack Teknologi:

    Framework: Next.js (App Router)

    Styling: Tailwind CSS + shadcn/ui

    Backend/Database: Supabase (PostgreSQL, Auth, Realtime)

    Library Utama: qrcode.react (untuk generate), html5-qrcode (untuk scanning)

2.  Peran Pengguna (User Roles)

    Admin: Memiliki otoritas penuh untuk membuat sesi kelas, melihat rekapitulasi, dan mengelola data mahasiswa.

    Mahasiswa: Melakukan absensi dengan memindai QR Code dan melihat riwayat absensi pribadi.

3.  Fitur Utama
    A. Fitur Admin

        Dashboard Admin: Ringkasan statistik (jumlah mahasiswa hadir hari ini, sesi aktif).

        Manajemen Sesi: Membuat sesi absensi baru (Nama Mata Kuliah, Tanggal, Jam Mulai/Selesai).

        Generate QR Code: Menghasilkan QR Code unik untuk setiap sesi yang dibuat.

        Laporan Absensi: Melihat daftar mahasiswa yang hadir pada sesi tertentu secara real-time.

        Manajemen Mahasiswa: Menambah atau menghapus data mahasiswa.

B. Fitur Mahasiswa

    Scanner QR: Fitur untuk membuka kamera dan memindai QR Code yang ditampilkan Admin.

    Log Kehadiran: Melihat daftar kehadiran mereka sendiri (Mata Kuliah, Waktu Scan, Status).

    Validasi Lokasi (Optional): Memastikan mahasiswa berada di radius tertentu saat scan (jika diperlukan).

4. Alur Kerja Sistem (User Flow)

   Login: Pengguna login menggunakan email/password (Supabase Auth). Sistem mendeteksi role (admin atau student).

   Pembuatan Sesi (Admin): Admin input data mata kuliah -> Sistem generate session_id unik -> Tampil QR Code di layar.

   Presensi (Mahasiswa): Mahasiswa membuka menu "Scan" -> Arahkan kamera ke QR Code Admin.

   Validasi: Sistem mencocokkan session_id dari QR dengan database dan mencatat user_id mahasiswa ke tabel attendance.

   Update Real-time: Dashboard Admin langsung menampilkan nama mahasiswa yang baru saja masuk.

5. Skema Database (Supabase)
   Tabel profiles
   Kolom Tipe Keterangan
   id uuid (PK) Relasi ke auth.users
   full_name text Nama Lengkap
   nim text Nomor Induk Mahasiswa
   role text 'admin' atau 'student'
   Tabel sessions (Dibuat Admin)
   Kolom Tipe Keterangan
   id uuid (PK) ID Sesi unik
   course_name text Nama Mata Kuliah
   created_at timestamp Waktu pembuatan
   is_active boolean Status sesi (aktif/ditutup)
   Tabel attendance
   Kolom Tipe Keterangan
   id uuid (PK) ID unik
   session_id uuid (FK) Relasi ke tabel sessions
   student_id uuid (FK) Relasi ke profiles.id
   scanned_at timestamp Waktu scan dilakukan
6. Persyaratan Non-Fungsional

   Keamanan: Mahasiswa tidak bisa melakukan scan jika sesi sudah ditutup (is_active: false).

   Responsivitas: Tampilan harus mobile-first karena mahasiswa akan menggunakan HP untuk scanning.

   UI/UX: Menggunakan komponen shadcn/ui (seperti Card, Button, Toast untuk notifikasi sukses scan).

7. Rencana Implementasi Tahapan

   Setup: Inisialisasi Next.js, Tailwind, dan integrasi Supabase.

   Database: Membuat tabel dan RLS (Row Level Security) di Supabase.

   Auth: Membuat halaman Login dan Register menggunakan Supabase Auth.

   Admin Page: Membuat form input sesi dan tampilan QR Code.

   Student Page: Implementasi library scanner kamera.

   Reporting: Membuat tabel rekapitulasi untuk Admin.
