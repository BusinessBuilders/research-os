from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    vane_url: str = "http://100.76.233.80:3001"
    qwen_url: str = "http://100.76.233.80:8080"
    firecrawl_url: str = "http://100.76.233.80:3002"
    wiki_path: str = "/home/magiccat/obsidian-vault-second-run/wiki"
    db_path: str = "researchos.db"
    host: str = "0.0.0.0"
    port: int = 8001

    vane_chat_provider_id: str = ""
    vane_chat_model_key: str = ""
    vane_embed_provider_id: str = ""
    vane_embed_model_key: str = ""

    model_config = {"env_prefix": "RESEARCHOS_", "env_file": ".env"}
