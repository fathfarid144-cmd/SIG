"""
Pydantic schemas untuk validasi input/output API.
Terpisah antara schema Create, Update, dan Response (termasuk GeoJSON).
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Any
from datetime import datetime
from app.models import KondisiJalan, CuacaKejadian, JenisKendaraan, KondisiKorban


# ─────────────────────────────────────────────
# GeoJSON Helper Schemas
# ─────────────────────────────────────────────

class PointGeometry(BaseModel):
    """Representasi GeoJSON Point."""
    type: str = "Point"
    coordinates: List[float]  # [longitude, latitude]

    @field_validator("coordinates")
    @classmethod
    def validate_coordinates(cls, v):
        if len(v) != 2:
            raise ValueError("Koordinat harus berupa [longitude, latitude]")
        lon, lat = v
        if not (-180 <= lon <= 180):
            raise ValueError(f"Longitude tidak valid: {lon}")
        if not (-90 <= lat <= 90):
            raise ValueError(f"Latitude tidak valid: {lat}")
        return v


class PolygonGeometry(BaseModel):
    """Representasi GeoJSON Polygon."""
    type: str = "Polygon"
    coordinates: List[List[List[float]]]  # [[[lon,lat], ...]]


# ─────────────────────────────────────────────
# Schema: Kecamatan
# ─────────────────────────────────────────────

class KecamatanBase(BaseModel):
    nama: str = Field(..., min_length=2, max_length=100, description="Nama kecamatan")
    kode_kecamatan: Optional[str] = Field(None, max_length=20)
    luas_km2: Optional[float] = Field(None, gt=0)
    jumlah_penduduk: Optional[int] = Field(None, gt=0)
    keterangan: Optional[str] = None


class KecamatanCreate(KecamatanBase):
    geom: PolygonGeometry = Field(..., description="Geometri batas wilayah (GeoJSON Polygon)")


class KecamatanUpdate(BaseModel):
    nama: Optional[str] = Field(None, min_length=2, max_length=100)
    kode_kecamatan: Optional[str] = None
    luas_km2: Optional[float] = None
    jumlah_penduduk: Optional[int] = None
    keterangan: Optional[str] = None
    geom: Optional[PolygonGeometry] = None


class KecamatanResponse(KecamatanBase):
    id: int
    geom: Optional[Any] = None  # GeoJSON dict saat response
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# Schema: Korban Kecelakaan
# ─────────────────────────────────────────────

class KorbanBase(BaseModel):
    nama_korban: Optional[str] = Field(None, max_length=150)
    usia: Optional[int] = Field(None, ge=0, le=120)
    jenis_kelamin: Optional[str] = Field(None, pattern="^(Laki-laki|Perempuan)$")
    kondisi: KondisiKorban
    keterangan_luka: Optional[str] = None


class KorbanCreate(KorbanBase):
    pass


class KorbanUpdate(BaseModel):
    nama_korban: Optional[str] = None
    usia: Optional[int] = None
    jenis_kelamin: Optional[str] = None
    kondisi: Optional[KondisiKorban] = None
    keterangan_luka: Optional[str] = None


class KorbanResponse(KorbanBase):
    id: int
    kecelakaan_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# Schema: Titik Kecelakaan
# ─────────────────────────────────────────────

class TitikKecelakaanBase(BaseModel):
    tanggal_kejadian: datetime = Field(..., description="Tanggal dan waktu kejadian")
    lokasi_nama: str = Field(..., min_length=3, max_length=255, description="Nama lokasi/ruas jalan")
    nama_jalan: Optional[str] = Field(None, max_length=255)
    kondisi_jalan: Optional[KondisiJalan] = KondisiJalan.baik
    cuaca: Optional[CuacaKejadian] = CuacaKejadian.cerah
    jenis_kendaraan: Optional[JenisKendaraan] = None
    jumlah_kendaraan: Optional[int] = Field(None, ge=1)
    kecepatan_perkiraan: Optional[float] = Field(None, ge=0)
    penyebab: Optional[str] = None
    keterangan: Optional[str] = None
    kecamatan_id: Optional[int] = None


class TitikKecelakaanCreate(TitikKecelakaanBase):
    geom: PointGeometry = Field(..., description="Koordinat lokasi (GeoJSON Point)")
    korban: Optional[List[KorbanCreate]] = Field(default=[], description="Data korban kecelakaan")


class TitikKecelakaanUpdate(BaseModel):
    tanggal_kejadian: Optional[datetime] = None
    lokasi_nama: Optional[str] = None
    nama_jalan: Optional[str] = None
    kondisi_jalan: Optional[KondisiJalan] = None
    cuaca: Optional[CuacaKejadian] = None
    jenis_kendaraan: Optional[JenisKendaraan] = None
    jumlah_kendaraan: Optional[int] = None
    kecepatan_perkiraan: Optional[float] = None
    penyebab: Optional[str] = None
    keterangan: Optional[str] = None
    kecamatan_id: Optional[int] = None
    geom: Optional[PointGeometry] = None


class TitikKecelakaanResponse(TitikKecelakaanBase):
    id: int
    geom: Optional[Any] = None  # GeoJSON dict saat response
    korban: List[KorbanResponse] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# Schema: Statistik & Analisis
# ─────────────────────────────────────────────

class StatistikKecamatan(BaseModel):
    """Statistik kecelakaan per kecamatan."""
    kecamatan_id: int
    nama_kecamatan: str
    total_kecelakaan: int
    total_meninggal: int
    total_luka_berat: int
    total_luka_ringan: int
    total_korban: int


class BlackSpotResponse(BaseModel):
    """Titik black spot (rawan kecelakaan) hasil clustering."""
    kecelakaan_id: int
    lokasi_nama: str
    latitude: float
    longitude: float
    jumlah_kecelakaan_terdekat: int
    radius_meter: float


class GeoJSONFeature(BaseModel):
    """Standar GeoJSON Feature."""
    type: str = "Feature"
    geometry: Any
    properties: Any


class GeoJSONFeatureCollection(BaseModel):
    """Standar GeoJSON FeatureCollection."""
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]
