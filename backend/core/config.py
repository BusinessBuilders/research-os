from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    vane_url: str = "http://localhost:3001"
    qwen_url: str = "http://localhost:8080"
    qwen_model: str = ""
    firecrawl_url: str = "http://localhost:3002"
    wiki_path: str = "./wiki"
    db_path: str = "researchos.db"
    host: str = "0.0.0.0"
    port: int = 8001
    # Comma-separated list of allowed browser origins, or "*".
    # Pin this to the frontend origin in production, e.g.
    # RESEARCHOS_CORS_ORIGINS=http://100.76.233.80:4000
    cors_origins: str = "*"

    vane_chat_provider_id: str = ""
    vane_chat_model_key: str = ""
    vane_embed_provider_id: str = ""
    vane_embed_model_key: str = ""

    model_config = {"env_prefix": "RESEARCHOS_", "env_file": ".env"}

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]
