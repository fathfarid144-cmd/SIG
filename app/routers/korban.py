"""
Router: Korban Kecelakaan
CRUD endpoints untuk data korban per kejadian kecelakaan.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import KorbanKecelakaan, TitikKecelakaan
from app.schemas import KorbanCreate, KorbanUpdate, KorbanResponse

router = APIRouter(prefix="/korban", tags=["Korban Kecelakaan"])


# ─── GET: Semua korban dari satu kejadian ─────────────────────────────────────

@router.get(
    "/kecelakaan/{kecelakaan_id}",
    response_model=List[KorbanResponse],
    summary="Daftar korban satu kejadian"
)
def get_korban_by_kecelakaan(kecelakaan_id: int, db: Session = Depends(get_db)):
    """Mendapatkan semua korban dari satu kejadian kecelakaan."""
    kec = db.query(TitikKecelakaan).filter(TitikKecelakaan.id == kecelakaan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail=f"Kecelakaan ID {kecelakaan_id} tidak ditemukan")
    return kec.korban


# ─── GET: Detail satu korban ──────────────────────────────────────────────────

@router.get("/{korban_id}", response_model=KorbanResponse, summary="Detail satu korban")
def get_korban_by_id(korban_id: int, db: Session = Depends(get_db)):
    korban = db.query(KorbanKecelakaan).filter(KorbanKecelakaan.id == korban_id).first()
    if not korban:
        raise HTTPException(status_code=404, detail=f"Korban ID {korban_id} tidak ditemukan")
    return korban


# ─── CREATE: Tambah korban ke kejadian ───────────────────────────────────────

@router.post(
    "/kecelakaan/{kecelakaan_id}",
    status_code=status.HTTP_201_CREATED,
    response_model=KorbanResponse,
    summary="Tambah korban ke suatu kejadian"
)
def create_korban(
    kecelakaan_id: int,
    payload: KorbanCreate,
    db: Session = Depends(get_db)
):
    """Menambahkan data korban baru ke kejadian kecelakaan yang sudah ada."""
    kec = db.query(TitikKecelakaan).filter(TitikKecelakaan.id == kecelakaan_id).first()
    if not kec:
        raise HTTPException(status_code=404, detail=f"Kecelakaan ID {kecelakaan_id} tidak ditemukan")

    korban = KorbanKecelakaan(kecelakaan_id=kecelakaan_id, **payload.model_dump())
    db.add(korban)
    db.commit()
    db.refresh(korban)
    return korban


# ─── UPDATE ──────────────────────────────────────────────────────────────────

@router.put("/{korban_id}", response_model=KorbanResponse, summary="Update data korban")
def update_korban(korban_id: int, payload: KorbanUpdate, db: Session = Depends(get_db)):
    """Update data korban. Hanya field yang dikirim yang diubah."""
    korban = db.query(KorbanKecelakaan).filter(KorbanKecelakaan.id == korban_id).first()
    if not korban:
        raise HTTPException(status_code=404, detail=f"Korban ID {korban_id} tidak ditemukan")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(korban, field, value)

    db.commit()
    db.refresh(korban)
    return korban


# ─── DELETE ──────────────────────────────────────────────────────────────────

@router.delete("/{korban_id}", summary="Hapus data korban")
def delete_korban(korban_id: int, db: Session = Depends(get_db)):
    """Menghapus data satu korban."""
    korban = db.query(KorbanKecelakaan).filter(KorbanKecelakaan.id == korban_id).first()
    if not korban:
        raise HTTPException(status_code=404, detail=f"Korban ID {korban_id} tidak ditemukan")
    db.delete(korban)
    db.commit()
    return {"message": f"Data korban ID {korban_id} berhasil dihapus"}
