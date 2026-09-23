from langgraph.checkpoint.postgres import PostgresSaver
from psycopg_pool import ConnectionPool
from app.core.config import settings
from app.workflows.workflow_builder import builder

langgraph_url = settings.DATABASE_URL.replace(
    "postgresql+psycopg://",
    "postgresql://"
)

# Use a connection pool instead of a single long-lived connection.
# The pool automatically reconnects when Postgres drops idle connections
# (common on hosted services like Render).
pool = ConnectionPool(
    conninfo=langgraph_url,
    min_size=1,
    max_size=10,
    kwargs={"autocommit": True, "prepare_threshold": 0},
)

checkpointer = PostgresSaver(pool)

# CREATE TABLES IF THEY DON'T EXIST
checkpointer.setup()

graph = builder.compile(
    checkpointer=checkpointer
)

def get_graph():
    return graph