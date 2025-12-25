# Hayu Ka Leuweung (Forest Experience)

Sebuah halaman landing interaktif berbasis 3D yang menampilkan lingkungan hutan (low-poly style). Proyek ini dirancang agar ringan dan berjalan langsung di browser modern menggunakan teknologi web standar.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan pendekatan "Vanilla" (murni) tanpa framework frontend besar (seperti React/Vue) atau bundler kompleks (seperti Webpack/Vite) di struktur utamanya.

### Library Utama
- **Three.js (r128)**: Library inti untuk rendering grafik 3D, manajemen scene, pencahayaan, dan kamera.
  - Dimuat langsung via CDN (Content Delivery Network).
  - Menggunakan modul tambahan: `FontLoader` dan `TextGeometry` untuk teks 3D.

### Bahasa & Standar
- **JavaScript (ES6+ Modules)**: Logika aplikasi dibangun menggunakan ES Modules native (`import`/`export`) untuk modularitas kode tanpa proses build/transpile.
- **HTML5**: Struktur dasar halaman dan kontainer canvas.
- **CSS3**: Styling untuk antarmuka pengguna (UI) seperti loading screen, menu, dan overlay (HUD).

### Alat Pengembangan (Development Tools)
- **npx serve**: Digunakan sebagai web server lokal statis untuk menjalankan proyek saat pengembangan (menghindari kebijakan CORS browser saat memuat modul/tekstur).

## 📂 Struktur Proyek
- **`js/`**: Berisi seluruh logika kode (Scene, Objects, Effects, Utils).
- **`styles/`**: File CSS untuk tampilan antarmuka.
- **`index.html`**: Entry point aplikasi.

## 🚀 Cara Menjalankan

Karena proyek ini menggunakan ES Modules, file html tidak bisa dibuka langsung (double click). Harus dijalankan melalui server lokal.

1. Pastikan **Node.js** sudah terinstall (hanya untuk menjalankan server lokal).
2. Buka terminal/cmd di folder proyek.
3. Jalankan perintah:
   ```bash
   npx serve .
   ```
4. Buka browser di alamat yang muncul (biasanya `http://localhost:3000`).

oh iya, ini bikin make nya Antigravity