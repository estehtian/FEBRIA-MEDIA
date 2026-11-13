# FEBRIA MEDIA — Premium Futuristic Neon

Portal media statis untuk GitHub Pages. Dibuat dengan HTML, CSS, dan JavaScript murni.

## Struktur
- `index.html` — beranda
- `kategori.html` — kanal kategori melalui parameter URL
- `arsip.html` — daftar seluruh artikel
- `artikel/` — halaman detail artikel
- `tentang.html`, `kontak.html`, `pedoman-redaksi.html`, `kebijakan-privasi.html`
- `assets/css/style.css` — desain responsif neon
- `assets/js/data.js` — data artikel yang dapat diedit
- `assets/js/app.js` — navigasi, pencarian, filter, dan rendering artikel
- `404.html`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`

## Mengedit artikel
Edit `assets/js/data.js`. Setiap artikel memiliki `id`, `category`, `label`, `date`, `read`, `title`, `excerpt`, `body`, `art`, dan `source`.
Untuk artikel baru:
1. Tambahkan objek baru pada `window.FEBRIA_ARTICLES`.
2. Buat halaman `artikel/slug-artikel.html` dengan menyalin salah satu halaman artikel.
3. Gunakan kategori `update`, `business`, `tech`, atau `viral`.
4. Pastikan isi, tanggal, narasumber, dan tautan sumber sudah diverifikasi.

## Konfigurasi GitHub Pages
1. Ekstrak ZIP di komputer.
2. Buka repository `estehtian/FEBRIA-MEDIA`.
3. Buat cadangan file yang ada sebelum mengganti file.
4. Klik **Add file → Upload files**.
5. Upload isi folder `FEBRIA-MEDIA-PREMIUM` (bukan folder luarnya) ke root repository.
6. Jika GitHub menanyakan konflik file yang sudah ada, tinjau dan pilih penggantian untuk file versi baru yang memang ingin digunakan. Jangan hapus README atau file lain yang masih dibutuhkan.
7. Klik **Commit changes** ke branch `main`.
8. Buka **Settings → Pages**.
9. Pada **Build and deployment**, pilih **Deploy from a branch**.
10. Pilih branch `main` dan folder `/(root)`, lalu **Save**.
11. Tunggu deployment selesai pada tab **Actions**. Buka `https://estehtian.github.io/FEBRIA-MEDIA/`.
12. Jika tampilan lama masih muncul, tekan `Ctrl + F5`.

## Penting
- Website ini statis dan cocok untuk GitHub Pages; tidak membutuhkan Node.js, database, atau build command.
- Dashboard admin, login penulis, upload gambar, dan penyimpanan artikel dari browser belum termasuk. Untuk fitur tersebut dibutuhkan backend/CMS (misalnya Supabase) dan konfigurasi kunci rahasia yang tidak boleh dimasukkan ke file publik.
- Email `hello@febriamedia.id` adalah contoh; ganti dengan alamat resmi sebelum publikasi.
- Artikel awal merupakan contoh edukasi/demonstrasi, bukan berita aktual terverifikasi. Perbarui sebelum dipublikasikan.
- Google Fonts memerlukan koneksi internet; jika font eksternal tidak tersedia, font fallback tetap digunakan.
- URL sitemap dan robots saat ini disetel untuk alamat GitHub Pages di atas. Sesuaikan jika domain khusus digunakan.
