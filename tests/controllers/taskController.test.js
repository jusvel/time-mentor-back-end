const tasksController = require("../../controllers/taskController");

test("Filters tasks by difficulty", () => {
  const tasks = [
    { title: "Task 1", difficulty: "easy" },
    { title: "Task 2", difficulty: "medium" },
    { title: "Task 3", difficulty: "hard" },
  ];

  const filteredTasks = tasksController.filterTasksByDifficulty(tasks, "easy");

  expect(filteredTasks).toHaveLength(1);
  expect(filteredTasks[0].difficulty).toBe("easy");
});
