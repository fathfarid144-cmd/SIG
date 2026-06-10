"""
Entry point FastAPI - Sistem Monitoring Kecelakaan Lalu Lintas
Kabupaten Lampung Selatan
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import engine, Base
from app.routers import kecamatan, kecelakaan, korban, statistik

# ─── Inisialisasi ─────────────────────────────────────────────────────────────

settings = get_settings()

# Buat semua tabel jika belum ada
Base.metadata.create_all(bind=engine)

# ─── Buat aplikasi FastAPI ────────────────────────────────────────────────────

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    ## Sistem Monitoring Kecelakaan Lalu Lintas - Kabupaten Lampung Selatan

    REST API untuk WebGIS monitoring kecelakaan lalu lintas.
    Studi kasus T2 - Panduan Proyek WebGIS SIG ITERA.

    ### Fitur:
    - 📍 **Titik Kecelakaan** - Pencatatan dan pengelolaan data kecelakaan (Point)
    - 🗺️ **Kecamatan** - Data batas wilayah kecamatan (Polygon)
    - 👥 **Korban** - Detail korban setiap kejadian
    - 📊 **Statistik** - Analisis dan dashboard statistik
    - 🔴 **Black Spot** - Identifikasi titik rawan menggunakan ST_DWithin
    - 🏠 **ST_Within** - Analisis kecelakaan per wilayah kecamatan

    ### Output: GeoJSON untuk integrasi Leaflet/React
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ─── CORS Middleware ──────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Include Routers ─────────────────────────────────────────────────────────

app.include_router(kecamatan.router, prefix="/api/v1")
app.include_router(kecelakaan.router, prefix="/api/v1")
app.include_router(korban.router, prefix="/api/v1")
app.include_router(statistik.router, prefix="/api/v1")


# ─── Root & Health Check ──────────────────────────────────────────────────────

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Sistem Monitoring Kecelakaan Lalu Lintas - Lampung Selatan",
        "version": settings.app_version,
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Endpoint untuk mengecek status server."""
    return {"status": "ok", "service": settings.app_name}
