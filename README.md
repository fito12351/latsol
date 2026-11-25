# latsol — Aplikasi CBT Latihan Soal PSAS 1 XII MIPA (2025/2026)

Aplikasi latihan soal dan simulasi CBT lintas platform (**Android APK + iOS PWA / Xcode**) yang bersumber langsung dari lembar soal **PSAS 1 Tahun Pelajaran 2025/2026 SMA Negeri 6 Purworejo (Kelas XII MIPA)**.

## Isi Bank Soal (515 Soal + 58 Gambar Diagram)
- **MIPA**: Matematika (30 PG + 5 Uraian), Fisika (35 PG + 5 Esai), Kimia (35 PG + 5 Uraian), Biologi (35 PG + 5 Uraian)
- **Bahasa**: Bahasa Indonesia (40 PG + 5 Esai), Bahasa Inggris (40 PG + 5 Esai), Bahasa Jawa (40 PG + 5 Uraian)
- **Umum**: Sejarah (40 PG + 5 Uraian), PKN (40 PG + 5 Uraian), PKWU (40 PG + 5 Uraian), PJOK (40 PG + 5 Uraian), Seni Rupa (40 PG + 5 Uraian)

## Cara Install di Android
1. Kirim file `latsol-psas-mipa-2526.apk` ke HP Android (lewat USB, WhatsApp, atau Google Drive).
2. Ketuk file APK dan izinkan pemasangan dari sumber tidak dikenal (*Install unknown apps*).
3. Aplikasi berjalan **100% offline** — seluruh 515 soal, 58 gambar diagram, font, kunci jawaban, dan pembahasan sudah tertanam di dalam APK.

## Cara Install di iOS (iPhone / iPad)
Ada dua pilihan untuk iOS:
1. **Paling Praktis (PWA Native Fullscreen di Safari — Gratis, tanpa Mac/Xcode)**:
   - Upload folder `dist/` ke hosting statis gratis seperti **Netlify Drop** (`app.netlify.com/drop`), **Cloudflare Pages**, atau **Vercel**.
   - Buka URL-nya di **Safari iPhone/iPad** -> tekan tombol **Share** (`↑`) -> pilih **Add to Home Screen**.
   - Ikon maskot `latsol` akan muncul di layar utama dan berjalan **fullscreen native serta 100% offline** setelah dibuka sekali.
2. **Build Native `.ipa` di macOS**:
   - Buka folder `ios/App/App.xcworkspace` di **Xcode** pada Mac, pilih Apple Developer Team, lalu jalankan ke iPhone/iPad.
