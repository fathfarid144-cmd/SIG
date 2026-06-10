"""
Router: Kecamatan
CRUD endpoints untuk data kecamatan + output GeoJSON.
"""
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from geoalchemy2.functions import ST_AsGeoJSON, ST_GeomFromGeoJSON
from geoalchemy2.shape import to_shape

from app.database import get_db
from app.models import Kecamatan
from app.schemas import (
    KecamatanCreate, KecamatanUpdate, KecamatanResponse,
    GeoJSONFeatureCollection, GeoJSONFeature
)

router = APIRouter(prefix="/kecamatan", tags=["Kecamatan"])


def kecamatan_to_geojson_feature(db: Session, kec: Kecamatan) -> dict:
    """Konversi ORM Kecamatan ke GeoJSON Feature dict."""
    geom_json = db.execute(
        text("SELECT ST_AsGeoJSON(geom) FROM kecamatan WHERE id = :id"),
        {"id": kec.id}
    ).scalar()
    return {
        "type": "Feature",
        "geometry": json.loads(geom_json) if geom_json else None,
        "properties": {
            "id": kec.id,
            "nama": kec.nama,
            "kode_kecamatan": kec.kode_kecamatan,
            "luas_km2": kec.luas_km2,
            "jumlah_penduduk": kec.jumlah_penduduk,
            "keterangan": kec.keterangan,
            "created_at": str(kec.created_at) if kec.created_at else None,
        }
    }


# ─── GET ALL (GeoJSON FeatureCollection) ─────────────────────────────────────

@router.get("/geojson", summary="Semua kecamatan dalam format GeoJSON")
def get_kecamatan_geojson(db: Session = Depends(get_db)):
    """
    Mengembalikan semua wilayah kecamatan sebagai GeoJSON FeatureCollection.
    Digunakan oleh frontend Leaflet untuk menampilkan layer Polygon.
    """
    kecamatans = db.query(Kecamatan).all()
    features = [kecamatan_to_geojson_feature(db, k) for k in kecamatans]
    return {"type": "FeatureCollection", "features": features}


# ─── GET ALL (JSON biasa) ─────────────────────────────────────────────────────

@router.get("/", response_model=List[KecamatanResponse], summary="Daftar semua kecamatan")
def get_all_kecamatan(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """Mendapatkan semua kecamatan dengan paginasi."""
    return db.query(Kecamatan).offset(skip).limit(limit).all()


# ─── GET BY ID ───────────────────────────────────────────────────────────────

@router.get("/{kecamatan_id}", summary="Detail satu kecamatan")
def get_kecamatan_by_id(kecamatan_id: int, db: Session = Depends(get_db)):
    """Mendapatkan detail satu kecamatan beserta geometrinya."""
    kec = db.query(Kecamatan).filter(Kecamatan.id == kecamatan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail=f"Kecamatan ID {kecamatan_id} tidak ditemukan")
    return kecamatan_to_geojson_feature(db, kec)


# ─── CREATE ──────────────────────────────────────────────────────────────────

@router.post("/", status_code=status.HTTP_201_CREATED, summary="Tambah kecamatan baru")
def create_kecamatan(payload: KecamatanCreate, db: Session = Depends(get_db)):
    """
    Membuat data kecamatan baru.
    Input geometri dalam format GeoJSON Polygon.
    """
    # Cek duplikasi nama
    existing = db.query(Kecamatan).filter(Kecamatan.nama == payload.nama).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Kecamatan '{payload.nama}' sudah ada"
        )

    geom_str = json.dumps(payload.geom.model_dump())
    kec = Kecamatan(
        nama=payload.nama,
        kode_kecamatan=payload.kode_kecamatan,
        luas_km2=payload.luas_km2,
        jumlah_penduduk=payload.jumlah_penduduk,
        keterangan=payload.keterangan,
        geom=ST_GeomFromGeoJSON(geom_str),
    )
    db.add(kec)
    db.commit()
    db.refresh(kec)
    return {"message": "Kecamatan berhasil ditambahkan", "id": kec.id}


# ─── UPDATE ──────────────────────────────────────────────────────────────────

@router.put("/{kecamatan_id}", summary="Update data kecamatan")
def update_kecamatan(
    kecamatan_id: int,
    payload: KecamatanUpdate,
    db: Session = Depends(get_db)
):
    """Update data kecamatan. Hanya field yang dikirim yang akan diubah."""
    kec = db.query(Kecamatan).filter(Kecamatan.id == kecamatan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail=f"Kecamatan ID {kecamatan_id} tidak ditemukan")

    update_data = payload.model_dump(exclude_unset=True)
    if "geom" in update_data and update_data["geom"]:
        geom_str = json.dumps(update_data.pop("geom"))
        kec.geom = ST_GeomFromGeoJSON(geom_str)

    for field, value in update_data.items():
        setattr(kec, field, value)

    db.commit()
    db.refresh(kec)
    return {"message": "Kecamatan berhasil diperbarui", "id": kec.id}


# ─── DELETE ──────────────────────────────────────────────────────────────────

@router.delete("/{kecamatan_id}", status_code=status.HTTP_200_OK, summary="Hapus kecamatan")
def delete_kecamatan(kecamatan_id: int, db: Session = Depends(get_db)):
    """Menghapus data kecamatan berdasarkan ID."""
    kec = db.query(Kecamatan).filter(Kecamatan.id == kecamatan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail=f"Kecamatan ID {kecamatan_id} tidak ditemukan")
    db.delete(kec)
    db.commit()
    return {"message": f"Kecamatan '{kec.nama}' berhasil dihapus"}
