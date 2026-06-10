# Sistem Monitoring Kecelakaan Lalu Lintas - Lampung Selatan
# Backend API

## Teknologi
- **FastAPI** - Framework REST API
- **PostgreSQL + PostGIS** - Database spasial
- **SQLAlchemy + GeoAlchemy2** - ORM dengan dukungan geometri
- **Pydantic** - Validasi data

## Cara Menjalankan

### 1. Persiapan Environment

```bash
# Buat virtual environment
python -m venv venv

# Aktifkan (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Konfigurasi Database

```bash
# Copy file environment
copy .env.example .env

# Edit .env dan sesuaikan password PostgreSQL Anda
```

### 3. Setup Database PostGIS

Pastikan PostgreSQL + PostGIS sudah terinstall, lalu:

```bash
# Jalankan SQL setup secara berurutan di pgAdmin atau psql:
# 1. backend/database/01_setup_database.sql
# 2. backend/database/02_create_tables.sql  
# 3. backend/database/03_seed_kecamatan.sql
# 4. backend/database/04_seed_kecelakaan.sql
```

### 4. Jalankan Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Akses API

- **Swagger UI (Dokumentasi)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Endpoint API

| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/api/v1/kecamatan/geojson` | Semua kecamatan (GeoJSON) |
| GET | `/api/v1/kecamatan/` | Daftar kecamatan |
| POST | `/api/v1/kecamatan/` | Tambah kecamatan |
| PUT | `/api/v1/kecamatan/{id}` | Update kecamatan |
| DELETE | `/api/v1/kecamatan/{id}` | Hapus kecamatan |
| GET | `/api/v1/kecelakaan/geojson` | Semua kecelakaan (GeoJSON) |
| GET | `/api/v1/kecelakaan/` | Daftar kecelakaan |
| POST | `/api/v1/kecelakaan/` | Tambah kecelakaan |
| PUT | `/api/v1/kecelakaan/{id}` | Update kecelakaan |
| DELETE | `/api/v1/kecelakaan/{id}` | Hapus kecelakaan |
| GET | `/api/v1/kecelakaan/spasial/dalam-kecamatan/{id}` | **[ST_Within]** Kecelakaan dalam kecamatan |
| GET | `/api/v1/kecelakaan/spasial/black-spot` | **[ST_DWithin]** Black spot radius |
| GET | `/api/v1/korban/kecelakaan/{id}` | Korban per kejadian |
| POST | `/api/v1/korban/kecelakaan/{id}` | Tambah korban |
| GET | `/api/v1/statistik/per-kecamatan` | Statistik per kecamatan |
| GET | `/api/v1/statistik/ringkasan` | Ringkasan total |
| GET | `/api/v1/statistik/tren-bulanan` | Tren per bulan |
