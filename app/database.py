"""
Koneksi database menggunakan SQLAlchemy + GeoAlchemy2 untuk PostGIS.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

settings = get_settings()

# Engine SQLAlchemy
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # log semua SQL saat debug
    pool_pre_ping=True,   # cek koneksi sebelum dipakai
    pool_size=10,
    max_overflow=20,
)

# Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class untuk semua model ORM
Base = declarative_base()


def get_db():
    """
    Dependency injection untuk mendapatkan database session.
    Digunakan di setiap endpoint FastAPI.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
