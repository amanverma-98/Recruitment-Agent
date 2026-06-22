from langgraph.checkpoint.postgres import PostgresSaver
from app.core.config import settings

with PostgresSaver.from_conn_string(settings.DATABASE_URL) as checkpointer:
    checkpointer.setup()