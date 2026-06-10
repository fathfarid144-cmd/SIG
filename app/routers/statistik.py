"""
Router: Statistik & Analisis
Endpoint untuk dashboard: statistik per kecamatan, total korban, dsb.
Data diambil dari dataset BPS Lampung Selatan 2023.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text, func

from app.database import get_db
from app.models import TitikKecelakaan, KorbanKecelakaan, Kecamatan, KondisiKorban
from app.schemas import StatistikKecamatan

router = APIRouter(prefix="/statistik", tags=["Statistik & Analisis"])


@router.get(
    "/per-kecamatan",
    response_model=List[StatistikKecamatan],
    summary="Statistik kecelakaan per kecamatan"
)
def statistik_per_kecamatan(
    tahun: Optional[int] = Query(None, description="Filter tahun"),
    db: Session = Depends(get_db)
):
    """
    Menghitung statistik kecelakaan dan korban untuk setiap kecamatan.
    Menggunakan COUNT dan GROUP BY dengan JOIN ke tabel korban.
    """
    sql_filter = "AND EXTRACT(YEAR FROM tk.tanggal_kejadian) = :tahun" if tahun else ""
    params = {"tahun": tahun} if tahun else {}

    sql = text(f"""
        SELECT
            kc.id AS kecamatan_id,
            kc.nama AS nama_kecamatan,
            COUNT(DISTINCT tk.id) AS total_kecelakaan,
            COUNT(CASE WHEN kor.kondisi = 'Meninggal Dunia' THEN 1 END) AS total_meninggal,
            COUNT(CASE WHEN kor.kondisi = 'Luka Berat' THEN 1 END) AS total_luka_berat,
            COUNT(CASE WHEN kor.kondisi = 'Luka Ringan' THEN 1 END) AS total_luka_ringan,
            COUNT(kor.id) AS total_korban
        FROM kecamatan kc
        LEFT JOIN titik_kecelakaan tk ON tk.kecamatan_id = kc.id {sql_filter}
        LEFT JOIN korban_kecelakaan kor ON kor.kecelakaan_id = tk.id
        GROUP BY kc.id, kc.nama
        ORDER BY total_kecelakaan DESC
    """)

    result = db.execute(sql, params)
    rows = result.fetchall()
    return [
        StatistikKecamatan(
            kecamatan_id=row.kecamatan_id,
            nama_kecamatan=row.nama_kecamatan,
            total_kecelakaan=row.total_kecelakaan or 0,
            total_meninggal=row.total_meninggal or 0,
            total_luka_berat=row.total_luka_berat or 0,
            total_luka_ringan=row.total_luka_ringan or 0,
            total_korban=row.total_korban or 0,
        )
        for row in rows
    ]


@router.get("/ringkasan", summary="Ringkasan total kecelakaan seluruh Lampung Selatan")
def ringkasan_keseluruhan(
    tahun: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Menampilkan angka ringkasan: total kejadian, total korban,
    distribusi kondisi korban, dan tren per bulan.
    """
    query = db.query(TitikKecelakaan)
    if tahun:
        query = query.filter(func.extract("year", TitikKecelakaan.tanggal_kejadian) == tahun)

    total_kejadian = query.count()

    # Hitung korban
    kecelakaan_ids = [k.id for k in query.all()]
    korban_query = db.query(KorbanKecelakaan).filter(
        KorbanKecelakaan.kecelakaan_id.in_(kecelakaan_ids)
    ) if kecelakaan_ids else db.query(KorbanKecelakaan).filter(False)

    total_meninggal = korban_query.filter(KorbanKecelakaan.kondisi == KondisiKorban.meninggal).count()
    total_luka_berat = korban_query.filter(KorbanKecelakaan.kondisi == KondisiKorban.luka_berat).count()
    total_luka_ringan = korban_query.filter(KorbanKecelakaan.kondisi == KondisiKorban.luka_ringan).count()

    return {
        "tahun": tahun or "Semua",
        "total_kejadian": total_kejadian,
        "total_korban": total_meninggal + total_luka_berat + total_luka_ringan,
        "total_meninggal": total_meninggal,
        "total_luka_berat": total_luka_berat,
        "total_luka_ringan": total_luka_ringan,
    }


@router.get("/tren-bulanan", summary="Tren jumlah kecelakaan per bulan")
def tren_bulanan(
    tahun: int = Query(..., description="Tahun yang dianalisis"),
    db: Session = Depends(get_db)
):
    """Menampilkan tren kecelakaan per bulan dalam satu tahun."""
    sql = text("""
        SELECT
            EXTRACT(MONTH FROM tanggal_kejadian)::int AS bulan,
            COUNT(*) AS total
        FROM titik_kecelakaan
        WHERE EXTRACT(YEAR FROM tanggal_kejadian) = :tahun
        GROUP BY bulan
        ORDER BY bulan
    """)
    result = db.execute(sql, {"tahun": tahun})
    rows = result.fetchall()

    bulan_labels = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ]
    data = {row.bulan: row.total for row in rows}
    return {
        "tahun": tahun,
        "data": [
            {"bulan": bulan_labels[i], "total": data.get(i + 1, 0)}
            for i in range(12)
        ]
    }
