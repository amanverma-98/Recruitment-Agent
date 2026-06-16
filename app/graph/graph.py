from langgraph.checkpoint.postgres import PostgresSaver
from app.core.config import settings
from app.workflows.workflow_builder import builder

langgraph_url = settings.DATABASE_URL.replace(
    "postgresql+psycopg://",
    "postgresql://"
)

_checkpointer_cm = PostgresSaver.from_conn_string(langgraph_url)
checkpointer = _checkpointer_cm.__enter__()

# CREATE TABLES IF THEY DON'T EXIST
checkpointer.setup()

def get_graph():
    return builder.compile()