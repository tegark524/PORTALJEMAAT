# Dokumentasi Sistem GKJW Jemaat Sukolilo

Aplikasi ini adalah sistem informasi gereja berbasis web (SPA - Single Page Application) yang dilengkapi dengan Portal Admin Majelis dan Sistem E-Voting.

## 🛠️ Tech Stack

- **Frontend:** Vue 3 (Composition API), Vite
- **State Management:** Pinia (`churchStore.js`)
- **Styling:** Tailwind CSS
- **Backend & Database:** Google Apps Script (GAS) & Google Sheets
- **Image Hosting:** ImgBB API (di-proxy dengan `wsrv.nl` agar tidak diblokir ISP Indonesia)
- **Authentication:** Google OAuth 2.0 (Admin) & NIK/NIJ (Jemaat Pemilih)

---

## 📂 Struktur Direktori Utama

```text
src/
├── assets/           # Gambar statis, logo, favicon
├── components/       # Komponen UI Reusable (Navbar, DoaCard, WartaList, JadwalList)
├── router/           # Konfigurasi Vue Router (index.js) dengan Navigation Guards
├── stores/           # Pinia State Management (churchStore.js)
├── views/
│   ├── public/       # Halaman Publik (HomeView, TentangView, DoaView)
│   ├── admin/        # Portal Admin (Dashboard, Warta, Jadwal, Renungan, Doa, Voting)
│   └── voting/       # Halaman Jemaat Pemilih (LoginView, DashboardView)
```

---

## 🔐 Role-Based Access Control (RBAC)

Sistem ini memiliki 4 tingkatan pengguna:

1. **Pengunjung / Jemaat Umum:**
   - Hanya bisa mengakses halaman publik (`/`, `/doa`, `/tentang`).
   - Bisa mengirim pokok doa (menunggu moderasi majelis).

2. **Jemaat Pemilih (Voter):**
   - Jemaat yang ID-nya (NIK/NIJ) terdaftar di `tb_voter`.
   - Bisa masuk ke Bilik Suara (`/voting/login`) jika Event Voting sedang aktif.
   - Sesi disimpan sementara di `localStorage.gkjw_voter_session`. Dihapus otomatis setelah mencoblos.

3. **Majelis Biasa (Admin):**
   - Login menggunakan akun Google. Email harus terdaftar di sheet `tb_admin_access`.
   - Bisa mengakses `/admin` untuk mengelola Warta, Jadwal, Renungan, dan memoderasi Tembok Doa.
   - **Tidak bisa** melihat atau mengakses modul Voting.

4. **Panitia Pemilihan / KPU (Super Admin Voting):**
   - Majelis yang emailnya secara eksplisit didaftarkan pada variabel `VITE_KPU_EMAILS` di file `.env`.
   - Mendapatkan menu tambahan di Sidebar Admin: **Konfigurasi Voting, Kelola Kandidat, Manajemen Pemilih, dan Live Count**.

---

## 🔄 Alur Data & Logika (Data Flow)

### 1. Strategi "Load Once" & "Silent Refresh"

Untuk menghemat kuota _fetch_ ke Google Apps Script dan mempercepat aplikasi, data publik (Warta, Jadwal, Renungan, Doa) dimuat **satu kali** saat aplikasi pertama kali dibuka (melalui fungsi `initializeHomeData()` di `churchStore.js`).
Jika ada operasi penambahan/pengeditan data, Pinia akan menjalankan `silentRefresh()` untuk memperbarui data di latar belakang tanpa memunculkan layar loading.

### 2. Bypass Internet Positif (Gambar)

ImgBB yang digunakan sebagai _image hosting_ sering diblokir ISP Indonesia. Data asli berupa link ImgBB tetap disimpan di Google Sheets, namun saat dirender ke komponen Vue, _store_ mencegat dan mengubah URL tersebut menggunakan _Image Proxy_ (`getProxiedImage` via `wsrv.nl`).

---

## 📦 Modul & Fitur Sistem

### A. Landing Page & Publik

- **Headline Dinamis:** Slider warta/jadwal pada `HomeView.vue`. Prioritas pada item yang memiliki status `is_headline = true`. Jika tidak ada, otomatis mengambil warta terbaru.
- **Renungan Harian:** Mengkalkulasi ketersediaan renungan (Hari ini & Besok) dan menampilkannya di _Dashboard_ admin sebagai _alert_ warna (Hijau/Kuning/Merah) serta grafik 7 Hari.
- **Tembok Doa:** Formulir doa dengan opsi "Publik" (opsional). Jika publik dan disetujui admin, akan muncul dalam desain _3D Book Flip_ (`DoaCard.vue`).

### B. Portal Admin

- **CRUD General:** Menggunakan single action di `churchStore.js` (`submitGasAction`) untuk mengurangi duplikasi kode. Menerima parameter `table`, `action` (insert/update/delete), `data`, dan `id`.
- **Moderasi Doa:** Admin dapat mengubah status permohonan doa (Belum Ditangani -> Sedang Didoakan) dan menyalakan _switch_ "On Air" untuk menampilkannya di halaman publik.

### C. Sistem E-Voting (Pemilihan Majelis)

Modul voting memiliki logika terisolasi dan _Navigation Guards_ (pengaman URL) yang ketat.

#### 1. Kontrol Event (Voting Config)

- Diatur oleh Panitia di `/admin/voting-config`.
- Toggle `is_active` akan secara _real-time_ menentukan apakah:
  - Menu "Voting Majelis" muncul di Navbar Publik.
  - Rute `/voting/login` dan `/voting/dashboard` bisa diakses (Jika nonaktif, dilempar ke Beranda).
  - Menu manajemen KPU lain di panel admin muncul.

#### 2. Manajemen Pemilih (Voter Management)

- **Bulk Import:** Admin KPU bisa _copy-paste_ langsung ratusan NIK dan Nama dari Microsoft Excel ke dalam _textarea_. Sistem menggunakan regex `\t` dan `\n` untuk mengubah teks menjadi Array 2D dan mengirimnya via API `bulk_insert`.
- **Aksi:** Mendukung edit nama, hapus satuan, hapus massal (berdasarkan _checkbox_), dan menampilkan indikator "Sudah Memilih" / "Belum Memilih".

#### 3. Kelola Kandidat (Candidate Management)

- Admin KPU menambah Nama, Visi Misi, dan Foto.
- Foto langsung di-_upload_ ke API ImgBB dan link-nya disimpan di database.

#### 4. Bilik Suara Jemaat (Digital Voting Booth)

- Jemaat masuk menggunakan NIK. Sistem memvalidasi apakah NIK terdaftar dan **belum memilih**.
- Pada halaman Dashboard, jemaat memilih kandidat, menekan tombol Konfirmasi.
- API akan mencatat `id_kandidat` ke `tb_suara` dan mengubah status pemilih menjadi `TRUE` di `tb_voter` dalam satu _request_ untuk mencegah pemilih ganda.
- Jemaat langsung di-_logout_ otomatis (sesi dibersihkan).

#### 5. Live Count Dashboard

- Mengambil data `tb_suara` dan `tb_kandidat`.
- Melakukan komputasi perolehan secara lokal di frontend (menghindari beban server GAS).
- Memiliki fitur `setInterval` untuk _auto-refresh_ setiap 10 detik.
- **Cetak PDF / Print:** Layout akan menyesuaikan diri (menyembunyikan _sidebar_ dan tombol) saat menu Print browser dibuka (via CSS `print:hidden` dan `print:block`).

---

## 🌐 Struktur Endpoint Google Apps Script (GAS)

Metode komunikasi menggunakan `axios.post` & `axios.get` dengan mode _CORS/text-plain_ agar terhindar dari pemblokiran _Preflight_ di browser.

**GET Methods (`?table=...&mode=...`):**

- `table=tb_warta&mode=public` -> Ambil Warta.
- `table=tb_jadwal_ibadah` -> Ambil jadwal >= hari ini.
- Dll (Sesuai nama tabel di Google Sheets).

**POST Actions (JSON Payload):**

- `verify_login` -> Validasi token Google OAuth untuk akses Admin.
- `verify_voter` -> Validasi ID Jemaat untuk masuk bilik suara.
- `submit_vote` -> Mencatat suara & menandai jemaat sudah memilih.
- `insert`, `update`, `delete`, `bulk_insert` -> Manipulasi tabel dinamis.
