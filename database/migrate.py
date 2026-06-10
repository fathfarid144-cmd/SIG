"""
Script untuk menjalankan semua migrasi database secara otomatis.
Jalankan sekali untuk setup database awal.

Penggunaan:
    python database/migrate.py
"""
import subprocess
import sys
import os
from pathlib import Path

# Path ke folder database
DB_DIR = Path(__file__).parent
SQL_FILES = [
    "01_setup_database.sql",
    "02_create_tables.sql",
    "03_seed_kecamatan.sql",
    "04_seed_kecelakaan.sql",
]

def run_sql(file: str, db_name: str = None):
    """Jalankan file SQL menggunakan psql."""
    sql_path = DB_DIR / file
    if not sql_path.exists():
        print(f"  ⚠️  File tidak ditemukan: {sql_path}")
        return False

    cmd = ["psql", "-U", "postgres"]
    if db_name:
        cmd.extend(["-d", db_name])

    with open(sql_path, "r", encoding="utf-8") as f:
        result = subprocess.run(cmd, stdin=f, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"  ❌ Error pada {file}:")
        print(result.stderr)
        return False

    print(f"  ✅ {file} berhasil dijalankan")
    return True


if __name__ == "__main__":
    print("=" * 60)
    print("Setup Database: Sistem Monitoring Kecelakaan Lalu Lintas")
    print("=" * 60)

    # File 01: setup database (tanpa nama DB)
    print(f"\n[1/4] Setup database...")
    run_sql("01_setup_database.sql")

    # File 02-04: jalankan di database target
    for i, sql_file in enumerate(SQL_FILES[1:], 2):
        print(f"\n[{i}/4] {sql_file}...")
        run_sql(sql_file, db_name="kecelakaan_lampsel_db")

    print("\n" + "=" * 60)
    print("✅ Database berhasil disiapkan!")
    print("   Jalankan: uvicorn app.main:app --reload")
    print("=" * 60)
