# FEBRIA MEDIA — Dashboard Admin Berita

Dashboard tersedia di `/admin/`. Website publik yang sudah ada tidak dihapus atau diganti. Dashboard memakai Supabase Auth, Database, dan Storage.

## Fitur yang disediakan
- Login admin/editor/penulis menggunakan Supabase Auth.
- Tambah, edit, dan hapus naskah.
- Kategori Update, Business, Technology, Viral Fact.
- Upload gambar JPG/PNG/WebP maksimal 5 MB ke bucket `news-media`.
- Draft dan pengajuan persetujuan.
- Antrian review; hanya role editor/admin yang dapat menyetujui atau menolak.
- Penjadwalan waktu publikasi disimpan pada `scheduled_at`.
- Field SEO title, meta description, slug, sumber, penulis, dan excerpt.
- Statistik jumlah naskah, terbit, menunggu review, dan total view_count.
- Row Level Security (RLS) untuk membatasi akses database.

## Instalasi Supabase
1. Buat project di Supabase.
2. Buka **SQL Editor** → **New query**.
3. Salin seluruh isi `supabase/schema.sql`, lalu jalankan.
4. Buka **Project Settings → API**. Salin **Project URL** dan **anon/public key**.
5. Edit `assets/js/supabase-config.js`; ganti `YOUR-PROJECT-REF` dan `YOUR_SUPABASE_ANON_PUBLIC_KEY`.
6. Commit file tersebut ke GitHub. Jangan pernah menaruh `service_role key`, password database, atau secret key di website.
7. Di Supabase **Authentication → Users**, buat pengguna pertama (email dan password admin). Nonaktifkan sign-up publik jika tidak diperlukan.
8. Setelah pengguna dibuat, kembali ke SQL Editor dan jalankan:
   `update public.profiles set role='admin' where email='EMAIL_ADMIN_ANDA';`
9. Untuk editor, buat akun Auth lalu jalankan:
   `update public.profiles set role='editor' where email='EMAIL_EDITOR';`
10. Buka `https://estehtian.github.io/FEBRIA-MEDIA/admin/` lalu login.

## Alur kerja redaksi
- Penulis menyimpan berita sebagai **Draft** atau mengirim sebagai **Menunggu review**.
- Editor/Admin membuka menu **Persetujuan**, memeriksa naskah, lalu menyetujui atau menolak.
- Status persetujuan dan jadwal disimpan di database.
- Hak publikasi tetap dibatasi oleh kebijakan RLS. Jangan membagikan akun admin.

## Catatan penting sebelum operasional penuh
- File konfigurasi Supabase masih berupa placeholder sampai URL dan anon key project milik Anda diisi.
- Dashboard sudah dirancang untuk mengelola data Supabase. Homepage FEBRIA MEDIA yang sekarang masih memakai `assets/js/data.js`; sambungan feed publik dari tabel Supabase perlu diaktifkan agar berita yang diterbitkan dashboard otomatis muncul di homepage dan halaman detail. Jangan menghapus data demo sebelum migrasi dan pengujian selesai.
- Field jadwal sudah disimpan, tetapi pemrosesan otomatis pada waktu tertentu memerlukan Supabase Cron/Edge Function atau layanan scheduler yang dijadwalkan. Tanpa itu, jadwal hanya tersimpan dan tidak otomatis berubah menjadi published.
- Statistik pembaca menghitung nilai `view_count` di database. Pelacakan dari halaman artikel publik harus dihubungkan ke fungsi `increment_article_view` sebelum angka mencerminkan trafik sebenarnya.
- Gunakan HTTPS dan uji dengan akun author/editor/admin terpisah sebelum mengundang tim.

## Alamat
- Website: https://estehtian.github.io/FEBRIA-MEDIA/
- Dashboard: https://estehtian.github.io/FEBRIA-MEDIA/admin/


## Integrasi website publik (sudah ditambahkan ke repository)
- Homepage, halaman kategori, dan arsip memuat artikel berstatus `published` dari Supabase; artikel lama di `data.js` tetap menjadi konten fallback.
- Halaman detail dinamis tersedia di `artikel/baca.html?slug=SLUG`.
- Setelah editor menyetujui berita tanpa jadwal masa depan, status berubah menjadi `published` dan berita dapat tampil di website.
- Jika tanggal publikasi berada di masa depan, persetujuan mengubah status menjadi `approved`; artikel baru tampil setelah scheduler menerbitkannya.

## Aktifkan publikasi otomatis terjadwal
1. Jalankan `supabase/scheduled-publishing.sql` di SQL Editor.
2. Di Supabase, aktifkan extension `pg_cron` melalui Database → Extensions (jika tersedia pada project).
3. Jalankan blok `cron.schedule` yang dikomentari di bagian bawah file SQL.
4. Periksa job dengan `select * from cron.job;`. Uji dahulu memakai satu berita uji dengan jadwal beberapa menit ke depan.
5. Pastikan status berita adalah `approved`; scheduler tidak menerbitkan draft atau berita pending.
