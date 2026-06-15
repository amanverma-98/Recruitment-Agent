from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    GROQ_API_KEY: str
    GROQ_MODEL: str
    GROQ_BASE_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()

settings.DATABASE_URL = (
    settings.DATABASE_URL
    .replace("postgresql://", "postgresql+psycopg://")
    .replace("postgresql+psycopg2://", "postgresql+psycopg://")
)