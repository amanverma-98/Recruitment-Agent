from app.graph.graph import get_graph

graph = get_graph()

with open("workflow.png", "wb") as f:
    f.write(graph.get_graph().draw_mermaid_png())

print("Workflow saved")