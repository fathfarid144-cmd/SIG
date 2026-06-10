"""
Konfigurasi aplikasi dari environment variables.
Menggunakan pydantic-settings untuk validasi otomatis.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Informasi Aplikasi
    app_name: str = "Sistem Monitoring Kecelakaan Lalu Lintas Lampung Selatan"
    app_version: str = "1.0.0"
    debug: bool = True

    # Konfigurasi Database
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "kecelakaan_lampsel_db"
    db_user: str = "postgres"
    db_password: str = "postgres"

    # CORS
    frontend_url: str = "http://localhost:5173"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
