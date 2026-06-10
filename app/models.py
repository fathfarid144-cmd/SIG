"""
Model ORM untuk semua tabel database.
Menggunakan GeoAlchemy2 untuk tipe data geometri PostGIS.

Tabel:
  1. kecamatan        - Wilayah kecamatan (Polygon)
  2. titik_kecelakaan - Kejadian kecelakaan (Point)
  3. korban_kecelakaan - Detail korban per kejadian (relasi ke titik_kecelakaan)
"""
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Text,
    ForeignKey, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.database import Base
import enum


# ─────────────────────────────────────────────
# Enum Types
# ─────────────────────────────────────────────

class KondisiJalan(str, enum.Enum):
    baik = "Baik"
    sedang = "Sedang"
    rusak = "Rusak"
    rusak_berat = "Rusak Berat"


class CuacaKejadian(str, enum.Enum):
    cerah = "Cerah"
    berawan = "Berawan"
    hujan = "Hujan"
    kabut = "Kabut"


class JenisKendaraan(str, enum.Enum):
    motor = "Sepeda Motor"
    mobil = "Mobil"
    truk = "Truk"
    bus = "Bus"
    lainnya = "Lainnya"


class KondisiKorban(str, enum.Enum):
    meninggal = "Meninggal Dunia"
    luka_berat = "Luka Berat"
    luka_ringan = "Luka Ringan"


# ─────────────────────────────────────────────
# Tabel 1: Kecamatan (Polygon)
# ─────────────────────────────────────────────

class Kecamatan(Base):
    """
    Menyimpan batas wilayah kecamatan di Kabupaten Lampung Selatan.
    Geometri: Polygon (EPSG:4326)
    """
    __tablename__ = "kecamatan"

    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(100), nullable=False, unique=True)
    kode_kecamatan = Column(String(20), unique=True)
    luas_km2 = Column(Float)
    jumlah_penduduk = Column(Integer)
    keterangan = Column(Text)

    # Geometri Polygon batas wilayah kecamatan, SRID 4326
    geom = Column(Geometry(geometry_type="POLYGON", srid=4326), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relasi ke titik_kecelakaan
    kecelakaan = relationship("TitikKecelakaan", back_populates="kecamatan")

    def __repr__(self):
        return f"<Kecamatan(id={self.id}, nama='{self.nama}')>"


# ─────────────────────────────────────────────
# Tabel 2: Titik Kecelakaan (Point)
# ─────────────────────────────────────────────

class TitikKecelakaan(Base):
    """
    Menyimpan lokasi dan detail setiap kejadian kecelakaan.
    Geometri: Point (EPSG:4326)
    """
    __tablename__ = "titik_kecelakaan"

    id = Column(Integer, primary_key=True, index=True)
    tanggal_kejadian = Column(DateTime(timezone=True), nullable=False)
    lokasi_nama = Column(String(255), nullable=False)   # nama ruas jalan
    nama_jalan = Column(String(255))
    kondisi_jalan = Column(SAEnum(KondisiJalan), default=KondisiJalan.baik)
    cuaca = Column(SAEnum(CuacaKejadian), default=CuacaKejadian.cerah)
    jenis_kendaraan = Column(SAEnum(JenisKendaraan))
    jumlah_kendaraan = Column(Integer, default=1)
    kecepatan_perkiraan = Column(Float)                 # km/jam
    penyebab = Column(Text)
    keterangan = Column(Text)

    # Foreign Key ke kecamatan (bisa null jika kecamatan belum diketahui)
    kecamatan_id = Column(Integer, ForeignKey("kecamatan.id"), nullable=True)

    # Geometri Point lokasi kecelakaan, SRID 4326
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relasi
    kecamatan = relationship("Kecamatan", back_populates="kecelakaan")
    korban = relationship("KorbanKecelakaan", back_populates="kecelakaan", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<TitikKecelakaan(id={self.id}, lokasi='{self.lokasi_nama}')>"


# ─────────────────────────────────────────────
# Tabel 3: Korban Kecelakaan
# ─────────────────────────────────────────────

class KorbanKecelakaan(Base):
    """
    Menyimpan data korban dari setiap kejadian kecelakaan.
    Relasi Many-to-One ke TitikKecelakaan.
    """
    __tablename__ = "korban_kecelakaan"

    id = Column(Integer, primary_key=True, index=True)
    kecelakaan_id = Column(Integer, ForeignKey("titik_kecelakaan.id", ondelete="CASCADE"), nullable=False)

    nama_korban = Column(String(150))
    usia = Column(Integer)
    jenis_kelamin = Column(String(20))
    kondisi = Column(SAEnum(KondisiKorban), nullable=False)
    keterangan_luka = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relasi
    kecelakaan = relationship("TitikKecelakaan", back_populates="korban")

    def __repr__(self):
        return f"<KorbanKecelakaan(id={self.id}, kondisi='{self.kondisi}')>"
