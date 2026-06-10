"""
Router: Titik Kecelakaan
CRUD endpoints + Spatial Query endpoints:
  - ST_Within  : kecelakaan dalam wilayah kecamatan tertentu
  - ST_DWithin : kecelakaan dalam radius tertentu dari suatu titik (black spot)
"""
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import text, func

from app.database import get_db
from app.models import TitikKecelakaan, KorbanKecelakaan, Kecamatan, KondisiKorban
from app.schemas import (
    TitikKecelakaanCreate, TitikKecelakaanUpdate, TitikKecelakaanResponse,
    StatistikKecamatan, BlackSpotResponse
)
from geoalchemy2.functions import ST_GeomFromGeoJSON, ST_Within, ST_DWithin, ST_AsGeoJSON

router = APIRouter(prefix="/kecelakaan", tags=["Titik Kecelakaan"])


def kecelakaan_to_feature(db: Session, kec: TitikKecelakaan) -> dict:
    """Konversi ORM ke GeoJSON Feature."""
    geom_json = db.execute(
        text("SELECT ST_AsGeoJSON(geom) FROM titik_kecelakaan WHERE id = :id"),
        {"id": kec.id}
    ).scalar()
    return {
        "type": "Feature",
        "geometry": json.loads(geom_json) if geom_json else None,
        "properties": {
            "id": kec.id,
            "tanggal_kejadian": str(kec.tanggal_kejadian),
            "lokasi_nama": kec.lokasi_nama,
            "nama_jalan": kec.nama_jalan,
            "kondisi_jalan": kec.kondisi_jalan,
            "cuaca": kec.cuaca,
            "jenis_kendaraan": kec.jenis_kendaraan,
            "jumlah_kendaraan": kec.jumlah_kendaraan,
            "kecepatan_perkiraan": kec.kecepatan_perkiraan,
            "penyebab": kec.penyebab,
            "kecamatan_id": kec.kecamatan_id,
            "kecamatan_nama": kec.kecamatan.nama if kec.kecamatan else None,
            "total_korban": len(kec.korban),
            "meninggal": sum(1 for k in kec.korban if k.kondisi == KondisiKorban.meninggal),
            "luka_berat": sum(1 for k in kec.korban if k.kondisi == KondisiKorban.luka_berat),
            "luka_ringan": sum(1 for k in kec.korban if k.kondisi == KondisiKorban.luka_ringan),
        }
    }


# ─── GET ALL (GeoJSON) ────────────────────────────────────────────────────────

@router.get("/geojson", summary="Semua titik kecelakaan dalam format GeoJSON")
def get_kecelakaan_geojson(
    tahun: Optional[int] = Query(None, description="Filter tahun kejadian"),
    kecamatan_id: Optional[int] = Query(None, description="Filter per kecamatan"),
    db: Session = Depends(get_db)
):
    """
    Mengembalikan semua titik kecelakaan sebagai GeoJSON FeatureCollection.
    Mendukung filter tahun dan kecamatan.
    """
    query = db.query(TitikKecelakaan)
    if tahun:
        query = query.filter(
            func.extract("year", TitikKecelakaan.tanggal_kejadian) == tahun
        )
    if kecamatan_id:
        query = query.filter(TitikKecelakaan.kecamatan_id == kecamatan_id)

    kecelakaans = query.all()
    features = [kecelakaan_to_feature(db, k) for k in kecelakaans]
    return {"type": "FeatureCollection", "features": features}


# ─── GET ALL (List biasa) ─────────────────────────────────────────────────────

@router.get("/", response_model=List[TitikKecelakaanResponse], summary="Daftar kecelakaan")
def get_all_kecelakaan(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    tahun: Optional[int] = Query(None),
    kecamatan_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Mendapatkan daftar kecelakaan dengan filter dan paginasi."""
    query = db.query(TitikKecelakaan)
    if tahun:
        query = query.filter(
            func.extract("year", TitikKecelakaan.tanggal_kejadian) == tahun
        )
    if kecamatan_id:
        query = query.filter(TitikKecelakaan.kecamatan_id == kecamatan_id)
    return query.offset(skip).limit(limit).all()


# ─── GET BY ID ────────────────────────────────────────────────────────────────

@router.get("/{kecelakaan_id}", summary="Detail satu kejadian kecelakaan")
def get_kecelakaan_by_id(kecelakaan_id: int, db: Session = Depends(get_db)):
    kec = db.query(TitikKecelakaan).filter(TitikKecelakaan.id == kecelakaan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail=f"Kecelakaan ID {kecelakaan_id} tidak ditemukan")
    return kecelakaan_to_feature(db, kec)


# ─── CREATE ──────────────────────────────────────────────────────────────────

@router.post("/", status_code=status.HTTP_201_CREATED, summary="Tambah data kecelakaan baru")
def create_kecelakaan(payload: TitikKecelakaanCreate, db: Session = Depends(get_db)):
    """
    Mencatat kejadian kecelakaan baru beserta data korban.
    Koordinat dalam format GeoJSON Point [longitude, latitude].
    """
    # Validasi kecamatan jika diberikan
    if payload.kecamatan_id:
        kec = db.query(Kecamatan).filter(Kecamatan.id == payload.kecamatan_id).first()
        if not kec:
            raise HTTPException(status_code=404, detail=f"Kecamatan ID {payload.kecamatan_id} tidak ditemukan")

    geom_str = json.dumps(payload.geom.model_dump())
    kecelakaan = TitikKecelakaan(
        tanggal_kejadian=payload.tanggal_kejadian,
        lokasi_nama=payload.lokasi_nama,
        nama_jalan=payload.nama_jalan,
        kondisi_jalan=payload.kondisi_jalan,
        cuaca=payload.cuaca,
        jenis_kendaraan=payload.jenis_kendaraan,
        jumlah_kendaraan=payload.jumlah_kendaraan,
        kecepatan_perkiraan=payload.kecepatan_perkiraan,
        penyebab=payload.penyebab,
        keterangan=payload.keterangan,
        kecamatan_id=payload.kecamatan_id,
        geom=ST_GeomFromGeoJSON(geom_str),
    )
    db.add(kecelakaan)
    db.flush()  # Dapatkan ID sebelum commit

    # Tambah korban
    for korban_data in payload.korban:
        korban = KorbanKecelakaan(
            kecelakaan_id=kecelakaan.id,
            **korban_data.model_dump()
        )
        db.add(korban)

    db.commit()
    db.refresh(kecelakaan)
    return {"message": "Data kecelakaan berhasil ditambahkan", "id": kecelakaan.id}


# ─── UPDATE ──────────────────────────────────────────────────────────────────

@router.put("/{kecelakaan_id}", summary="Update data kecelakaan")
def update_kecelakaan(
    kecelakaan_id: int,
    payload: TitikKecelakaanUpdate,
    db: Session = Depends(get_db)
):
    """Update data kecelakaan. Hanya field yang dikirim yang diubah."""
    kec = db.query(TitikKecelakaan).filter(TitikKecelakaan.id == kecelakaan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail=f"Kecelakaan ID {kecelakaan_id} tidak ditemukan")

    update_data = payload.model_dump(exclude_unset=True)
    if "geom" in update_data and update_data["geom"]:
        geom_str = json.dumps(update_data.pop("geom"))
        kec.geom = ST_GeomFromGeoJSON(geom_str)

    for field, value in update_data.items():
        setattr(kec, field, value)

    db.commit()
    db.refresh(kec)
    return {"message": "Data kecelakaan berhasil diperbarui", "id": kec.id}


# ─── DELETE ──────────────────────────────────────────────────────────────────

@router.delete("/{kecelakaan_id}", summary="Hapus data kecelakaan")
def delete_kecelakaan(kecelakaan_id: int, db: Session = Depends(get_db)):
    """Menghapus data kecelakaan beserta semua korbannya (cascade)."""
    kec = db.query(TitikKecelakaan).filter(TitikKecelakaan.id == kecelakaan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail=f"Kecelakaan ID {kecelakaan_id} tidak ditemukan")
    db.delete(kec)
    db.commit()
    return {"message": f"Data kecelakaan ID {kecelakaan_id} berhasil dihapus"}


# ─── SPATIAL QUERY 1: Kecelakaan dalam wilayah kecamatan (ST_Within) ─────────

@router.get(
    "/spasial/dalam-kecamatan/{kecamatan_id}",
    summary="[Spasial] Kecelakaan dalam wilayah kecamatan (ST_Within)"
)
def kecelakaan_dalam_kecamatan(kecamatan_id: int, db: Session = Depends(get_db)):
    """
    Query spasial: Mencari semua titik kecelakaan yang secara geografis
    berada di dalam batas wilayah kecamatan menggunakan ST_Within.
    Berguna untuk verifikasi apakah data di-assign ke kecamatan yang benar.
    """
    kec_wilayah = db.query(Kecamatan).filter(Kecamatan.id == kecamatan_id).first()
    if not kec_wilayah:
        raise HTTPException(status_code=404, detail=f"Kecamatan ID {kecamatan_id} tidak ditemukan")

    # ST_Within: titik kecelakaan yang ada di dalam polygon kecamatan
    hasil = db.query(TitikKecelakaan).filter(
        ST_Within(TitikKecelakaan.geom, kec_wilayah.geom)
    ).all()

    features = [kecelakaan_to_feature(db, k) for k in hasil]
    return {
        "type": "FeatureCollection",
        "kecamatan": kec_wilayah.nama,
        "total": len(features),
        "features": features
    }


# ─── SPATIAL QUERY 2: Black Spot - Radius tertentu (ST_DWithin) ──────────────

@router.get(
    "/spasial/black-spot",
    summary="[Spasial] Identifikasi black spot dalam radius tertentu (ST_DWithin)"
)
def identifikasi_black_spot(
    latitude: float = Query(..., description="Latitude pusat pencarian"),
    longitude: float = Query(..., description="Longitude pusat pencarian"),
    radius_meter: float = Query(1000, ge=100, le=50000, description="Radius pencarian dalam meter"),
    db: Session = Depends(get_db)
):
    """
    Query spasial: Mencari semua kecelakaan dalam radius tertentu dari suatu titik.
    Menggunakan ST_DWithin dengan unit meter (geography cast).
    Berguna untuk mengidentifikasi area black spot (rawan kecelakaan).
    """
    sql = text("""
        SELECT
            tk.id,
            tk.lokasi_nama,
            ST_Y(tk.geom::geometry) AS latitude,
            ST_X(tk.geom::geometry) AS longitude,
            COUNT(*) OVER (
                PARTITION BY true
            ) AS total_dalam_radius,
            ST_Distance(
                tk.geom::geography,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
            ) AS jarak_meter
        FROM titik_kecelakaan tk
        WHERE ST_DWithin(
            tk.geom::geography,
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
            :radius
        )
        ORDER BY jarak_meter ASC
    """)

    result = db.execute(sql, {"lat": latitude, "lon": longitude, "radius": radius_meter})
    rows = result.fetchall()

    return {
        "pusat": {"latitude": latitude, "longitude": longitude},
        "radius_meter": radius_meter,
        "total_ditemukan": len(rows),
        "kecelakaan": [
            {
                "id": row.id,
                "lokasi_nama": row.lokasi_nama,
                "latitude": row.latitude,
                "longitude": row.longitude,
                "jarak_meter": round(row.jarak_meter, 2),
            }
            for row in rows
        ]
    }
