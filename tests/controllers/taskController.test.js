const Task = require("../../models/taskModel");
const app = require("../../app");
const request = require("supertest");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

describe("GET /tasks/search", () => {
  let token;

  beforeAll(async () => {
    const findOneSpy = jest.spyOn(User, "findOne");
    findOneSpy.mockResolvedValue({
      _id: "65f4269e9e8ca78b953c9fb6",
      email: "test@example.com",
      correctPassword: jest.fn(() => true),
    });

    const res = await request(app).post("/api/v1/users/login").send({
      email: "test@example.com",
      password: "password",
    });
    token = res.body.token;
  });

  it("should return tasks matching the query string in title or subject", async () => {
    const mockTasks = [
      {
        _id: "task1Id",
        title: "Task 1",
        subject: "Subject 1",
        user: "65f4269e9e8ca78b953c9fb6",
      },
      {
        _id: "task2Id",
        title: "Task 2",
        subject: "Subject 2",
        user: "65f4269e9e8ca78b953c9fb6",
      },
    ];

    const findSpy = jest.spyOn(Task, "find");
    findSpy.mockImplementation(async (query) => {
      if (!query) {
        return mockTasks;
      }

      const queryString = query.$or[0].title.$regex.toLowerCase();
      return mockTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(queryString) ||
          task.subject.toLowerCase().includes(queryString)
      );
    });

    const res = await request(app)
      .get("/api/v1/tasks/search")
      .query({ query: "Subject 1" })
      .set("Cookie", [`jwt=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.tasks.length).toBe(1);
    expect(res.body.data.tasks[0].title).toBe("Task 1");
  });

  it("should return all tasks if query is not provided", async () => {
    const mockTasks = [
      {
        _id: "task1Id",
        title: "Task 1",
        subject: "Subject 1",
        user: "65f4269e9e8ca78b953c9fb6",
      },
      {
        _id: "task2Id",
        title: "Task 2",
        subject: "Subject 2",
        user: "65f4269e9e8ca78b953c9fb6",
      },
    ];
    const findSpy = jest.spyOn(Task, "find");
    findSpy.mockImplementation(async () => mockTasks);

    const res = await request(app)
      .get('/api/v1/tasks/search?query=""')
      .set("Cookie", [`jwt=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.tasks.length).toBe(2);
    expect(res.body.data.tasks).toEqual(mockTasks);
  });

  it("should return 404 if no tasks match the query", async () => {
    const mockTasks = [
      {
        _id: "task1Id",
        title: "Task 1",
        subject: "Subject 1",
        user: "65f4269e9e8ca78b953c9fb6",
      },
      {
        _id: "task2Id",
        title: "Task 2",
        subject: "Subject 2",
        user: "65f4269e9e8ca78b953c9fb6",
      },
    ];

    const findSpy = jest.spyOn(Task, "find");
    findSpy.mockImplementation(async (query) => {
      if (!query) {
        return mockTasks;
      }

      const queryString = query.$or[0].title.$regex.toLowerCase();
      return mockTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(queryString) ||
          task.subject.toLowerCase().includes(queryString)
      );
    });

    const res = await request(app)
      .get("/api/v1/tasks/search")
      .query({ query: "Subjectasdasdasdasdsa" })
      .set("Cookie", [`jwt=${token}`]);

    expect(res.statusCode).toBe(404);
  });

  it("should return tasks with the specified difficulty level", async () => {
    const mockTasks = [
      {
        _id: "task1Id",
        title: "Task 1",
        subject: "Subject 1",
        user: "65f4269e9e8ca78b953c9fb6",
        difficulty: "easy",
      },
      {
        _id: "task2Id",
        title: "Task 2",
        subject: "Subject 2",
        user: "65f4269e9e8ca78b953c9fb6",
        difficulty: "medium",
      },
      {
        _id: "task3Id",
        title: "Task 3",
        subject: "Subject 3",
        user: "65f4269e9e8ca78b953c9fb6",
        difficulty: "hard",
      },
    ];

    const findSpy = jest.spyOn(Task, "find");
    findSpy.mockImplementation(async ({ difficulty }) => {
      return mockTasks.filter((task) => task.difficulty === difficulty);
    });

    const res = await request(app)
      .get("/api/v1/tasks/search?difficulty=easy")
      .set("Cookie", [`jwt=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.tasks.length).toBe(1);
    expect(res.body.data.tasks[0].difficulty).toBe("easy");
  });
});
