# Rasanna Daeng — Design System & UI/UX Specification
> Warisan bahari Makassar, hangat, otentik, dan mudah dipesan

**Theme:** Light  
**Product:** Mobile-first food ordering web application  
**Brand tagline:** Cita Rasa Otentik Anging Mammiri  
**Logo source:** `logo rasanna daeng.svg`  
**Brand source:** `Design_Brief_Rasanna_Daeng.docx`  
**Style reference:** `Pasted text(20261111-010044).txt` (Monte — Style Reference), adapted to Rasanna Daeng identity.

---

## 1. Design Direction

Rasanna Daeng menggabungkan nuansa kuliner Makassar yang hangat dan berkelas dengan identitas bahari Bugis-Makassar. Gaya visual mengambil struktur dan kedisiplinan dari referensi Monte: bidang warna yang tegas, ruang kosong yang lega, tipografi serif, layout bersih, tombol berbentuk pill, dan minim dekorasi. Namun, identitas Monte seperti terracotta Corten, wordmark Monte, ilustrasi orang minum kopi, dan palet dua warna **tidak digunakan**.

Identitas Rasanna Daeng harus berpusat pada:
- Perahu layar terinspirasi pinisi sebagai simbol perjalanan resep leluhur dan budaya pelaut Makassar.
- Redwood gelap sebagai warna dasar yang kuat dan berwibawa.
- Copper dan Gold Sand sebagai aksen rempah, kehangatan, serta ornamen tradisional.
- Martinique dan Kashmir Blue sebagai aksen bahari yang digunakan secara hemat.
- Krem hangat sebagai bidang utama agar katalog makanan nyaman dibaca.
- Fotografi makanan yang hangat, natural, dan menggugah selera.

**Kesan yang harus muncul:** otentik, hangat, ramah, berbudaya, terpercaya, dan semi-premium tanpa terasa kaku atau mahal.

## 2. Prinsip Desain Produk

1. **Mobile-first ordering:** pelanggan harus dapat menemukan menu, menambahkan ke keranjang, checkout, dan melihat status pesanan dengan nyaman di smartphone.
2. **Brand-led, not decorative:** logo, warna, tipografi, dan fotografi membawa identitas; ornamen hanya sebagai aksen.
3. **Menu clarity first:** nama, deskripsi singkat, harga, ketersediaan, dan tombol tambah harus mudah dipindai.
4. **Warm food photography:** tampilkan makanan secara nyata dengan pencahayaan hangat dan properti kayu, rotan, atau keramik tanah.
5. **Consistent customer/admin language:** komponen dan warna konsisten, tetapi dashboard admin mengutamakan keterbacaan dan efisiensi kerja.
6. **Accessible contrast:** jangan memakai Gold Sand atau Copper sebagai teks kecil di atas krem.
7. **Functional feedback:** status sukses, gagal, loading, stok habis, dan validasi harus terlihat jelas; prinsip visual flat tidak boleh menghilangkan feedback interaksi.

## 3. Logo System

### 3.1 Logo utama

Gunakan ikon perahu layar dari file SVG yang diberikan. Logo menggambarkan perahu layar di atas gelombang:
- Bendera dan tiang: Copper dan Martinique.
- Layar depan: Gold Sand menuju Copper.
- Layar utama: Copper dan tembaga gelap.
- Layar belakang: Kashmir Blue.
- Lambung: Martinique menuju Redwood.
- Gelombang: Martinique dan Kashmir Blue.

Makna logo: perahu melambangkan perjalanan resep leluhur lintas generasi; layar yang menangkap angin menguatkan tagline Anging Mammiri.

### 3.2 Penggunaan pada aplikasi

- **Header desktop:** ikon di kiri, wordmark “RASANNA DAENG” dan tagline di kanan atau di bawah sesuai ruang.
- **Header mobile:** gunakan ikon dan wordmark ringkas; tagline boleh dihilangkan bila ruang tidak cukup.
- **Login/register:** gunakan lockup vertikal atau ikon di atas wordmark.
- **Favicon/avatar:** gunakan ikon perahu saja.
- **Footer dan halaman tentang:** gunakan versi utama dengan tagline.
- **Latar krem:** gunakan SVG asli.
- **Latar Redwood gelap:** gunakan versi terbalik yang disiapkan desainer; jangan membiarkan lambung dan gelombang gelap tenggelam di latar.
- **Ukuran kecil:** gunakan versi flat/satu warna jika detail gradasi tidak terbaca.

### 3.3 Aturan logo

- Jangan memutar, meregangkan, memotong, atau mengubah proporsi logo.
- Jangan mengubah warna layar di luar palet brand.
- Pertahankan ruang aman minimal setinggi tiang bendera di setiap sisi.
- Ukuran minimum ikon digital sekitar 24 px; gunakan versi sederhana satu warna di ukuran lebih kecil.
- Jangan membuat ulang logo dengan teks biasa jika file logo tersedia.
- Jangan menambahkan efek glow, bevel, drop shadow, atau gradasi baru.
- Simpan file SVG master dan gunakan sebagai asset, bukan menyalin ulang path secara manual.

## 4. Color Tokens

Palet berikut berasal dari Design Brief Rasanna Daeng dan warna aktual pada SVG logo. Warna Monte tidak digunakan sebagai token brand.

| Name | HEX | CSS token | Role |
|---|---|---|---|
| Redwood | `#5B1F11` | `--color-redwood` | Warna brand utama; header, footer, judul utama, teks penting, hero |
| Copper | `#B36633` | `--color-copper` | Aksen utama, tombol utama, ikon, harga/aksen terpilih |
| Martinique | `#323659` | `--color-martinique` | Aksen sekunder bahari, navigasi/elemen kontras, layar logo |
| Kashmir Blue | `#5474A1` | `--color-kashmir-blue` | Aksen bahari, label dingin/segar, informasi sekunder |
| Gold Sand | `#E7BA80` | `--color-gold-sand` | Ornamen, garis hias, highlight di bidang gelap |
| Warm Cream | `#FBF6EE` | `--color-warm-cream` | Latar utama halaman, area katalog, form, permukaan terang |
| Paper | `#FFFDF9` | `--color-paper` | Permukaan kartu/form bila perlu pemisahan halus |
| Dark Brown | `#3B1209` | `--color-dark-brown` | Teks sangat gelap, hover/pressed Redwood |
| Body Text | `#3F302A` | `--color-body-text` | Teks isi pada latar krem |
| Muted Text | `#786B63` | `--color-muted-text` | Deskripsi sekunder, helper text |
| Border | `#E5D9CC` | `--color-border` | Border input, divider, outline kartu |
| Success | `#2F6B45` | `--color-success` | Status berhasil/lunas/selesai |
| Warning | `#9A641C` | `--color-warning` | Menunggu verifikasi/perhatian |
| Danger | `#A33227` | `--color-danger` | Gagal, ditolak, dibatalkan |

### 4.1 Proporsi warna

Gunakan proporsi sebagai panduan, bukan aturan kaku:
- 60% Warm Cream dan Paper untuk canvas serta ruang baca.
- 20% Redwood untuk area brand, header/footer, dan blok identitas.
- 10% Copper dan Gold Sand untuk aksen hangat.
- 10% gabungan Martinique dan Kashmir Blue untuk aksen bahari.

Warna status (success, warning, danger) hanya digunakan untuk feedback fungsional, bukan dekorasi.

### 4.2 Aturan kontras

- Teks panjang pada latar terang: Redwood atau Body Text.
- Teks pada Redwood/Martinique: Warm Cream atau putih.
- Copper dan Gold Sand di atas Warm Cream hanya untuk ikon besar, garis, ornamen, atau aksen; jangan untuk teks kecil.
- Kashmir Blue digunakan hemat dan tidak menjadi warna utama tombol checkout.
- Jangan menggunakan Gold Sand sebagai teks body di latar krem.
- Pastikan tombol, label status, dan teks harga tetap terbaca pada layar HP.

## 5. Typography

Maksimal dua keluarga font.

### 5.1 Display / Heading — Serif klasik

Gunakan **DM Serif Display** atau **Playfair Display** sebagai alternatif web yang mudah diperoleh. Jika font resmi brand tersedia, prioritaskan font tersebut.

- Role: wordmark pendamping, hero headline, judul section, judul kategori, highlight editorial.
- Weight: 400 untuk judul reguler; 600/700 jika tersedia untuk penekanan.
- Hindari letter-spacing berlebihan pada kalimat panjang.
- Judul kapital dapat memakai tracking longgar secukupnya.

### 5.2 Body / UI — Sans-serif yang jelas

Gunakan **Inter** sebagai font antarmuka dan teks panjang.

- Role: deskripsi makanan, label form, navigasi, tombol, harga, tabel admin, notifikasi.
- Weight: 400 regular, 500 medium, 600 semibold, 700 bold.
- Harga harus jelas dan mudah dibandingkan.
- Deskripsi menu maksimal 2–3 baris pada kartu; teks lengkap di halaman detail.

### 5.3 Type scale

| Role | Size | Weight | Line height | Usage |
|---|---:|---:|---:|---|
| Caption | 11–12px | 400/500 | 1.35 | Waktu, helper, metadata |
| Small | 13px | 400/500 | 1.4 | Label, kategori kecil |
| Body | 14–16px | 400 | 1.5 | Deskripsi dan isi |
| Body strong | 14–16px | 600 | 1.4 | Harga, nilai, tombol |
| Subheading | 18–20px | 600 | 1.3 | Judul kartu |
| Heading small | 24px | 600 | 1.2 | Judul section |
| Heading | 30–36px | 600 | 1.15 | Hero dan judul halaman |
| Display | 40–48px | 600 | 1.05 | Hero desktop, bila ruang cukup |

Pada mobile, judul besar harus responsif dan tidak memaksa horizontal scrolling.

## 6. Spacing, Shape & Layout

**Base unit:** 4px  
**Density:** comfortable, dengan kepadatan lebih tinggi pada dashboard admin.

### 6.1 Spacing scale

`4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 120px`

### 6.2 Radius

| Element | Radius |
|---|---:|
| Product/menu cards | 14px |
| Content panels | 14px |
| Inputs | 12px |
| Primary/secondary buttons | 9999px (pill) |
| Status badges | 9999px |
| Food photography | 10–14px for product cards; natural edge for large editorial images |
| Modal/dialog | 16px |

Bentuk pill dari referensi digunakan pada tombol dan badge, tetapi input boleh menggunakan radius 12px agar field panjang mudah dibaca dan nyaman dioperasikan.

### 6.3 Layout

- Content max-width desktop: 1200px.
- Main content mobile: full width dengan padding 16–20px.
- Tablet: padding 24px.
- Desktop: padding 32px.
- Product grid: 2 kolom pada mobile untuk katalog bila ukuran layar cukup; 3–4 kolom tablet/desktop sesuai lebar.
- Checkout mobile: satu kolom dan tombol aksi utama mudah dijangkau.
- Admin desktop: sidebar + content; admin mobile: drawer/bottom navigation yang ringkas.
- Hindari horizontal scrolling pada seluruh halaman, kecuali komponen tabel admin yang memang memiliki wrapper scroll.

## 7. Surfaces & Elevation

Gunakan permukaan datar dan pemisahan melalui warna, border, serta whitespace. Hindari bayangan berat.

| Level | Surface | Value | Purpose |
|---|---|---|---|
| 1 | Warm Cream | `#FBF6EE` | Latar utama |
| 2 | Paper | `#FFFDF9` | Kartu, form, panel |
| 3 | Redwood | `#5B1F11` | Hero, header/footer, blok brand |
| 4 | Martinique | `#323659` | Panel aksen bahari, elemen sekunder |

- Shadow default: none atau sangat halus hanya untuk popover/modal bila diperlukan.
- Gunakan border `#E5D9CC` untuk pemisah.
- Jangan membuat semua komponen menjadi kartu; gunakan ruang kosong dan hierarki tipografi.

## 8. Imagery & Food Photography

### 8.1 Gaya foto

Mengikuti Design Brief:
- Cahaya hangat dan natural.
- Sudut pengambilan sedikit dari atas (three-quarter/top angle).
- Properti kayu, rotan, kain tradisional, dan keramik tanah.
- Warna makanan terlihat nyata; hindari filter dingin atau saturasi berlebihan.
- Hindari latar putih steril.
- Foto harus menampilkan porsi makanan secara jelas dan menggugah selera.

### 8.2 Penggunaan gambar

- Kartu produk: rasio 4:3 atau 1:1 yang konsisten.
- Detail produk: foto utama lebih besar, rasio 4:3.
- Banner promosi: landscape 16:9.
- Thumbnail admin: gunakan crop konsisten, tetapi jangan mengubah file asli.
- Gunakan `object-fit: cover` untuk kartu dan `object-fit: contain` bila seluruh objek harus terlihat.
- Sediakan placeholder brand saat foto belum diunggah.
- Optimalkan ukuran file dan gunakan thumbnail untuk katalog.

### 8.3 Integritas foto

- Foto pada Menu.pdf adalah referensi visual, bukan otomatis foto produk final.
- Admin harus dapat upload, preview, mengganti, dan menghapus foto.
- Jangan menampilkan foto generik yang seolah-olah merupakan foto asli hidangan Rasanna Daeng tanpa persetujuan.
- Alt text menjelaskan nama hidangan, bukan kata kunci berulang.

## 9. Customer Application Components

### 9.1 Header / Navigation

- Desktop: logo lockup di kiri, navigasi menu di tengah/kanan, ikon akun dan keranjang.
- Mobile: logo ringkas, ikon keranjang dengan jumlah item, menu navigasi ringkas.
- Header dapat menggunakan Redwood dengan teks Warm Cream, atau latar Warm Cream dengan logo asli.
- Hindari menjejalkan tagline pada header mobile yang sempit.

### 9.2 Hero / Beranda

Hero memperkenalkan Rasanna Daeng sebagai kuliner Makassar:
- Bidang Redwood atau Warm Cream dengan aksen Copper/Gold Sand.
- Logo utama tampil jelas.
- Headline contoh: “Cita Rasa Otentik Anging Mammiri”.
- Deskripsi singkat tentang warisan resep dan kuliner Makassar.
- CTA utama: “Lihat Menu” atau “Pesan Sekarang”.
- Foto unggulan Coto Makassar dan Sop Konro dapat menjadi fokus visual.
- Ornamen bahari berupa garis gelombang/perahu digunakan tipis; jangan menutupi foto atau CTA.

Tidak perlu meniru curved headline Monte atau ilustrasi orang minum kopi. Motif visual khas Rasanna Daeng adalah perahu layar, gelombang, dan ornamen sudut emas.

### 9.3 Category Navigation

Empat kategori utama:
1. Makanan Utama
2. Camilan Tradisional
3. Dessert & Manisan
4. Minuman & Kopi

Kategori dapat ditampilkan sebagai chip/pill dengan state aktif Redwood atau Copper. Pastikan label tidak terpotong pada layar kecil.

### 9.4 Product Card

Setiap kartu memuat:
- Foto produk.
- Nama produk.
- Deskripsi singkat.
- Harga dengan weight semibold/bold.
- Label “Favorit Daeng”, “Legendaris”, atau “Segar Dingin” hanya bila ditetapkan admin.
- Status “Tersedia” atau “Habis”.
- Tombol tambah ke keranjang.

Kartu memakai Paper/Warm Cream, border tipis, radius 14px, tanpa shadow berat. Jangan memakai Copper untuk teks harga kecil jika kontrasnya kurang; gunakan Redwood.

### 9.5 Product Detail

- Foto produk utama.
- Nama dan deskripsi lengkap.
- Harga yang menonjol.
- Ketersediaan.
- Kontrol jumlah.
- Catatan khusus.
- Tombol tambah ke keranjang.
- Rekomendasi produk terkait bila tersedia.

### 9.6 Cart & Checkout

- Ringkasan item dengan thumbnail kecil, nama, harga, kuantitas, dan catatan.
- Kontrol tambah/kurangi/hapus mudah disentuh.
- Rincian subtotal dan total tersusun jelas.
- Pilihan Dine-in/Takeaway berupa segmented control atau pilihan kartu.
- Nomor meja ditampilkan hanya untuk Dine-in.
- Informasi/waktu pengambilan ditampilkan sesuai kebijakan Takeaway.
- Metode Cash/QRIS ditampilkan dengan deskripsi instruksi.
- Tombol konfirmasi menggunakan Redwood atau Copper dengan kontras teks yang memenuhi aksesibilitas.
- Jangan menyembunyikan biaya atau total akhir.

### 9.7 Order Status & Receipt

- Timeline status: Menunggu, Dikonfirmasi, Diproses, Siap, Selesai.
- Status ditampilkan dengan teks dan indikator, bukan warna saja.
- Struk menggunakan gaya kertas krem, logo, identitas restoran, detail item, total, metode dan status pembayaran.
- Aksi: Unduh PDF, Cetak, dan Bagikan.
- Struk harus tetap terbaca saat dicetak hitam-putih.

### 9.8 Form Inputs

- Label selalu terlihat; jangan hanya mengandalkan placeholder.
- Field tinggi minimal 44px.
- Border `#E5D9CC`, latar Paper, teks Body Text.
- Focus state harus terlihat jelas dengan outline Copper/Redwood yang memenuhi kontras.
- Error state memakai Danger dan pesan yang spesifik.
- Input nominal menggunakan format rupiah yang konsisten.

### 9.9 Buttons

**Primary:** Redwood background, Warm Cream text; digunakan untuk tindakan utama seperti “Pesan Sekarang”, “Checkout”, dan “Konfirmasi Pesanan”.  
**Secondary:** transparent/Paper background, Redwood border dan text.  
**Tertiary:** text button dengan Redwood.  
**Destructive:** Danger untuk hapus/batalkan.  
**Disabled:** kontras cukup untuk dibaca tetapi jelas tidak aktif.

Bentuk pill dapat dipakai untuk CTA, namun jangan memaksakan tombol pill yang terlalu panjang pada setiap kontrol admin.

## 10. Admin Dashboard Components

Dashboard admin menggunakan palet yang sama, tetapi lebih fungsional dan padat.

### 10.1 Navigation

- Sidebar desktop dengan logo ringkas dan menu.
- Mobile menggunakan drawer atau navigasi ringkas.
- Menu: Dashboard, Pesanan, Produk, Kategori, Pembayaran, Pelanggan, Promosi, Laporan, Pengaturan.
- Item aktif menggunakan Redwood atau aksen Copper dengan indikator yang jelas.

### 10.2 Dashboard Overview

- Kartu ringkasan: pesanan hari ini, pendapatan dibayar, pesanan menunggu, produk tersedia.
- Grafik memakai warna Redwood, Copper, Martinique, dan Kashmir Blue secara konsisten.
- Angka harus memiliki label, rentang waktu, dan format rupiah.
- Jangan menghitung pesanan belum dibayar sebagai pendapatan lunas.

### 10.3 Order Management

- Tabel/list dengan nomor pesanan, waktu, customer, jenis layanan, total, pembayaran, dan status.
- Filter status dan tanggal.
- Detail pesanan menampilkan item, catatan, layanan, dan riwayat status.
- Aksi terima/tolak/proses/siap/selesai harus jelas dan meminta konfirmasi untuk aksi destruktif.

### 10.4 Product Management

- Tabel/list produk dengan thumbnail, nama, kategori, harga, stok/status, dan aksi.
- Form tambah/edit produk.
- Upload foto dengan preview, ganti, dan hapus.
- Tampilkan validasi ukuran/format file.
- Status tersedia/habis harus mudah diubah.
- Pastikan foto yang diganti memperbarui katalog customer.

### 10.5 Payment & Reports

- Pisahkan status pembayaran dari status pesanan.
- Bukti QRIS memiliki preview dan aksi verifikasi/penolakan.
- Laporan menyediakan filter tanggal dan ekspor.
- Tampilkan pendapatan berdasarkan pembayaran yang sudah diverifikasi.

## 11. Status & Feedback System

| State | Color token | Meaning |
|---|---|---|
| Success / Paid / Completed | `--color-success` | Berhasil/lunas/selesai |
| Pending / Waiting | `--color-warning` | Menunggu tindakan/verifikasi |
| Rejected / Cancelled / Error | `--color-danger` | Ditolak/dibatalkan/gagal |
| Informational / Ready | `--color-kashmir-blue` | Informasi/status siap |
| Neutral / Draft | `--color-muted-text` | Belum diproses |

Selalu sertakan teks status. Jangan mengandalkan warna saja. Sediakan loading, empty, error, dan success state pada halaman penting.

## 12. Responsive Behavior

### Mobile (< 768px)
- Prioritaskan katalog, keranjang, dan checkout.
- Gunakan navigasi sederhana dan tombol aksi yang mudah dijangkau ibu jari.
- Product grid 2 kolom jika lebar cukup; turun menjadi 1 kolom pada layar sangat sempit.
- Checkout satu kolom.
- Detail order dan struk disusun vertikal.
- Tabel admin berubah menjadi list/card atau scroll container yang terkontrol.

### Tablet (768–1023px)
- Product grid 2–3 kolom.
- Admin sidebar dapat dipadatkan.
- Form dapat memakai dua kolom jika ruang memadai.

### Desktop (≥ 1024px)
- Content max-width 1200px.
- Product grid 3–4 kolom.
- Admin sidebar permanen.
- Detail produk dapat menggunakan layout foto dan informasi dua kolom.

## 13. Accessibility & Interaction

- Kontras teks mengikuti WCAG AA sebagai target.
- Semua kontrol dapat dioperasikan dengan keyboard.
- Focus ring terlihat.
- Gambar memiliki alt text.
- Tombol memiliki label aksi yang jelas.
- Target sentuh minimal sekitar 44×44px.
- Jangan menyampaikan status hanya melalui warna atau ikon.
- Validasi form menjelaskan cara memperbaiki kesalahan.
- Hormati `prefers-reduced-motion`; animasi hanya untuk feedback singkat.
- Jangan gunakan animasi berat yang memperlambat perangkat mobile.

## 14. Do's and Don'ts

### Do
- Gunakan Redwood `#5B1F11` sebagai jangkar identitas.
- Gunakan Warm Cream `#FBF6EE` sebagai kanvas utama.
- Gunakan Copper `#B36633` dan Gold Sand `#E7BA80` sebagai aksen, bukan teks kecil di latar krem.
- Gunakan Martinique `#323659` dan Kashmir Blue `#5474A1` secara hemat untuk identitas bahari.
- Tampilkan logo perahu layar asli tanpa mengubah proporsi.
- Gunakan serif klasik untuk headline dan Inter untuk UI/body.
- Gunakan foto makanan hangat, natural, dan konsisten.
- Utamakan keterbacaan harga, status stok, dan CTA.
- Buat pengalaman pemesanan mobile-first.
- Gunakan ornamen sudut emas dan garis bahari secara selektif.

### Don't
- Jangan memakai palet Corten/Bordeaux/Sandstone milik referensi Monte sebagai palet Rasanna Daeng.
- Jangan mengganti logo perahu dengan wordmark atau ilustrasi kopi generik.
- Jangan menggunakan warna neon atau pastel yang keluar dari palet bumi.
- Jangan menggunakan motif tribal/aksara palsu.
- Jangan menambahkan gradasi atau efek 3D baru pada logo.
- Jangan menggunakan Copper/Gold Sand untuk teks kecil di atas krem.
- Jangan membuat halaman customer seperti dashboard SaaS.
- Jangan mengorbankan fungsi tombol, validasi, dan feedback demi tampilan minimalis.
- Jangan memakai foto makanan generik seolah foto asli restoran tanpa persetujuan.
- Jangan membuat semua elemen penuh ornamen; warisan budaya harus terasa elegan dan terukur.

## 15. CSS Custom Properties

```css
:root {
  /* Rasanna Daeng brand palette */
  --color-redwood: #5B1F11;
  --color-copper: #B36633;
  --color-martinique: #323659;
  --color-kashmir-blue: #5474A1;
  --color-gold-sand: #E7BA80;

  /* Neutral palette */
  --color-warm-cream: #FBF6EE;
  --color-paper: #FFFDF9;
  --color-dark-brown: #3B1209;
  --color-body-text: #3F302A;
  --color-muted-text: #786B63;
  --color-border: #E5D9CC;

  /* Functional colors */
  --color-success: #2F6B45;
  --color-warning: #9A641C;
  --color-danger: #A33227;

  /* Typography */
  --font-display: "DM Serif Display", "Playfair Display", Georgia, serif;
  --font-body: "Inter", Arial, sans-serif;

  /* Type scale */
  --text-caption: 12px;
  --text-small: 13px;
  --text-body: 16px;
  --text-subheading: 20px;
  --text-heading-sm: 24px;
  --text-heading: 36px;
  --text-display: 48px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* Shape */
  --radius-card: 14px;
  --radius-panel: 14px;
  --radius-input: 12px;
  --radius-button: 9999px;
  --radius-badge: 9999px;

  /* Layout */
  --page-max-width: 1200px;
  --page-gutter-mobile: 16px;
  --page-gutter-tablet: 24px;
  --page-gutter-desktop: 32px;
  --section-gap: 64px;

  /* Surfaces */
  --surface-page: var(--color-warm-cream);
  --surface-card: var(--color-paper);
  --surface-brand: var(--color-redwood);
}
```

## 16. Tailwind Theme Reference

```css
@theme {
  --color-redwood: #5B1F11;
  --color-copper: #B36633;
  --color-martinique: #323659;
  --color-kashmir-blue: #5474A1;
  --color-gold-sand: #E7BA80;
  --color-warm-cream: #FBF6EE;
  --color-paper: #FFFDF9;
  --color-dark-brown: #3B1209;
  --color-body-text: #3F302A;
  --color-muted-text: #786B63;
  --color-border: #E5D9CC;

  --font-display: "DM Serif Display", "Playfair Display", Georgia, serif;
  --font-body: "Inter", Arial, sans-serif;

  --radius-card: 14px;
  --radius-panel: 14px;
  --radius-input: 12px;
  --radius-button: 9999px;
}
```

## 17. Agent Prompt Guide

Saat membuat atau mengubah UI Rasanna Daeng, ikuti aturan berikut:

1. Baca file ini dan `PRD.md` sebelum membuat halaman.
2. Gunakan logo SVG yang disediakan sebagai asset resmi.
3. Gunakan hanya token warna Rasanna Daeng pada bagian Color Tokens.
4. Jangan mengambil warna Monte dari file referensi; file Monte hanya menjadi acuan struktur dokumentasi, whitespace, serif editorial, pill CTA, dan gaya flat.
5. Pertahankan seluruh fungsi yang ditetapkan di PRD; jangan mengganti interaksi nyata dengan mockup statis.
6. Desain mobile-first dan uji pada viewport smartphone.
7. Customer UI harus hangat dan berorientasi makanan/pemesanan; admin UI harus efisien dan mudah dipindai.
8. Jangan membuat foto menu palsu yang diklaim sebagai foto restoran.
9. Jangan mengubah harga, nama, atau deskripsi menu tanpa sumber data/konfirmasi.
10. Setelah implementasi, perbarui `TASKS.md` hanya untuk pekerjaan yang benar-benar selesai.

### Example component prompts

**Hero:** “Buat hero mobile-first untuk Rasanna Daeng dengan latar Redwood `#5B1F11`, logo perahu layar asli, headline serif ‘Cita Rasa Otentik Anging Mammiri’, deskripsi singkat, foto makanan unggulan yang hangat, dan CTA kontras ‘Lihat Menu’. Gunakan aksen Copper dan Gold Sand secukupnya. Jangan gunakan ilustrasi kopi atau wordmark Monte.”

**Product card:** “Buat kartu menu dengan foto makanan natural, nama produk, deskripsi maksimal dua baris, harga tegas berwarna Redwood, status tersedia/habis, dan tombol tambah. Gunakan Paper, border tipis, radius 14px, dan tanpa shadow berat.”

**Checkout:** “Buat checkout satu kolom pada mobile. Kelompokkan ringkasan item, jenis layanan, nomor meja atau detail takeaway, metode pembayaran, dan total. Tampilkan validasi dan CTA yang jelas. Gunakan warna brand tanpa mengorbankan kontras.”

**Admin product form:** “Buat form admin untuk tambah/edit produk dengan nama, kategori, deskripsi, harga, stok/status, upload foto, preview, ganti, dan hapus foto. Tampilkan validasi file dan state penyimpanan.”

## 18. Source Alignment & Decisions

Dokumen ini mengadaptasi struktur dan beberapa pola dari Monte Style Reference, tetapi identitas warna, logo, motif, karakter, dan fotografi mengikuti `Design_Brief_Rasanna_Daeng.docx` serta SVG logo yang diberikan.

Hal yang masih perlu dikonfirmasi oleh pemilik:
- Font resmi brand jika tersedia; DM Serif Display dan Inter adalah rekomendasi implementasi web.
- Apakah tagline selalu ditampilkan atau hanya pada lockup logo utama.
- Foto asli untuk setiap produk.
- Varian final logo terbalik dan versi flat untuk latar Redwood.
- Apakah gaya visual final ingin lebih dekat ke keluarga santai atau semi-premium.

**Prioritas desain:** identitas Rasanna Daeng harus langsung dikenali, tetapi pelanggan tetap dapat memesan dengan cepat dan tanpa kebingungan.
