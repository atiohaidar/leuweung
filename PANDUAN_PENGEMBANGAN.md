# Panduan Pengembangan dan Pemeliharaan (Developer Manual) - Forest Experience

Dokumen ini dibuat untuk membantu programmer baru atau pengguna awam dalam memahami, mengedit, dan memelihara proyek **Forest Experience**.

---

## 📂 1. Struktur Folder

Memahami di mana file berada adalah kunci utama. Berikut adalah peta sederhana proyek ini:

- **`index.html`**: Halaman utama website.
- **`styles/`**: Folder berisi kode tampilan (CSS).
  - `main.css`: File utama, menghubungkan semua file layout lainnya.
  - `components/`: Gaya untuk komponen khusus (misal: `info-modal.css`).
- **`js/`**: Folder kode logika (JavaScript).
  - **`config/`** ⭐ **(PENTING)**: Pusat pengaturan. Hampir semua yang ingin Anda ubah ada di sini tanpa perlu menyentuh kode rumit.
  - `scene/`: Pengaturan kamera, rendering, dan scene 3D.
  - `objects/`: Definisi objek 3D (Pohon, Rusa, dll).
  - `effects/`: Fitur visual (Partikel, Interaksi Klik, dll).
  - `ui/`: Pengaturan tampilan antarmuka (Tombol, Modal, Loading).
  - `main.js`: Otak utama yang menghubungkan semuanya.

---

## 🛠️ 2. Cara Mengedit (Untuk Pemula)

Bagian ini menjelaskan cara mengubah hal-hal umum tanpa merusak kode program.

### A. Mengaktifkan/Mematikan Efek (Contoh: Magic Particles)

Ingin mematikan efek partikel yang mengikuti mouse?
1. Buka file: **`js/config/effects.js`**
2. Cari bagian `magicParticles`.
3. Ubah `enabled: true` menjadi `enabled: false`.

```javascript
// js/config/effects.js
magicParticles: {
    enabled: false, // Ubah ke true untuk menyalakan kembali
    maxParticles: 50,
    ...
}
```

### B. Mengubah Info Hewan/Objek

Ingin mengubah nama hewan, fakta unik, atau emoji saat diklik?
1. Buka file: **`js/config/objects.js`**
2. Cari bagian `clickableObjects` di bagian bawah file.
3. Anda bisa mengubah `emoji`, `name`, `description`, atau `facts`.

```javascript
// js/config/objects.js
deer: {
    id: 'deer',
    ...
    info: {
        emoji: '🦌', // Ganti emoji
        name: 'Rusa Hutan', // Ganti nama
        description: 'Teks deskripsi baru di sini...', // Ganti deskripsi
        facts: [
            'Fakta baru 1',
            'Fakta baru 2'
        ],
        ...
    }
}
```

### C. Mengatur Jumlah Pohon atau Objek Lain

Ingin hutan yang lebih lebat atau lebih sedikit pohon?
1. Buka file: **`js/config/objects.js`**
2. Cari bagian `trees`.
3. Ubah angka pada `count`.

```javascript
// js/config/objects.js
trees: {
    count: 150, // Ubah angka ini (misal: 100 untuk lebih ringan)
    spread: 50,
    ...
}
```

**⚠️ Peringatan:** Menambah jumlah terlalu banyak dapat membuat website menjadi lambat (lag).

### D. Mengatur Kecepatan Auto Scroll

Ingin scroll otomatis berjalan lebih cepat atau lebih lambat?
1. Buka file: **`js/config/effects.js`**
2. Cari bagian `autoScroll`.
3. Ubah nilai `fastSpeed` (kecepatan normal) atau `slowSpeed` (kecepatan saat mendekati area penting).

```javascript
// js/config/effects.js
autoScroll: {
    fastSpeed: 1.5, // Semakin besar angka, semakin cepat
    slowSpeed: 0.5, // Kecepatan lambat
    ...
}
```

### E. Mengatur Jarak Perjalanan Kamera (Scroll Distance)

Ingin kamera berjalan lebih jauh atau lebih pendek saat discroll?
1. Buka file: **`js/config/scene.js`**
2. Cari bagian `camera`.
3. Ubah nilai `maxScrollZ`.

```javascript
// js/config/scene.js
camera: {
    initialPosition: { x: 0, y: 2, z: 10 }, // Posisi awal
    maxScrollZ: 180, // SEMAKIN BESAR = Semakin jauh kamera "berjalan" ke dalam hutan
    ...
}
```

---

## 🎨 3. Kustomisasi Tampilan

### Mengubah Warna Tema / Background

Pengaturan warna untuk scene 3D ada di **`js/config/scene.js`**.

```javascript
// js/config/scene.js
scene: {
    fogColor: 0x050510, // Warna kabut/latar (Format Hex 0x...)
    clearColor: 0x050510,
    ...
}
```

Pengaturan gaya UI (seperti warna modal, tombol) ada di folder **`styles/`**.

---

## 💻 4. Untuk Programmer (Maintenance Guide)

### Perbaikan Bug Kamera (Studi Kasus)
Jika ada masalah pada kamera (misal: transisi kasar), cek dua file ini:
1. **`js/scene/SceneManager.js`**: `getScrollCameraPosition()` menentukan target posisi kamera berdasarkan scroll.
2. **`js/scene/CameraController.js`**: Menangani animasi transisi (`updateBlendBack` dan `updateZoomAnimation`).
*Pastikan logika di kedua file tersebut sinkron.*

### Menambah Objek Baru agar Bisa Diklik
1. Buat/Load objek 3D di folder `js/objects/`.
2. Pastikan objek tersebut memiliki `userData.type` atau properti identitas unik.
3. Daftarkan objek tersebut di **`js/config/objects.js`** pada bagian `clickableObjects` dengan properti `info` (untuk modal) dan `camera` (untuk zoom).
4. Di **`js/main.js`**, panggil `oi.registerAnimals(objekArray, 'tipe')` di dalam method `registerClickableObjects`.

---

## 🚀 5. Cara Menjalankan Proyek

1. Pastikan Anda sudah menginstall **Node.js**.
2. Buka terminal/cmd di folder proyek.
3. Jalankan perintah:
   ```bash
   npx serve .
   ```
4. Buka browser dan akses alamat yang muncul (biasanya `http://localhost:3000`).

---

**Tips Terakhir:** Selalu backup file sebelum melakukan perubahan besar!
