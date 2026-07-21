# KelasKu - Jadwal Pelajaran

Aplikasi web untuk mengatur dan mencetak jadwal pelajaran siswa. Dibangun dengan React, TypeScript, Tailwind CSS, dan Motion.

## Fitur

- Manajemen jadwal pelajaran harian
- Pencarian pelajaran
- Edit dan hapus pelajaran
- Cetak jadwal mingguan
- Tema cetak A4
- Widget donasi traktir kopi (QRIS) di dalam aplikasi
- Antarmuka responsif untuk mobile dan desktop
- Semua teks dan instruksi dalam Bahasa Indonesia

## Teknologi

- React 19 + TypeScript
- Tailwind CSS 4
- Motion (Framer Motion)
- Vite
- Lucide React (ikon)

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

Untuk mengunduh source code lengkap, jalankan perintah berikut:

```bash
git clone https://github.com/username/repository.git
```

Atau klik tautan di repositori GitHub/GitLab Anda.

## Kontribusi

Silakan buat issue atau pull request jika ingin berkontribusi.

## Lisensi

Open Source oleh MZF - 2026
