# TASKS --- Rasanna Daeng

**Implementation Backlog \| Versi 1.0 \| 11 November 2026**

Dokumen ini adalah daftar pekerjaan pengembangan Rasanna Daeng. Fitur
lengkap tetap menjadi target produk, tetapi pekerjaan diurutkan agar
alur pemesanan inti dapat berfungsi secepat mungkin.

## 1. Aturan Pengerjaan

-   Kerjakan berdasarkan urutan prioritas dan dependensi.
-   **P0:** wajib untuk MVP operasional.
-   **P1:** fitur penting setelah alur inti stabil.
-   **P2:** penyempurnaan/fitur lanjutan.
-   Tandai `[x]` hanya setelah implementasi dan pengujian selesai.
-   Jangan menandai tugas selesai hanya karena tampilan sudah dibuat;
    fungsi backend dan validasi juga harus berjalan.
-   Jangan menghapus fitur P1/P2 hanya karena tidak selesai pada hari
    pertama.
-   Gunakan data contoh yang jelas ditandai sebagai dummy sampai admin
    memasukkan data restoran sebenarnya.

## 2. Persiapan Proyek

### P0 --- Fondasi

-   [ ] Buat repository Git dan struktur proyek Flask.
-   [ ] Buat virtual environment Python.
-   [ ] Buat `requirements.txt` dan file konfigurasi.
-   [ ] Buat `.env.example`; jangan commit `.env`.
-   [ ] Konfigurasi Flask app factory dan environment development.
-   [ ] Konfigurasi SQLAlchemy dan migration.
-   [ ] Buat halaman error 404 dan 500.
-   [ ] Siapkan `.gitignore` untuk environment, database lokal, secret,
    dan upload sensitif.
-   [ ] Pastikan aplikasi dapat dijalankan secara lokal.

## 3. Database dan Model

### P0

-   [ ] Model `User` dengan role customer/admin.
-   [ ] Model `Category`.
-   [ ] Model `Product`.
-   [ ] Model `Order`.
-   [ ] Model `OrderItem` dengan snapshot nama dan harga.
-   [ ] Model `Payment`.
-   [ ] Model `OrderStatusHistory`.
-   [ ] Buat relasi, foreign key, constraint, dan index yang diperlukan.
-   [ ] Buat migration awal.
-   [ ] Buat seed kategori dan produk dummy untuk development.
-   [ ] Pastikan nilai uang menggunakan tipe decimal, bukan floating
    point.
-   [ ] Uji pembuatan, pembacaan, perubahan, dan penghapusan data.

### P1

-   [ ] Model `Promotion` dan validasi aturan voucher.
-   [ ] Model `Banner`.
-   [ ] Model `RestaurantSettings`.
-   [ ] Model `RestaurantTable` jika daftar meja digunakan.

## 4. Autentikasi dan Otorisasi

### P0

-   [ ] Halaman registrasi customer.
-   [ ] Validasi input dan keunikan email/nomor HP.
-   [ ] Password hashing.
-   [ ] Halaman login dan logout.
-   [ ] Proteksi route yang membutuhkan login.
-   [ ] Role-based access control untuk admin.
-   [ ] Registrasi publik tidak boleh membuat akun admin.
-   [ ] Buat akun admin awal melalui command/seed yang aman.
-   [ ] Customer hanya dapat mengakses pesanan dan struk miliknya.
-   [ ] Uji akses tanpa login, customer ke route admin, dan akses data
    customer lain.

### P1

-   [ ] Halaman profil.
-   [ ] Ubah password.
-   [ ] Reset password dengan mekanisme verifikasi aman.

## 5. Customer --- Katalog dan Beranda

### P0

-   [ ] Buat layout mobile-first dan navigasi customer.
-   [ ] Buat halaman beranda.
-   [ ] Buat katalog produk.
-   [ ] Buat kartu produk dengan foto, nama, harga, dan status.
-   [ ] Buat halaman detail produk.
-   [ ] Tampilkan status habis/tidak tersedia.
-   [ ] Tampilkan pesan jika katalog kosong.
-   [ ] Pastikan gambar responsif dan memiliki fallback jika gagal
    dimuat.

### P1

-   [ ] Pencarian produk.
-   [ ] Filter kategori.
-   [ ] Pengurutan harga/nama/popularitas.
-   [ ] Banner promosi.
-   [ ] Menu populer/rekomendasi.
-   [ ] Pagination atau lazy loading bila katalog besar.

## 6. Admin --- Manajemen Produk dan Foto

### P0

-   [ ] Halaman daftar produk admin.
-   [ ] Form tambah produk.
-   [ ] Form edit produk.
-   [ ] Fitur nonaktifkan/hapus produk dengan perlindungan transaksi
    historis.
-   [ ] Upload foto produk.
-   [ ] Preview foto sebelum disimpan.
-   [ ] Ganti foto produk.
-   [ ] Hapus foto produk.
-   [ ] Validasi ekstensi, MIME type, ukuran, dan konten file di
    backend.
-   [ ] Buat nama file aman dan unik; jangan gunakan nama file asli
    secara langsung.
-   [ ] Simpan path/URL foto di database.
-   [ ] Resize/kompres foto dengan batas dimensi dan ukuran.
-   [ ] Pastikan foto baru tampil di katalog customer setelah tersimpan.
-   [ ] Uji file tidak valid, file terlalu besar, dan upload gagal.

### P1

-   [ ] CRUD kategori.
-   [ ] Pengelolaan stok.
-   [ ] Status tersedia/habis.
-   [ ] Pengelolaan banner.
-   [ ] Bulk update ketersediaan jika diperlukan.

## 7. Customer --- Keranjang dan Checkout

### P0

-   [ ] Tambah produk ke keranjang.
-   [ ] Ubah kuantitas.
-   [ ] Hapus item.
-   [ ] Tambah catatan per item.
-   [ ] Tampilkan subtotal per item dan total keranjang.
-   [ ] Validasi produk aktif dan stok saat checkout.
-   [ ] Buat halaman checkout.
-   [ ] Pilihan Dine-in dan Takeaway.
-   [ ] Input/pilihan nomor meja untuk Dine-in.
-   [ ] Input informasi pengambilan untuk Takeaway sesuai kebijakan.
-   [ ] Pilihan Cash dan QRIS.
-   [ ] Tampilkan ringkasan sebelum konfirmasi.
-   [ ] Hitung ulang harga dan total di backend.
-   [ ] Simpan pesanan dan item secara atomik dalam database
    transaction.
-   [ ] Buat nomor pesanan unik.
-   [ ] Cegah submit berulang/pesanan ganda.
-   [ ] Kosongkan keranjang hanya setelah pesanan berhasil dibuat.
-   [ ] Tampilkan halaman konfirmasi pesanan.

### P1

-   [ ] Simpan keranjang untuk sesi/login pelanggan.
-   [ ] Jadwal pengambilan.
-   [ ] Pesan kembali dari riwayat.

## 8. Pembayaran

### P0

-   [ ] Definisikan status pembayaran terpisah dari status pesanan.
-   [ ] Alur Cash dengan status awal belum lunas.
-   [ ] Admin dapat mencatat penerimaan Cash.
-   [ ] Tampilkan QRIS statis milik restoran.
-   [ ] Instruksi pembayaran QRIS.
-   [ ] Upload bukti pembayaran jika kebijakan mengharuskan.
-   [ ] Admin dapat melihat bukti pembayaran.
-   [ ] Admin dapat menyetujui/menolak bukti dan menambahkan catatan.
-   [ ] Hanya admin berwenang yang dapat menetapkan status paid pada
    verifikasi manual.
-   [ ] Simpan waktu dan identitas verifikator.
-   [ ] Uji alur pembayaran berhasil, ditolak, dan menunggu verifikasi.

### P1

-   [ ] Riwayat pembayaran yang dapat difilter.
-   [ ] Rekap metode pembayaran.

### P2

-   [ ] Integrasi payment gateway QRIS dinamis.
-   [ ] Verifikasi callback/webhook dengan signature dan proteksi
    replay.

## 9. Admin --- Manajemen Pesanan

### P0

-   [ ] Daftar pesanan masuk.
-   [ ] Detail pesanan dan item.
-   [ ] Filter berdasarkan status.
-   [ ] Terima pesanan.
-   [ ] Tolak pesanan dengan alasan.
-   [ ] Ubah status ke `preparing`.
-   [ ] Ubah status ke `ready`.
-   [ ] Ubah status ke `completed`.
-   [ ] Validasi transisi status di backend.
-   [ ] Catat setiap perubahan pada `OrderStatusHistory`.
-   [ ] Tampilkan metode dan status pembayaran.
-   [ ] Pastikan pembatalan memperhitungkan stok dan pembayaran sesuai
    kebijakan.

### P1

-   [ ] Pencarian nomor pesanan/nama pelanggan.
-   [ ] Filter tanggal dan jenis layanan.
-   [ ] Notifikasi pesanan baru pada dashboard.
-   [ ] Penyegaran data otomatis atau polling terkontrol.

## 10. Customer --- Riwayat, Status, dan Struk

### P0

-   [ ] Halaman riwayat pesanan.
-   [ ] Detail pesanan.
-   [ ] Timeline/status pesanan.
-   [ ] Halaman struk digital.
-   [ ] Nomor struk unik.
-   [ ] Struk menampilkan identitas restoran dan transaksi.
-   [ ] Struk mengambil data dari transaksi tersimpan, bukan dari input
    browser.
-   [ ] Generate PDF.
-   [ ] Download PDF.
-   [ ] Batasi akses struk untuk pemilik pesanan/admin.
-   [ ] Uji kesesuaian total struk dengan data pembayaran dan order
    item.

### P1

-   [ ] Print-friendly receipt.
-   [ ] Share receipt menggunakan kemampuan berbagi perangkat atau
    unduh.
-   [ ] Notifikasi dalam aplikasi saat status berubah.

## 11. Dashboard, Promosi, dan Laporan Admin

### P0

-   [ ] Dashboard ringkasan jumlah pesanan.
-   [ ] Ringkasan pendapatan berdasarkan transaksi yang benar-benar
    dibayar.
-   [ ] Ringkasan pesanan berdasarkan status.

### P1

-   [ ] Grafik penjualan harian/bulanan.
-   [ ] Menu terlaris.
-   [ ] Filter laporan berdasarkan tanggal.
-   [ ] Ekspor laporan CSV.
-   [ ] Kelola data pelanggan.
-   [ ] Kelola jam operasional.
-   [ ] Kelola banner promosi.
-   [ ] CRUD voucher dan validasi periode, kuota, serta minimum
    transaksi.
-   [ ] Pengaturan nomor meja.
-   [ ] Pengaturan profil restoran dan gambar QRIS.

### P2

-   [ ] Ekspor PDF laporan.
-   [ ] Analisis tren dan perbandingan periode.
-   [ ] Multi-cabang.

## 12. Keamanan dan Kualitas

### P0

-   [ ] Aktifkan CSRF protection untuk form.
-   [ ] Gunakan ORM/parameterized queries.
-   [ ] Escape output untuk mencegah XSS.
-   [ ] Validasi dan normalisasi input di server.
-   [ ] Cookie session `HttpOnly`, `SameSite`, dan `Secure` di HTTPS.
-   [ ] Batasi ukuran dan tipe file upload.
-   [ ] Simpan secret di environment variables.
-   [ ] Jangan expose stack trace di production.
-   [ ] Terapkan otorisasi pada setiap route admin dan data pribadi.
-   [ ] Tambahkan logging untuk error dan aksi admin penting.
-   [ ] Backup database dan file upload sebelum deployment.
-   [ ] Uji kalkulasi harga, stok, dan status pembayaran.

### P1

-   [ ] Rate limiting untuk login dan endpoint sensitif.
-   [ ] Kebijakan retensi data dan penghapusan data pribadi.
-   [ ] Monitoring error dan kesehatan aplikasi.
-   [ ] Optimasi gambar dan query.
-   [ ] Uji beban dasar sesuai perkiraan penggunaan.

## 13. Pengujian End-to-End

### P0 --- Skenario wajib

-   [ ] Registrasi customer berhasil.
-   [ ] Login/logout customer berhasil.
-   [ ] Login admin berhasil.
-   [ ] Customer tidak dapat membuka dashboard admin.
-   [ ] Admin dapat menambah produk dan foto.
-   [ ] Admin dapat mengganti foto dan perubahan terlihat di katalog.
-   [ ] Produk habis tidak dapat di-checkout.
-   [ ] Customer dapat membuat pesanan Dine-in.
-   [ ] Customer dapat membuat pesanan Takeaway.
-   [ ] Total pesanan sesuai perhitungan server.
-   [ ] Pesanan tampil di dashboard admin.
-   [ ] Admin dapat menerima dan memproses pesanan.
-   [ ] Cash dapat dicatat lunas oleh admin.
-   [ ] QRIS dapat diverifikasi manual.
-   [ ] Customer dapat melihat status pesanan.
-   [ ] Customer dapat membuka dan mengunduh struk PDF.
-   [ ] Customer tidak dapat membuka struk milik customer lain.
-   [ ] Tampilan dan alur utama dapat digunakan pada HP.

### P1

-   [ ] Pencarian, filter, voucher, laporan, dan ekspor diuji.
-   [ ] Uji berbagai ukuran layar dan browser.
-   [ ] Uji kegagalan jaringan saat checkout.
-   [ ] Uji upload file rusak atau tidak didukung.
-   [ ] Uji beberapa pesanan bersamaan dan konsistensi stok.

## 14. Deployment

### P0 --- bila aplikasi akan dipakai melalui internet

-   [ ] Pilih hosting/VPS dan domain.
-   [ ] Konfigurasi environment production.
-   [ ] Gunakan HTTPS.
-   [ ] Gunakan server aplikasi WSGI dan reverse proxy; jangan gunakan
    Flask development server untuk production.
-   [ ] Konfigurasi database production.
-   [ ] Tentukan penyimpanan file upload yang persisten.
-   [ ] Jalankan migration dan buat akun admin dengan aman.
-   [ ] Uji alur transaksi setelah deployment.
-   [ ] Aktifkan backup terjadwal dan uji pemulihan.

## 15. Urutan Eksekusi Cepat

Urutan ini memprioritaskan satu alur transaksi yang benar-benar selesai
sebelum fitur tambahan.

1.  Fondasi proyek, database, dan autentikasi.
2.  CRUD produk dan upload/ganti foto.
3.  Katalog customer dan detail produk.
4.  Keranjang dan checkout.
5.  Pesanan masuk dan pengelolaan status admin.
6.  Cash dan QRIS manual.
7.  Riwayat, status, dan struk PDF.
8.  Uji end-to-end di HP.
9.  Tambahkan P1: pencarian, promosi, notifikasi, laporan.
10. Deployment dan hardening keamanan.

## 16. Definition of Done

Sebuah tugas baru boleh ditandai selesai jika: - Implementasi berjalan
sesuai kebutuhan. - Validasi dilakukan di backend untuk operasi
penting. - Hak akses diuji. - Tampilan mobile diperiksa jika terkait
UI. - Tidak ada error kritis pada alur terkait. - Perubahan
terdokumentasi secukupnya. - Pengujian yang relevan lulus.

**Target utama:** aplikasi harus dapat menerima dan mengelola transaksi
nyata dengan perhitungan benar, status pembayaran jelas, foto menu dapat
dikelola admin, serta struk dapat diakses pelanggan. Fitur lanjutan
tetap berada di backlog sampai selesai diimplementasikan dan diuji.
