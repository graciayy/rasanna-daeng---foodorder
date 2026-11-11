# PRD --- Rasanna Daeng

**Product Requirements Document \| Versi 1.0 \| 11 November 2026**

## 1. Ringkasan Produk

**Rasanna Daeng** adalah aplikasi pemesanan makanan berbasis web yang
responsif dan mengutamakan penggunaan melalui smartphone. Sistem
membantu pelanggan melihat menu, memesan makanan untuk makan di tempat
(dine-in) atau dibawa pulang (takeaway), membayar secara Cash atau QRIS,
serta memperoleh struk digital. Admin mengelola menu, foto makanan,
pesanan, pembayaran, promosi, dan laporan melalui dashboard.

**Asumsi versi awal:** satu restoran dan satu lokasi operasional, dengan
struktur yang tidak menghalangi pengembangan multi-cabang di masa depan.
Pengelolaan pesanan dilakukan oleh admin; tidak ada akun dapur terpisah
pada MVP.

## 2. Tujuan Produk

1.  Memungkinkan pelanggan memesan makanan langsung melalui website dari
    HP.
2.  Mempermudah admin memperbarui menu, harga, stok, dan foto tanpa
    mengubah kode.
3.  Menyatukan pesanan dine-in dan takeaway dalam satu dashboard.
4.  Mencatat pembayaran dan menyediakan struk digital yang dapat diunduh
    atau dicetak.
5.  Menyediakan fondasi yang aman, mudah diuji, dan dapat dikembangkan.

### Indikator keberhasilan MVP

-   Pelanggan dapat mendaftar, login, memilih menu, checkout, dan
    melihat status pesanan.
-   Admin dapat login, mengelola menu/foto, menerima dan memperbarui
    pesanan.
-   Total transaksi dihitung dan divalidasi di server.
-   Struk dapat dibuka dan diunduh sebagai PDF.
-   Alur utama dapat diselesaikan melalui browser smartphone.
-   Pengguna tidak dapat mengakses fungsi admin tanpa hak akses.

## 3. Ruang Lingkup

### 3.1 Termasuk dalam produk

**Customer** - Registrasi, login, logout, dan pengelolaan profil. -
Beranda, kategori, pencarian, filter, dan katalog. - Detail produk,
foto, harga, deskripsi, ketersediaan. - Keranjang, jumlah item, catatan
item, dan ringkasan. - Checkout dine-in atau takeaway. - Pembayaran Cash
atau QRIS. - Riwayat, detail, dan status pesanan. - Struk digital, PDF,
print, dan fitur berbagi melalui perangkat. - Notifikasi status di dalam
aplikasi; kanal eksternal dapat ditambahkan setelah MVP.

**Admin** - Login admin dan dashboard. - CRUD produk dan kategori. -
Upload, preview, ganti, dan hapus foto produk. - Kelola ketersediaan dan
stok. - Kelola pesanan, pembatalan/penolakan dengan alasan, dan
status. - Verifikasi QRIS manual dan pencatatan pembayaran Cash. -
Kelola pelanggan. - Kelola banner dan voucher/promosi. - Laporan dan
ekspor data. - Pengaturan restoran, jam operasional, dan nomor meja.

### 3.2 Tidak wajib untuk MVP hari ini

-   Aplikasi native Android/iOS.
-   Multi-vendor atau marketplace.
-   Pengantaran dengan kurir dan pelacakan GPS.
-   Integrasi payment gateway QRIS otomatis.
-   Program loyalty/point.
-   Rekomendasi makanan berbasis AI.
-   Multi-cabang aktif.

Fitur di luar MVP tetap dicatat sebagai pengembangan lanjutan, bukan
dihapus dari visi produk.

## 4. Aktor dan Hak Akses

  -----------------------------------------------------------------------
  Aktor                               Hak akses
  ----------------------------------- -----------------------------------
  Pengunjung                          Melihat beranda dan katalog; wajib
                                      login sebelum checkout

  Customer                            Mengelola profil, keranjang,
                                      pesanan miliknya, pembayaran, dan
                                      struk

  Admin                               Mengelola seluruh data operasional,
                                      pesanan, pembayaran, konten, dan
                                      laporan
  -----------------------------------------------------------------------

Ketentuan: - Registrasi publik selalu menghasilkan role `customer`. -
Role admin hanya dapat dibuat atau diubah melalui proses administratif
yang aman. - Customer hanya boleh membaca pesanan, pembayaran, dan struk
miliknya. - Semua endpoint admin harus memeriksa autentikasi dan
otorisasi di backend.

## 5. Alur Bisnis Utama

### 5.1 Pemesanan pelanggan

1.  Pelanggan membuka website.
2.  Pelanggan melihat katalog; login diperlukan sebelum checkout.
3.  Pelanggan memilih produk, jumlah, dan catatan.
4.  Sistem memvalidasi ketersediaan produk.
5.  Pelanggan membuka keranjang dan melanjutkan checkout.
6.  Pelanggan memilih Dine-in atau Takeaway.
7.  Untuk Dine-in, pelanggan memasukkan/memilih nomor meja. Untuk
    Takeaway, pelanggan memilih waktu pengambilan bila fitur jadwal
    diaktifkan.
8.  Pelanggan memeriksa ringkasan dan memilih Cash atau QRIS.
9.  Server menghitung ulang harga dan membuat pesanan.
10. Admin menerima pesanan dan memutuskan menerima atau menolak.
11. Admin memperbarui status selama persiapan.
12. Pesanan diserahkan/diambil dan ditandai selesai.
13. Struk digital tersedia pada detail pesanan.

### 5.2 Pembayaran

-   **Cash:** pesanan dicatat sebagai belum lunas sampai admin mencatat
    penerimaan uang. Kebijakan apakah Cash dibayar saat pesan atau saat
    mengambil/selesai harus dapat dikonfigurasi.
-   **QRIS statis pada MVP:** tampilkan gambar QRIS milik restoran dan
    instruksi pembayaran. Pelanggan mengunggah bukti pembayaran jika
    diperlukan. Admin memverifikasi secara manual.
-   Status pembayaran dan status pesanan disimpan terpisah.
-   Sistem tidak boleh menganggap QRIS lunas hanya karena pelanggan
    mengunggah gambar bukti.
-   Integrasi QRIS dinamis/payment gateway merupakan pengembangan
    lanjutan.

### 5.3 Status

Status pesanan yang disarankan: `pending`, `confirmed`, `preparing`,
`ready`, `completed`, `rejected`, `cancelled`.

Status pembayaran: `unpaid`, `pending_verification`, `paid`, `rejected`,
`refunded`.

Perubahan status harus dicatat dalam riwayat dengan waktu dan aktor yang
melakukan perubahan. Transisi status harus divalidasi di backend.

## 6. Kebutuhan Fungsional

Prioritas: **P0** = wajib untuk operasional MVP; **P1** = penting
setelah alur inti stabil; **P2** = pengembangan lanjutan.

### 6.1 Akun dan profil

  -----------------------------------------------------------------------
  ID                      Prioritas               Kebutuhan
  ----------------------- ----------------------- -----------------------
  FR-001                  P0                      Customer dapat
                                                  registrasi dengan nama,
                                                  email/nomor HP, dan
                                                  password.

  FR-002                  P0                      Customer dan admin
                                                  dapat login/logout.

  FR-003                  P0                      Password disimpan
                                                  menggunakan hash yang
                                                  kuat.

  FR-004                  P1                      Customer dapat mengubah
                                                  profil dan mengganti
                                                  password.

  FR-005                  P1                      Fitur reset password
                                                  melalui mekanisme
                                                  verifikasi yang aman.
  -----------------------------------------------------------------------

### 6.2 Katalog dan produk

  -----------------------------------------------------------------------
  ID                      Prioritas               Kebutuhan
  ----------------------- ----------------------- -----------------------
  FR-010                  P0                      Customer dapat melihat
                                                  katalog dan detail
                                                  produk.

  FR-011                  P0                      Produk menampilkan
                                                  nama, foto, harga,
                                                  deskripsi, kategori,
                                                  dan ketersediaan.

  FR-012                  P0                      Admin dapat menambah,
                                                  mengubah, dan
                                                  menonaktifkan produk.

  FR-013                  P0                      Admin dapat upload,
                                                  preview, mengganti, dan
                                                  menghapus foto produk.

  FR-014                  P0                      Backend memvalidasi
                                                  format, ukuran, dan isi
                                                  file foto.

  FR-015                  P1                      Customer dapat mencari,
                                                  memfilter, dan
                                                  mengurutkan produk.

  FR-016                  P1                      Admin dapat mengelola
                                                  kategori, stok, dan
                                                  status habis.

  FR-017                  P1                      Admin dapat mengelola
                                                  banner promosi.
  -----------------------------------------------------------------------

### 6.3 Keranjang dan checkout

  -----------------------------------------------------------------------
  ID                      Prioritas               Kebutuhan
  ----------------------- ----------------------- -----------------------
  FR-020                  P0                      Customer dapat
                                                  menambah, mengubah
                                                  jumlah, dan menghapus
                                                  item keranjang.

  FR-021                  P0                      Customer dapat
                                                  menambahkan catatan per
                                                  item.

  FR-022                  P0                      Sistem memvalidasi stok
                                                  dan status aktif
                                                  sebelum checkout.

  FR-023                  P0                      Customer dapat memilih
                                                  dine-in atau takeaway.

  FR-024                  P0                      Dine-in memerlukan
                                                  nomor meja; takeaway
                                                  menyimpan
                                                  informasi/waktu
                                                  pengambilan sesuai
                                                  kebijakan restoran.

  FR-025                  P0                      Server menghitung
                                                  subtotal dan total dari
                                                  harga database, bukan
                                                  mempercayai nilai dari
                                                  browser.

  FR-026                  P0                      Sistem membuat nomor
                                                  pesanan unik dan
                                                  menyimpan snapshot nama
                                                  serta harga item.

  FR-027                  P1                      Customer dapat
                                                  menjadwalkan waktu
                                                  pengambilan jika
                                                  operasional mendukung.

  FR-028                  P1                      Customer dapat memesan
                                                  ulang dari transaksi
                                                  sebelumnya.
  -----------------------------------------------------------------------

### 6.4 Pembayaran dan struk

  -----------------------------------------------------------------------
  ID                      Prioritas               Kebutuhan
  ----------------------- ----------------------- -----------------------
  FR-030                  P0                      Customer dapat memilih
                                                  Cash atau QRIS.

  FR-031                  P0                      Sistem mencatat status
                                                  pembayaran secara
                                                  terpisah dari status
                                                  pesanan.

  FR-032                  P0                      Admin dapat mencatat
                                                  pembayaran Cash.

  FR-033                  P0                      Admin dapat
                                                  memverifikasi atau
                                                  menolak bukti QRIS dan
                                                  menyimpan alasan.

  FR-034                  P0                      Sistem menyediakan
                                                  struk digital
                                                  berdasarkan data
                                                  transaksi tersimpan.

  FR-035                  P0                      Struk menampilkan nomor
                                                  struk/pesanan, tanggal,
                                                  pelanggan, jenis
                                                  layanan, item, jumlah,
                                                  harga, total, metode,
                                                  dan status pembayaran.

  FR-036                  P0                      Customer dapat membuka
                                                  dan mengunduh struk
                                                  PDF.

  FR-037                  P1                      Struk dapat dicetak dan
                                                  dibagikan melalui fitur
                                                  berbagi perangkat.

  FR-038                  P2                      QRIS dinamis melalui
                                                  payment gateway dan
                                                  callback/webhook
                                                  terverifikasi.
  -----------------------------------------------------------------------

### 6.5 Pesanan dan notifikasi

  -----------------------------------------------------------------------
  ID                      Prioritas               Kebutuhan
  ----------------------- ----------------------- -----------------------
  FR-040                  P0                      Admin dapat melihat
                                                  daftar dan detail
                                                  pesanan.

  FR-041                  P0                      Admin dapat menerima
                                                  atau menolak pesanan
                                                  dengan alasan.

  FR-042                  P0                      Admin dapat mengubah
                                                  status pesanan sesuai
                                                  transisi yang
                                                  diizinkan.

  FR-043                  P0                      Customer dapat melihat
                                                  riwayat, detail, dan
                                                  status pesanan
                                                  miliknya.

  FR-044                  P0                      Sistem menyimpan
                                                  riwayat perubahan
                                                  status.

  FR-045                  P1                      Customer memperoleh
                                                  notifikasi dalam
                                                  aplikasi saat status
                                                  berubah.

  FR-046                  P2                      Notifikasi
                                                  WhatsApp/email/push
                                                  sesuai layanan yang
                                                  dipilih.
  -----------------------------------------------------------------------

### 6.6 Dashboard dan administrasi

  -----------------------------------------------------------------------
  ID                      Prioritas               Kebutuhan
  ----------------------- ----------------------- -----------------------
  FR-050                  P0                      Admin memiliki
                                                  dashboard ringkasan
                                                  pesanan dan penjualan
                                                  dasar.

  FR-051                  P0                      Admin dapat mengelola
                                                  produk, foto, kategori,
                                                  dan pesanan.

  FR-052                  P1                      Admin dapat mengelola
                                                  pelanggan dan jam
                                                  operasional.

  FR-053                  P1                      Admin dapat membuat
                                                  voucher/promosi dengan
                                                  periode dan aturan.

  FR-054                  P1                      Admin dapat melihat
                                                  laporan berdasarkan
                                                  rentang tanggal.

  FR-055                  P1                      Admin dapat mengekspor
                                                  laporan CSV.

  FR-056                  P2                      Grafik analitik
                                                  lanjutan dan
                                                  perbandingan periode.
  -----------------------------------------------------------------------

## 7. Kebutuhan Nonfungsional

-   **Responsive:** tampilan mobile-first dan tetap berfungsi pada
    tablet/desktop.
-   **Usability:** alur pesan singkat, tombol mudah disentuh, validasi
    form jelas.
-   **Performance:** optimasi ukuran gambar, pagination katalog/pesanan,
    dan query database.
-   **Security:** password hashing, session aman, CSRF protection,
    validasi input, ORM/parameterized query, pembatasan akses berbasis
    role, dan pembatasan upload.
-   **Privacy:** hanya mengumpulkan data pelanggan yang diperlukan; data
    pribadi tidak ditampilkan kepada customer lain.
-   **Reliability:** transaksi checkout menggunakan database
    transaction; cegah pesanan ganda akibat klik berulang.
-   **Auditability:** catat perubahan status, verifikasi pembayaran, dan
    tindakan admin penting.
-   **Maintainability:** pisahkan route, model, service, template, dan
    konfigurasi.
-   **Compatibility:** uji browser mobile modern dan koneksi jaringan
    yang umum digunakan.
-   **Backup:** sediakan prosedur backup database dan file upload
    sebelum produksi.

## 8. Aturan Perhitungan dan Integritas Data

1.  Harga produk dan total transaksi dihitung ulang di backend.
2.  `order_items` menyimpan snapshot nama produk, harga satuan,
    kuantitas, catatan, dan subtotal saat transaksi dibuat.
3.  Perubahan harga produk tidak mengubah transaksi lama.
4.  Nomor pesanan dan nomor struk harus unik.
5.  Checkout harus atomik: bila penyimpanan item gagal, pesanan tidak
    boleh tersimpan setengah.
6.  Klik checkout berulang tidak boleh membuat transaksi ganda; gunakan
    token/idempotency atau mekanisme pencegahan yang sesuai.
7.  Produk tidak tersedia tidak dapat dipesan.
8.  Stok hanya dikurangi sesuai kebijakan yang ditetapkan dan harus
    konsisten saat pesanan dibatalkan.
9.  Struk hanya dapat diakses pemilik pesanan atau admin berwenang.
10. Status `paid` hanya dapat ditetapkan setelah pembayaran benar-benar
    diterima atau diverifikasi.

## 9. Halaman dan Navigasi

### Customer

-   `/` --- Beranda
-   `/menu` --- Katalog
-   `/menu/<id>` --- Detail produk
-   `/login` --- Login
-   `/register` --- Registrasi
-   `/cart` --- Keranjang
-   `/checkout` --- Checkout
-   `/orders` --- Riwayat pesanan
-   `/orders/<id>` --- Detail dan status pesanan
-   `/orders/<id>/receipt` --- Struk
-   `/profile` --- Profil

### Admin

-   `/admin/login` --- Login admin
-   `/admin` --- Dashboard
-   `/admin/orders` --- Daftar pesanan
-   `/admin/orders/<id>` --- Detail pesanan
-   `/admin/products` --- Kelola produk/foto
-   `/admin/categories` --- Kelola kategori
-   `/admin/payments` --- Pembayaran
-   `/admin/customers` --- Pelanggan
-   `/admin/promotions` --- Banner/voucher
-   `/admin/reports` --- Laporan
-   `/admin/settings` --- Pengaturan

## 10. Model Data Awal

Tabel inti yang disarankan: - `users`: identitas, kontak, password hash,
role, status. - `categories`: nama dan status kategori. - `products`:
kategori, nama, deskripsi, harga, stok, status, image path. - `orders`:
customer, nomor pesanan, tipe layanan, nomor meja/waktu ambil, total,
status, timestamps. - `order_items`: order, product reference opsional,
snapshot nama/harga, quantity, notes, subtotal. - `payments`: order,
metode, jumlah, status, bukti, verifier, timestamps. -
`order_status_history`: order, status, aktor, catatan, waktu. -
`promotions` (P1): kode, jenis diskon, periode, batas penggunaan,
status. - `banners` (P1): gambar, teks, target, periode, status. -
`restaurant_settings`: nama, kontak, alamat, jam operasional, QRIS
image, konfigurasi layanan. - `tables` (bila dine-in menggunakan daftar
meja): kode meja, label, status.

Relasi dan constraint detail ditetapkan saat implementasi database.
Gunakan foreign key, index untuk pencarian umum, dan tipe decimal untuk
uang.

## 11. Teknologi Rekomendasi

Untuk MVP cepat: - Backend: Python Flask. - Frontend: HTML, CSS,
JavaScript, Bootstrap 5. - ORM: SQLAlchemy. - Database awal: SQLite
untuk prototipe lokal; MariaDB direkomendasikan untuk deployment
multi-user/produksi. - Authentication: Flask-Login atau session
authentication yang aman. - PDF: ReportLab. - Grafik: Chart.js. - Image
processing: Pillow. - Testing: pytest.

Jangan menyimpan secret di source code. Gunakan environment variables
dan konfigurasi berbeda untuk development/production. SQLite hanya
pilihan percepatan MVP; uji concurrency dan migrasi sebelum penggunaan
produksi.

## 12. Kriteria Penerimaan MVP

MVP dapat dinyatakan siap diuji jika: 1. Customer dapat registrasi dan
login. 2. Customer dapat melihat produk beserta foto yang dikelola
admin. 3. Customer dapat membuat pesanan dine-in dan takeaway. 4.
Keranjang dan total dihitung dengan benar di server. 5. Pesanan masuk ke
dashboard admin. 6. Admin dapat menerima/menolak dan memperbarui status.
7. Cash dapat dicatat dan QRIS dapat diverifikasi manual. 8. Customer
dapat melihat status pesanan. 9. Struk digital dan PDF menampilkan data
transaksi yang benar. 10. Admin dapat menambah/edit/nonaktifkan produk
serta mengganti foto. 11. Pengujian akses memastikan customer tidak
dapat mengakses dashboard admin atau pesanan orang lain. 12. Alur utama
berhasil diuji pada smartphone.

## 13. Risiko dan Mitigasi

  -----------------------------------------------------------------------
  Risiko                              Mitigasi
  ----------------------------------- -----------------------------------
  Waktu pengerjaan terbatas           Prioritaskan alur end-to-end P0;
                                      tunda P1/P2 tanpa menghapus dari
                                      backlog

  Foto terlalu besar                  Validasi ukuran, resize/compress,
                                      dan batasi format

  Bukti QRIS palsu                    Verifikasi manual admin; jangan
                                      otomatis mengubah status menjadi
                                      paid

  Pesanan ganda                       Disable tombol saat submit dan
                                      gunakan idempotency

  Perubahan harga                     Simpan snapshot harga pada item
                                      transaksi

  Akses tidak sah                     Validasi role dan kepemilikan data
                                      di backend

  Server/database bermasalah          Backup dan prosedur pemulihan
  -----------------------------------------------------------------------

## 14. Keputusan yang Perlu Dikonfirmasi Saat Implementasi

-   Apakah Dine-in memakai QR Code per meja atau input nomor meja
    manual.
-   Kapan pembayaran Cash dilakukan.
-   Apakah QRIS menggunakan QR statis atau payment gateway.
-   Apakah Takeaway perlu memilih waktu pengambilan.
-   Jam operasional dan kebijakan penolakan/pembatalan.
-   Apakah stok dikelola per jumlah unit atau hanya status
    tersedia/habis.

**Prinsip:** jangan menebak kebijakan bisnis yang belum diputuskan.
Gunakan default yang dapat dikonfigurasi dan tandai keputusan yang masih
menunggu konfirmasi.
