# PERT-CPM-Network
Program Evaluation and Review Technique (PERT) and Critical Path Method (CPM) are both useful tools when planning and controlling a project. PERT and CPM are complementary and both are important analytical techniques in project management when managing tasks.

This website provides an efficient tool for evaluating and calculating for project management, this tool help to determine and visualize how much time it will take to complete a specific project.

# How to use?
Here is a step-by-step guide to using the program.

To add a new activity to your project:

1. Click the Add activity to add a new activity and node to the project.
2. Enter task details:
   
  Task Code: A unique identifier for the task (e.g., A, B, C).
  Description: A brief description of the task.
  Predecessor: The task codes of any preceding tasks that must be completed before this task begins. If there are multiple predecessors, separate them with commas (e.g., A, B).
  Time Estimates:
    Optimistic Time (a): The shortest time in which the task can be completed.
    Most Probable Time (m):
    Pessimistic Time (b): The longest time the task might take to complete.

    These inputs are used to calculate the Estimated Time (ET) for the task using the formula:
    ET = (a + 4m + b) / 6.

4. Click the Force data reload to recalculate all the values and redraw the graph based on the current data.

5. Click the Remove all to remove all tasks from the project.
