"""Reads settings from environment variables and the backend .env file.

The rest of the app calls get_settings() instead of reading os.environ
in many places.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Example: postgresql+psycopg://user:password@localhost:5432/soilsoul
    database_url: str = "postgresql+psycopg://soilsoul:soilsoul@localhost:5432/soilsoul"

    # Comma-separated list of frontend addresses.
    cors_origins: str = "http://localhost:5173"

    # Used in the password-reset email. No slash at the end.
    frontend_url: str = "http://localhost:5173"

    # Leave SMTP blank until you have a mail account. Reset links are
    # written to the API log instead of being emailed.
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Load settings once and reuse them."""
    return Settings()
