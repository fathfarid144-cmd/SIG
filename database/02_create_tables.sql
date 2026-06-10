-- ============================================================
-- DDL: Buat Tabel + Spatial Index
-- Sistem Monitoring Kecelakaan Lalu Lintas - Lampung Selatan
-- ============================================================
-- SRID: EPSG:4326 (WGS84 - longitude/latitude)
-- ============================================================

-- ─── Enum Types ───────────────────────────────────────────────

CREATE TYPE kondisi_jalan_enum AS ENUM ('Baik', 'Sedang', 'Rusak', 'Rusak Berat');
CREATE TYPE cuaca_enum AS ENUM ('Cerah', 'Berawan', 'Hujan', 'Kabut');
CREATE TYPE jenis_kendaraan_enum AS ENUM ('Sepeda Motor', 'Mobil', 'Truk', 'Bus', 'Lainnya');
CREATE TYPE kondisi_korban_enum AS ENUM ('Meninggal Dunia', 'Luka Berat', 'Luka Ringan');


-- ─── Tabel 1: Kecamatan (Polygon) ────────────────────────────

CREATE TABLE IF NOT EXISTS kecamatan (
    id                SERIAL PRIMARY KEY,
    nama              VARCHAR(100) NOT NULL UNIQUE,
    kode_kecamatan    VARCHAR(20) UNIQUE,
    luas_km2          FLOAT,
    jumlah_penduduk   INTEGER,
    keterangan        TEXT,
    geom              GEOMETRY(POLYGON, 4326) NOT NULL,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ
);

-- Spatial Index GiST pada kolom geom kecamatan
CREATE INDEX IF NOT EXISTS idx_kecamatan_geom ON kecamatan USING GIST (geom);


-- ─── Tabel 2: Titik Kecelakaan (Point) ───────────────────────

CREATE TABLE IF NOT EXISTS titik_kecelakaan (
    id                      SERIAL PRIMARY KEY,
    tanggal_kejadian        TIMESTAMPTZ NOT NULL,
    lokasi_nama             VARCHAR(255) NOT NULL,
    nama_jalan              VARCHAR(255),
    kondisi_jalan           kondisi_jalan_enum DEFAULT 'Baik',
    cuaca                   cuaca_enum DEFAULT 'Cerah',
    jenis_kendaraan         jenis_kendaraan_enum,
    jumlah_kendaraan        INTEGER DEFAULT 1,
    kecepatan_perkiraan     FLOAT,
    penyebab                TEXT,
    keterangan              TEXT,
    kecamatan_id            INTEGER REFERENCES kecamatan(id) ON DELETE SET NULL,
    geom                    GEOMETRY(POINT, 4326) NOT NULL,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ
);

-- Spatial Index GiST pada kolom geom titik_kecelakaan
CREATE INDEX IF NOT EXISTS idx_titik_kecelakaan_geom ON titik_kecelakaan USING GIST (geom);
-- Index tambahan untuk query filter
CREATE INDEX IF NOT EXISTS idx_titik_kecelakaan_tanggal ON titik_kecelakaan (tanggal_kejadian);
CREATE INDEX IF NOT EXISTS idx_titik_kecelakaan_kecamatan ON titik_kecelakaan (kecamatan_id);


-- ─── Tabel 3: Korban Kecelakaan ──────────────────────────────

CREATE TABLE IF NOT EXISTS korban_kecelakaan (
    id                  SERIAL PRIMARY KEY,
    kecelakaan_id       INTEGER NOT NULL REFERENCES titik_kecelakaan(id) ON DELETE CASCADE,
    nama_korban         VARCHAR(150),
    usia                INTEGER CHECK (usia >= 0 AND usia <= 120),
    jenis_kelamin       VARCHAR(20) CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
    kondisi             kondisi_korban_enum NOT NULL,
    keterangan_luka     TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query JOIN ke titik_kecelakaan
CREATE INDEX IF NOT EXISTS idx_korban_kecelakaan_id ON korban_kecelakaan (kecelakaan_id);

-- ─── View: Statistik per Kecamatan ───────────────────────────
-- View ini membantu query dashboard tanpa menghitung ulang setiap kali

CREATE OR REPLACE VIEW v_statistik_kecamatan AS
SELECT
    kc.id AS kecamatan_id,
    kc.nama AS nama_kecamatan,
    COUNT(DISTINCT tk.id) AS total_kecelakaan,
    COUNT(CASE WHEN kor.kondisi = 'Meninggal Dunia' THEN 1 END) AS total_meninggal,
    COUNT(CASE WHEN kor.kondisi = 'Luka Berat' THEN 1 END) AS total_luka_berat,
    COUNT(CASE WHEN kor.kondisi = 'Luka Ringan' THEN 1 END) AS total_luka_ringan,
    COUNT(kor.id) AS total_korban
FROM kecamatan kc
LEFT JOIN titik_kecelakaan tk ON tk.kecamatan_id = kc.id
LEFT JOIN korban_kecelakaan kor ON kor.kecelakaan_id = tk.id
GROUP BY kc.id, kc.nama
ORDER BY total_kecelakaan DESC;
