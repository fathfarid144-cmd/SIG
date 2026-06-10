-- ============================================================
-- Setup Database PostGIS
-- Sistem Monitoring Kecelakaan Lalu Lintas - Lampung Selatan
-- ============================================================

-- Jalankan sebagai superuser postgres

-- 1. Buat database
CREATE DATABASE kecelakaan_lampsel_db;

-- 2. Connect ke database baru, lalu aktifkan ekstensi PostGIS
\c kecelakaan_lampsel_db

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verifikasi instalasi PostGIS
SELECT PostGIS_version();
