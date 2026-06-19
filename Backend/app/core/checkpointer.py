from app.core.config import settings
from langgraph.checkpoint.postgres import PostgresSaver

def get_checkpointer():
    checkpointer_cm = PostgresSaver.from_conn_string(settings.DATABASE_URL)
    return checkpointer_cm.__enter__()