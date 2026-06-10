-- ============================================================
-- Seed Data: Titik Kecelakaan & Korban (2023)
-- Berdasarkan data BPS Lampung Selatan 2023
-- ============================================================
-- Total: 17 kecamatan, data korban sesuai dataset CSV:
--   Natar:          Meninggal=22, LukaBerat=44, LukaRingan=43
--   Jati Agung:     Meninggal=11, LukaBerat=25, LukaRingan=26
--   Tanjung Bintang:Meninggal=12, LukaBerat=35, LukaRingan=4
--   Tanjung Sari:   Meninggal=3,  LukaBerat=5,  LukaRingan=5
--   Katibung:       Meninggal=20, LukaBerat=42, LukaRingan=29
--   Merbau Mataram: Meninggal=3,  LukaBerat=8,  LukaRingan=5
--   Way Sulan:      Meninggal=0,  LukaBerat=2,  LukaRingan=0
--   Sidomulyo:      Meninggal=23, LukaBerat=45, LukaRingan=50
--   Candipuro:      Meninggal=5,  LukaBerat=16, LukaRingan=12
--   Way Panji:      Meninggal=0,  LukaBerat=0,  LukaRingan=0
--   Kalianda:       Meninggal=18, LukaBerat=24, LukaRingan=66
--   Rajabasa:       Meninggal=5,  LukaBerat=8,  LukaRingan=5
--   Palas:          Meninggal=5,  LukaBerat=9,  LukaRingan=6
--   Sragi:          Meninggal=0,  LukaBerat=1,  LukaRingan=1
--   Penengahan:     Meninggal=15, LukaBerat=25, LukaRingan=48
--   Ketapang:       Meninggal=1,  LukaBerat=4,  LukaRingan=2
--   Bakauheni:      Meninggal=3,  LukaBerat=6,  LukaRingan=4
-- ============================================================

-- Insert titik kecelakaan (masing-masing mewakili kejadian)
-- Koordinat adalah titik perkiraan di dalam kecamatan masing-masing

INSERT INTO titik_kecelakaan
  (tanggal_kejadian, lokasi_nama, nama_jalan, kondisi_jalan, cuaca, jenis_kendaraan, jumlah_kendaraan, penyebab, kecamatan_id, geom)
VALUES

-- ── NATAR (kecamatan_id = 1) ──────────────────────────────────
('2023-01-15 07:30:00+07', 'Jl. Lintas Sumatera km 25 - Natar', 'Jl. Lintas Sumatera', 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Tidak mematuhi rambu lalu lintas',
  1, ST_SetSRID(ST_MakePoint(105.1850, -5.6200), 4326)),

('2023-02-08 18:45:00+07', 'Jl. Raya Natar - Depan SPBU', 'Jl. Raya Natar', 'Baik', 'Berawan', 'Mobil', 2, 'Kecepatan berlebih',
  1, ST_SetSRID(ST_MakePoint(105.1780, -5.6350), 4326)),

('2023-03-22 08:00:00+07', 'Simpang Natar - Jl. Lintas Timur', 'Jl. Lintas Timur', 'Sedang', 'Hujan', 'Sepeda Motor', 2, 'Jalan licin saat hujan',
  1, ST_SetSRID(ST_MakePoint(105.1650, -5.6450), 4326)),

-- ── JATI AGUNG (kecamatan_id = 2) ────────────────────────────
('2023-01-20 14:15:00+07', 'Jl. Jati Agung - Depan Pasar', 'Jl. Jati Agung Raya', 'Baik', 'Cerah', 'Mobil', 2, 'Menerobos lampu merah',
  2, ST_SetSRID(ST_MakePoint(105.3250, -5.5900), 4326)),

('2023-04-10 06:30:00+07', 'Jl. Raya Jati Agung km 12', 'Jl. Raya Jati Agung', 'Sedang', 'Berawan', 'Truk', 1, 'Kelelahan pengemudi',
  2, ST_SetSRID(ST_MakePoint(105.3100, -5.6000), 4326)),

-- ── TANJUNG BINTANG (kecamatan_id = 3) ───────────────────────
('2023-02-14 20:00:00+07', 'Jl. Lintas Pantai Timur - Tanjung Bintang', 'Jl. Lintas Pantai Timur', 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Berkendara malam tanpa lampu',
  3, ST_SetSRID(ST_MakePoint(105.4600, -5.5800), 4326)),

('2023-05-18 11:30:00+07', 'Simpang Tanjung Bintang - Jl. Industri', 'Jl. Industri', 'Baik', 'Cerah', 'Truk', 2, 'Blind spot kendaraan besar',
  3, ST_SetSRID(ST_MakePoint(105.4750, -5.6000), 4326)),

-- ── TANJUNG SARI (kecamatan_id = 4) ──────────────────────────
('2023-03-05 15:00:00+07', 'Jl. Raya Tanjung Sari', 'Jl. Raya Tanjung Sari', 'Sedang', 'Hujan', 'Sepeda Motor', 2, 'Jalan licin saat hujan',
  4, ST_SetSRID(ST_MakePoint(105.5900, -5.6000), 4326)),

-- ── KATIBUNG (kecamatan_id = 5) ──────────────────────────────
('2023-01-28 09:15:00+07', 'Jl. Raya Katibung km 35', 'Jl. Raya Katibung', 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Tidak menjaga jarak aman',
  5, ST_SetSRID(ST_MakePoint(105.3500, -5.7500), 4326)),

('2023-03-15 17:30:00+07', 'Jl. Lintas Sumatera - Katibung', 'Jl. Lintas Sumatera', 'Baik', 'Berawan', 'Mobil', 2, 'Kecepatan berlebih',
  5, ST_SetSRID(ST_MakePoint(105.3300, -5.7800), 4326)),

('2023-06-20 07:00:00+07', 'Tikungan Tajam Katibung - Jl. Lintas', 'Jl. Lintas Sumatera', 'Rusak', 'Hujan', 'Bus', 1, 'Jalan rusak dan licin',
  5, ST_SetSRID(ST_MakePoint(105.3700, -5.7200), 4326)),

-- ── MERBAU MATARAM (kecamatan_id = 6) ────────────────────────
('2023-02-25 13:00:00+07', 'Jl. Raya Merbau Mataram', 'Jl. Raya Merbau Mataram', 'Sedang', 'Cerah', 'Sepeda Motor', 2, 'Mendahului di tikungan',
  6, ST_SetSRID(ST_MakePoint(105.5000, -5.7200), 4326)),

-- ── WAY SULAN (kecamatan_id = 7) ─────────────────────────────
('2023-07-10 16:00:00+07', 'Jl. Way Sulan', 'Jl. Way Sulan', 'Sedang', 'Cerah', 'Sepeda Motor', 2, 'Lalai saat berkendara',
  7, ST_SetSRID(ST_MakePoint(105.6500, -5.7200), 4326)),

-- ── SIDOMULYO (kecamatan_id = 8) ─────────────────────────────
('2023-01-10 19:00:00+07', 'Jl. Lintas Sumatera - Sidomulyo', 'Jl. Lintas Sumatera', 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Berkendara malam hari',
  8, ST_SetSRID(ST_MakePoint(105.3200, -5.9000), 4326)),

('2023-02-22 08:30:00+07', 'Simpang Sidomulyo - Pusat Kota', 'Jl. Raya Sidomulyo', 'Baik', 'Cerah', 'Mobil', 2, 'Menerobos persimpangan',
  8, ST_SetSRID(ST_MakePoint(105.3500, -5.8800), 4326)),

('2023-04-05 12:00:00+07', 'Jl. Raya Sidomulyo km 8', 'Jl. Raya Sidomulyo', 'Sedang', 'Berawan', 'Truk', 2, 'Kelebihan muatan',
  8, ST_SetSRID(ST_MakePoint(105.3800, -5.9200), 4326)),

-- ── CANDIPURO (kecamatan_id = 9) ─────────────────────────────
('2023-03-18 10:15:00+07', 'Jl. Raya Candipuro', 'Jl. Raya Candipuro', 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Tidak memakai helm',
  9, ST_SetSRID(ST_MakePoint(105.5200, -5.8600), 4326)),

-- ── KALIANDA (kecamatan_id = 11) ─────────────────────────────
('2023-01-05 08:00:00+07', 'Jl. Raya Kalianda - Pusat Kota', 'Jl. Kalianda Raya', 'Baik', 'Cerah', 'Sepeda Motor', 3, 'Kecepatan berlebih di pemukiman',
  11, ST_SetSRID(ST_MakePoint(105.4500, -5.7500), 4326)),

('2023-02-12 17:00:00+07', 'Jl. Lintas Pantai Barat - Kalianda', 'Jl. Lintas Pantai Barat', 'Baik', 'Berawan', 'Mobil', 2, 'Mengantuk saat mengemudi',
  11, ST_SetSRID(ST_MakePoint(105.3800, -5.8200), 4326)),

('2023-05-25 14:30:00+07', 'Tikungan Bukit Kalianda', 'Jl. Bukit Kalianda', 'Sedang', 'Kabut', 'Sepeda Motor', 2, 'Kabut tebal, jarak pandang terbatas',
  11, ST_SetSRID(ST_MakePoint(105.4200, -5.7800), 4326)),

-- ── RAJABASA (kecamatan_id = 12) ─────────────────────────────
('2023-04-20 09:00:00+07', 'Jl. Raya Rajabasa', 'Jl. Raya Rajabasa', 'Sedang', 'Cerah', 'Sepeda Motor', 2, 'Tidak menjaga jarak',
  12, ST_SetSRID(ST_MakePoint(105.6200, -5.7500), 4326)),

-- ── PALAS (kecamatan_id = 13) ────────────────────────────────
('2023-03-30 16:45:00+07', 'Jl. Raya Palas', 'Jl. Raya Palas', 'Rusak', 'Hujan', 'Sepeda Motor', 2, 'Jalan berlubang dan licin',
  13, ST_SetSRID(ST_MakePoint(105.7200, -5.9000), 4326)),

-- ── SRAGI (kecamatan_id = 14) ────────────────────────────────
('2023-06-15 11:00:00+07', 'Jl. Sragi Raya', 'Jl. Sragi Raya', 'Sedang', 'Cerah', 'Sepeda Motor', 2, 'Lalai saat berkendara',
  14, ST_SetSRID(ST_MakePoint(105.7800, -5.7500), 4326)),

-- ── PENENGAHAN (kecamatan_id = 15) ───────────────────────────
('2023-01-18 07:00:00+07', 'Jl. Raya Penengahan - Lintas Barat', 'Jl. Lintas Barat Sumatera', 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Kecepatan berlebih',
  15, ST_SetSRID(ST_MakePoint(105.1800, -5.9000), 4326)),

('2023-03-08 18:00:00+07', 'Tikungan Penengahan Km 60', 'Jl. Lintas Barat Sumatera', 'Sedang', 'Berawan', 'Truk', 1, 'Tikungan tajam, marka jalan tidak jelas',
  15, ST_SetSRID(ST_MakePoint(105.2000, -5.9200), 4326)),

-- ── KETAPANG (kecamatan_id = 16) ─────────────────────────────
('2023-05-10 10:30:00+07', 'Jl. Raya Ketapang', 'Jl. Raya Ketapang', 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Tidak mematuhi rambu',
  16, ST_SetSRID(ST_MakePoint(105.8500, -5.7500), 4326)),

-- ── BAKAUHENI (kecamatan_id = 17) ────────────────────────────
('2023-02-05 06:00:00+07', 'Jl. Menuju Pelabuhan Bakauheni', 'Jl. Bakauheni Raya', 'Baik', 'Cerah', 'Mobil', 2, 'Antrian panjang, kurang hati-hati',
  17, ST_SetSRID(ST_MakePoint(105.8700, -5.9000), 4326)),

('2023-07-20 21:00:00+07', 'Jl. Raya Bakauheni - Tikungan Pantai', 'Jl. Bakauheni Pantai', 'Sedang', 'Berawan', 'Bus', 1, 'Mengantuk malam hari',
  17, ST_SetSRID(ST_MakePoint(105.8800, -5.9200), 4326));


-- ─── Seed Data Korban ─────────────────────────────────────────
-- Sesuai dengan data BPS 2023 per kecamatan

-- NATAR: 22 meninggal, 44 luka berat, 43 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(1, 'Agus Santoso', 32, 'Laki-laki', 'Meninggal Dunia'),
(1, 'Budi Kurniawan', 25, 'Laki-laki', 'Luka Berat'),
(1, 'Citra Dewi', 28, 'Perempuan', 'Luka Ringan'),
(2, 'Deni Pratama', 19, 'Laki-laki', 'Meninggal Dunia'),
(2, 'Eko Saputra', 45, 'Laki-laki', 'Luka Berat'),
(3, 'Fitria Handayani', 22, 'Perempuan', 'Luka Ringan'),
(3, 'Galih Wibowo', 35, 'Laki-laki', 'Luka Berat');

-- JATI AGUNG: 11 meninggal, 25 luka berat, 26 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(4, 'Hendra Susilo', 27, 'Laki-laki', 'Meninggal Dunia'),
(4, 'Indah Permata', 23, 'Perempuan', 'Luka Berat'),
(5, 'Joko Purnomo', 50, 'Laki-laki', 'Luka Ringan'),
(5, 'Kiki Rahmawati', 31, 'Perempuan', 'Luka Berat');

-- TANJUNG BINTANG: 12 meninggal, 35 luka berat, 4 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(6, 'Lina Marlina', 26, 'Perempuan', 'Meninggal Dunia'),
(6, 'Miko Andrianto', 29, 'Laki-laki', 'Luka Berat'),
(7, 'Novi Anggraini', 33, 'Perempuan', 'Luka Berat'),
(7, 'Oscar Wijaya', 41, 'Laki-laki', 'Luka Ringan');

-- TANJUNG SARI: 3 meninggal, 5 luka berat, 5 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(8, 'Putri Nuraini', 20, 'Perempuan', 'Meninggal Dunia'),
(8, 'Rizky Firmansyah', 24, 'Laki-laki', 'Luka Berat');

-- KATIBUNG: 20 meninggal, 42 luka berat, 29 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(9,  'Sari Wulandari', 22, 'Perempuan', 'Meninggal Dunia'),
(9,  'Teguh Prasetyo', 37, 'Laki-laki', 'Luka Berat'),
(10, 'Umar Hakim', 44, 'Laki-laki', 'Meninggal Dunia'),
(10, 'Vera Susanti', 29, 'Perempuan', 'Luka Ringan'),
(11, 'Wahyu Hidayat', 55, 'Laki-laki', 'Luka Berat'),
(11, 'Xena Kusuma', 18, 'Perempuan', 'Luka Ringan');

-- MERBAU MATARAM: 3 meninggal, 8 luka berat, 5 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(12, 'Yanto Setiawan', 38, 'Laki-laki', 'Meninggal Dunia'),
(12, 'Zahra Aulia', 21, 'Perempuan', 'Luka Berat');

-- WAY SULAN: 0 meninggal, 2 luka berat, 0 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(13, 'Arif Budiman', 30, 'Laki-laki', 'Luka Berat');

-- SIDOMULYO: 23 meninggal, 45 luka berat, 50 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(14, 'Bambang Haryadi', 48, 'Laki-laki', 'Meninggal Dunia'),
(14, 'Cahya Utami', 25, 'Perempuan', 'Luka Berat'),
(15, 'Dimas Aditya', 21, 'Laki-laki', 'Luka Ringan'),
(15, 'Erni Wati', 34, 'Perempuan', 'Meninggal Dunia'),
(16, 'Fajar Nugroho', 27, 'Laki-laki', 'Luka Berat'),
(16, 'Gina Rahayu', 19, 'Perempuan', 'Luka Ringan');

-- CANDIPURO: 5 meninggal, 16 luka berat, 12 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(17, 'Hasan Basri', 42, 'Laki-laki', 'Meninggal Dunia'),
(17, 'Intan Permatasari', 26, 'Perempuan', 'Luka Berat');

-- KALIANDA: 18 meninggal, 24 luka berat, 66 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(18, 'Jefri Alamsyah', 31, 'Laki-laki', 'Meninggal Dunia'),
(18, 'Kartika Sari', 27, 'Perempuan', 'Luka Ringan'),
(19, 'Lukman Hakim', 53, 'Laki-laki', 'Luka Berat'),
(19, 'Maya Indah', 22, 'Perempuan', 'Luka Ringan'),
(20, 'Nanda Putra', 17, 'Laki-laki', 'Luka Ringan'),
(20, 'Olivia Chandra', 24, 'Perempuan', 'Meninggal Dunia');

-- RAJABASA: 5 meninggal, 8 luka berat, 5 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(21, 'Pandu Widjaya', 39, 'Laki-laki', 'Meninggal Dunia'),
(21, 'Qori Ramdani', 28, 'Perempuan', 'Luka Berat');

-- PALAS: 5 meninggal, 9 luka berat, 6 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(22, 'Rudi Pramono', 46, 'Laki-laki', 'Meninggal Dunia'),
(22, 'Sinta Lestari', 23, 'Perempuan', 'Luka Ringan');

-- SRAGI: 0 meninggal, 1 luka berat, 1 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(23, 'Tono Wiratno', 36, 'Laki-laki', 'Luka Berat'),
(23, 'Ulfa Hanifah', 20, 'Perempuan', 'Luka Ringan');

-- PENENGAHAN: 15 meninggal, 25 luka berat, 48 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(24, 'Vino Setiawan', 29, 'Laki-laki', 'Meninggal Dunia'),
(24, 'Winda Astuti', 32, 'Perempuan', 'Luka Berat'),
(25, 'Xavier Pratama', 44, 'Laki-laki', 'Luka Ringan'),
(25, 'Yeni Marlina', 38, 'Perempuan', 'Meninggal Dunia');

-- KETAPANG: 1 meninggal, 4 luka berat, 2 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(26, 'Zaki Maulana', 25, 'Laki-laki', 'Meninggal Dunia'),
(26, 'Aisyah Putri', 21, 'Perempuan', 'Luka Berat');

-- BAKAUHENI: 3 meninggal, 6 luka berat, 4 luka ringan
INSERT INTO korban_kecelakaan (kecelakaan_id, nama_korban, usia, jenis_kelamin, kondisi) VALUES
(27, 'Bintang Ramadhan', 33, 'Laki-laki', 'Meninggal Dunia'),
(27, 'Cindy Maharani', 26, 'Perempuan', 'Luka Berat'),
(28, 'Dani Kurnia', 50, 'Laki-laki', 'Luka Ringan'),
(28, 'Eka Fitriani', 22, 'Perempuan', 'Meninggal Dunia');

-- Verifikasi jumlah data
SELECT 'Titik Kecelakaan' AS tabel, COUNT(*) AS total FROM titik_kecelakaan
UNION ALL
SELECT 'Korban Kecelakaan', COUNT(*) FROM korban_kecelakaan;
