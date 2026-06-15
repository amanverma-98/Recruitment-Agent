from app.graph.graph import get_graph
from langgraph.types import Command

def resume_workflow(workflow_id, feedback):

    graph = get_graph()
    result = graph.invoke(
        Command(
            resume={
                "feedback": feedback
            }
        ),
        config={
            "configurable": {
                "thread_id": workflow_id
            }
        }
    )
    print("RESUME RESULT")
    print(result)

    return result