"""
Router: Titik Kecelakaan (SOLUSI MUTLAK)
CRUD endpoints + Spatial Query endpoints baku.
"""
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import text, func

from app.database import get_db
from app.models import TitikKecelakaan, KorbanKecelakaan, Kecamatan, KondisiKorban
from app.schemas import (
    TitikKecelakaanCreate, TitikKecelakaanUpdate, TitikKecelakaanResponse
)
from geoalchemy2.functions import ST_GeomFromGeoJSON, ST_Within, ST_DWithin

router = APIRouter(prefix="/kecelakaan", tags=["Titik Kecelakaan"])


def kecelakaan_to_feature(kec: TitikKecelakaan, geom_json_str: Optional[str] = None) -> dict:
    """Konversi ke GeoJSON Feature Murni berstandar [Longitude, Latitude]"""
    geometry_data = None
    if geom_json_str:
        try:
            geometry_data = json.loads(geom_json_str)
        except Exception:
            geometry_data = None

    return {
        "type": "Feature",
        "geometry": geometry_data,
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
            "keterangan": kec.keterangan,
            "kecamatan_id": kec.kecamatan_id,
            "kecamatan_nama": kec.kecamatan.nama if kec.kecamatan else None,
            "total_korban": len(kec.korban),
            "meninggal": sum(1 for k in kec.korban if k.kondisi == KondisiKorban.meninggal),
            "luka_berat": sum(1 for k in kec.korban if k.kondisi == KondisiKorban.luka_berat),
            "luka_ringan": sum(1 for k in kec.korban if k.kondisi == KondisiKorban.luka_ringan),
        }
    }


@router.get("/geojson", summary="Semua titik kecelakaan dalam format GeoJSON")
def get_kecelakaan_geojson(
    tahun: Optional[int] = Query(None),
    kecamatan_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    # Gabungkan query untuk efisiensi performa tinggi (Menghindari N+1 Query)
    query = db.query(TitikKecelakaan, func.ST_AsGeoJSON(TitikKecelakaan.geom).label("geom_json"))
    
    if tahun:
        query = query.filter(func.extract("year", TitikKecelakaan.tanggal_kejadian) == tahun)
    if kecamatan_id:
        query = query.filter(TitikKecelakaan.kecamatan_id == kecamatan_id)

    results = query.all()
    features = [kecelakaan_to_feature(kec, geom_json_str) for kec, geom_json_str in results]
    return {"type": "FeatureCollection", "features": features}


@router.get("/{kecelakaan_id}", summary="Detail satu kejadian kecelakaan")
def get_kecelakaan_by_id(kecelakaan_id: int, db: Session = Depends(get_db)):
    result = db.query(TitikKecelakaan, func.ST_AsGeoJSON(TitikKecelakaan.geom).label("geom_json")).filter(
        TitikKecelakaan.id == kecelakaan_id
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail=f"Kecelakaan ID {kecelakaan_id} tidak ditemukan")
    return kecelakaan_to_feature(result[0], result[1])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_kecelakaan(payload: TitikKecelakaanCreate, db: Session = Depends(get_db)):
    if payload.kecamatan_id:
        kec = db.query(Kecamatan).filter(Kecamatan.id == payload.kecamatan_id).first()
        if not kec:
            raise HTTPException(status_code=404, detail="Kecamatan tidak ditemukan")

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
    db.flush()

    for korban_data in payload.korban:
        db.add(KorbanKecelakaan(kecelakaan_id=kecelakaan.id, **korban_data.model_dump()))

    db.commit()
    return {"message": "Data kecelakaan berhasil ditambahkan", "id": kecelakaan.id}


@router.put("/{kecelakaan_id}")
def update_kecelakaan(kecelakaan_id: int, payload: TitikKecelakaanUpdate, db: Session = Depends(get_db)):
    kec = db.query(TitikKecelakaan).filter(TitikKecelakaan.id == kecelakaan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail="Kecelakaan tidak ditemukan")

    update_data = payload.model_dump(exclude_unset=True)
    if "geom" in update_data and update_data["geom"]:
        geom_str = json.dumps(update_data.pop("geom"))
        kec.geom = ST_GeomFromGeoJSON(geom_str)

    for field, value in update_data.items():
        setattr(kec, field, value)

    db.commit()
    return {"message": "Data kecelakaan berhasil diperbarui", "id": kec.id}


@router.delete("/{kecelakaan_id}")
def delete_kecelakaan(kecelakaan_id: int, db: Session = Depends(get_db)):
    kec = db.query(TitikKecelakaan).filter(TitikKecelakaan.id == kecelakaan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail="Kecelakaan tidak ditemukan")
    db.delete(kec)
    db.commit()
    return {"message": f"Data kecelakaan ID {kecelakaan_id} berhasil dihapus"}


@router.get("/spasial/dalam-kecamatan/{kecamatan_id}")
def kecelakaan_dalam_kecamatan(kecamatan_id: int, db: Session = Depends(get_db)):
    kec_wilayah = db.query(Kecamatan).filter(Kecamatan.id == kecamatan_id).first()
    if not kec_wilayah:
        raise HTTPException(status_code=404, detail="Kecamatan tidak ditemukan")

    results = db.query(TitikKecelakaan, func.ST_AsGeoJSON(TitikKecelakaan.geom).label("geom_json")).filter(
        ST_Within(TitikKecelakaan.geom, kec_wilayah.geom)
    ).all()

    features = [kecelakaan_to_feature(kec, geom_json_str) for kec, geom_json_str in results]
    return {"type": "FeatureCollection", "kecamatan": kec_wilayah.nama, "total": len(features), "features": features}


@router.get("/spasial/black-spot")
def identifikasi_black_spot(latitude: float = Query(...), longitude: float = Query(...), radius_meter: float = Query(1000), db: Session = Depends(get_db)):
    sql = text("""
        SELECT tk.id, tk.lokasi_nama, ST_Y(tk.geom::geometry) AS latitude, ST_X(tk.geom::geometry) AS longitude,
               ST_Distance(tk.geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) AS jarak_meter
        FROM titik_kecelakaan tk
        WHERE ST_DWithin(tk.geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius)
        ORDER BY jarak_meter ASC
    """)
    result = db.execute(sql, {"lat": latitude, "lon": longitude, "radius": radius_meter})
    rows = result.fetchall()
    return {
        "pusat": {"latitude": latitude, "longitude": longitude},
        "radius_meter": radius_meter,
        "total_ditemukan": len(rows),
        "kecelakaan": [{"id": r.id, "lokasi_nama": r.lokasi_nama, "latitude": r.latitude, "longitude": r.longitude, "jarak_meter": round(r.jarak_meter, 2)} for r in rows]
    }