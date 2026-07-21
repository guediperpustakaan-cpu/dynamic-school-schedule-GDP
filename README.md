# KelasKu - Aplikasi Jadwal Pelajaran

Aplikasi web interaktif untuk mengatur, melacak, dan mencetak jadwal pelajaran siswa. Dibangun dengan React, TypeScript, Tailwind CSS, dan Motion. Tampilan disesuaikan untuk anak-anak SD dan SMP dengan font cerah, warna menarik, dan teks dalam Bahasa Indonesia.

## Fitur

- **Profil Pengguna**: Nama pengguna dan kelas bisa diubah dan disimpan otomatis.
- **Profil Sekolah**: Nama sekolah dan logo sekolah bisa disetel dari menu Pengaturan.
- **Jadwal Pelajaran**: Tambah, edit, hapus, dan cari pelajaran. Pilih hari dan minggu dengan navigasi yang mudah.
- **Tugas Sekolah**: Kelola tugas dengan status (Belum / Sedang / Selesai), prioritas, dan deadline.
- **Catatan Nilai**: Tambah dan pantau nilai, lihat rata-rata dan nilai tertinggi.
- **Beranda**: Ringkasan hari ini, jadwal hari ini, tugas mendesak, dan slide **faidah/nasehat belajar** yang berganti otomatis.
- **Cetak Jadwal**: Tema cetak A4 siap pakai.
- **Widget Donasi**: Traktir kopi dengan QRIS dan link Trakteer.
- **Tampilan Ramah Anak**: Font Quicksand + Fredoka One, warna cerah, kartu besar, tombol mudah ditekan.

## Teknologi

- React 19 + TypeScript
- Tailwind CSS 4
- Motion (Framer Motion)
- Vite
- Lucide React (ikon)
- Google Fonts: Quicksand, Nunito, Fredoka One

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

## Build untuk Produksi

```bash
npm run build
```

## Konfigurasi Donasi QRIS

Widget donasi terletak di pojok kanan bawah layar. Untuk mengaktifkan QRIS resmi:

1. Buka file `src/App.tsx`
2. Cari konstanta `QRIS_IMAGE_URL`
3. Ganti nilai string kosong dengan URL gambar QRIS resmi Trakteer Anda

```ts
const QRIS_IMAGE_URL = "https://domain-anda.com/qris.png";
```

Nominal donasi yang tersedia dimulai dari Rp6.000 dan kelipatannya. Pengguna juga bisa memasukkan nominal lain melalui kolom kustom.

## Trakteer

Dukung pengembangan aplikasi ini melalui Trakteer:

https://trakteer.id/perpus_opera/

## Download Source Code

Salin seluruh folder proyek ini, atau gunakan Git:

```bash
git clone https://github.com/username/repository.git
```

Jika repositori tidak tersedia, Anda juga dapat menyalin folder proyek secara manual.

## Kontribusi

Silakan buat issue atau pull request jika ingin berkontribusi.

## Lisensi

Open Source oleh MZF - 2026
