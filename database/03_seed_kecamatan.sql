-- ============================================================
-- Seed Data: Kecamatan Lampung Selatan (17 Kecamatan)
-- Sistem Monitoring Kecelakaan Lalu Lintas
-- ============================================================
-- Koordinat polygon adalah PERKIRAAN batas wilayah kecamatan
-- Untuk produksi, gunakan data shapefile resmi dari BPS/BIG
-- SRID: EPSG:4326 (WGS84)
-- ============================================================

INSERT INTO kecamatan (nama, kode_kecamatan, luas_km2, jumlah_penduduk, geom) VALUES

('Natar', '18.01.01', 252.40, 190000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.10 -5.55, 105.25 -5.55, 105.25 -5.70, 105.10 -5.70, 105.10 -5.55))'), 4326)),

('Jati Agung', '18.01.02', 163.14, 120000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.25 -5.55, 105.40 -5.55, 105.40 -5.68, 105.25 -5.68, 105.25 -5.55))'), 4326)),

('Tanjung Bintang', '18.01.03', 129.72, 95000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.40 -5.55, 105.55 -5.55, 105.55 -5.68, 105.40 -5.68, 105.40 -5.55))'), 4326)),

('Tanjung Sari', '18.01.04', 118.54, 55000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.55 -5.55, 105.68 -5.55, 105.68 -5.68, 105.55 -5.68, 105.55 -5.55))'), 4326)),

('Katibung', '18.01.05', 206.45, 98000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.25 -5.70, 105.45 -5.70, 105.45 -5.85, 105.25 -5.85, 105.25 -5.70))'), 4326)),

('Merbau Mataram', '18.01.06', 149.28, 62000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.45 -5.68, 105.60 -5.68, 105.60 -5.82, 105.45 -5.82, 105.45 -5.68))'), 4326)),

('Way Sulan', '18.01.07', 64.38, 31000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.60 -5.68, 105.72 -5.68, 105.72 -5.80, 105.60 -5.80, 105.60 -5.68))'), 4326)),

('Sidomulyo', '18.01.08', 209.62, 115000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.25 -5.85, 105.45 -5.85, 105.45 -6.00, 105.25 -6.00, 105.25 -5.85))'), 4326)),

('Candipuro', '18.01.09', 181.18, 75000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.45 -5.82, 105.62 -5.82, 105.62 -5.97, 105.45 -5.97, 105.45 -5.82))'), 4326)),

('Way Panji', '18.01.10', 38.30, 28000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.55 -5.80, 105.65 -5.80, 105.65 -5.90, 105.55 -5.90, 105.55 -5.80))'), 4326)),

('Kalianda', '18.01.11', 164.22, 88000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.33 -5.70, 105.55 -5.70, 105.55 -5.88, 105.33 -5.88, 105.33 -5.70))'), 4326)),

('Rajabasa', '18.01.12', 104.89, 42000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.55 -5.70, 105.72 -5.70, 105.72 -5.83, 105.55 -5.83, 105.55 -5.70))'), 4326)),

('Palas', '18.01.13', 131.88, 58000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.62 -5.85, 105.80 -5.85, 105.80 -5.98, 105.62 -5.98, 105.62 -5.85))'), 4326)),

('Sragi', '18.01.14', 81.56, 35000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.72 -5.70, 105.85 -5.70, 105.85 -5.83, 105.72 -5.83, 105.72 -5.70))'), 4326)),

('Penengahan', '18.01.15', 149.15, 67000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.10 -5.85, 105.30 -5.85, 105.30 -6.00, 105.10 -6.00, 105.10 -5.85))'), 4326)),

('Ketapang', '18.01.16', 133.72, 48000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.80 -5.70, 105.95 -5.70, 105.95 -5.85, 105.80 -5.85, 105.80 -5.70))'), 4326)),

('Bakauheni', '18.01.17', 55.37, 25000,
  ST_SetSRID(ST_GeomFromText('POLYGON((105.80 -5.85, 105.95 -5.85, 105.95 -6.00, 105.80 -6.00, 105.80 -5.85))'), 4326));

-- Verifikasi
SELECT id, nama, kode_kecamatan, luas_km2 FROM kecamatan ORDER BY id;
