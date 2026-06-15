from langgraph.checkpoint.postgres import PostgresSaver
from app.core.config import settings
from app.workflows.workflow_builder import builder

_checkpointer_cm = PostgresSaver.from_conn_string(settings.DATABASE_URL)
checkpointer = _checkpointer_cm.__enter__()

def get_graph():
    return builder.compile(checkpointer=checkpointer)