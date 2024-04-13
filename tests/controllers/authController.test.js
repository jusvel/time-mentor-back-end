const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const authController = require("../../controllers/authController");
const Task = require("../../models/taskModel");
const jwt = require("jsonwebtoken");

describe("Auth Controller", () => {
  const email = "a@tm.com";
  let token = "";

  describe("POST /signup", () => {
    it("should create a new user and return a token", async () => {
      const createSpy = jest.spyOn(User, "create");
      createSpy.mockResolvedValue({
        _id: "userId",
        name: "John Doe",
        email: email,
      });

      const res = await request(app).post("/api/v1/users/signup").send({
        name: "John Doe",
        email: email,
        password: "password123",
        passwordConfirm: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe(email);

      createSpy.mockRestore();
    });
  });

  describe("POST /login", () => {
    it("should log in a user and return a token", async () => {
      const findOneSpy = jest.spyOn(User, "findOne");
      findOneSpy.mockResolvedValue({
        _id: "65f4269e9e8ca78b953c9fb6",
        email: email,
        correctPassword: jest.fn(() => true),
      });

      const res = await request(app).post("/api/v1/users/login").send({
        email: email,
        password: "password",
      });
      token = res.body.token;
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe(email);

      findOneSpy.mockRestore();
    });

    it("should return 400 if email or password is missing", async () => {
      const res = await request(app)
        .post("/api/v1/users/login")
        .send({ email: email });
      expect(res.statusCode).toBe(400);
    });

    it("should return 401 if email or password is incorrect", async () => {
      const findOneSpy = jest.spyOn(User, "findOne");
      findOneSpy.mockResolvedValue({
        _id: "65f4269e9e8ca78b953c9fb6",
        email: email,
        correctPassword: jest.fn(() => false),
      });

      const res = await request(app).post("/api/v1/users/login").send({
        email: email,
        password: "wrongpassword",
      });
      expect(res.statusCode).toBe(401);

      findOneSpy.mockRestore();
    });
  });

  describe("protect Middleware", () => {
    it("should return 200 if cookie token is valid", async () => {
      const findSpy = jest.spyOn(Task, "find");
      findSpy.mockResolvedValue({
        name: "Task 1",
        user: "65f4269e9e8ca78b953c9fb6",
      });
      const findByIdSpy = jest.spyOn(User, "findById");
      findByIdSpy.mockResolvedValue({
        _id: "65f4269e9e8ca78b953c9fb6",
        email: email,
      });

      const res = await request(app)
        .get("/api/v1/tasks")
        .set("Cookie", [`jwt=${token}`]);
      expect(res.statusCode).toBe(200);
      findSpy.mockRestore();
      findByIdSpy.mockRestore();
    });

    it("should return 200 if authorization header bearer token is valid", async () => {
      const findSpy = jest.spyOn(Task, "find");
      findSpy.mockResolvedValue({
        name: "Task 1",
        user: "65f4269e9e8ca78b953c9fb6",
      });
      const findByIdSpy = jest.spyOn(User, "findById");
      findByIdSpy.mockResolvedValue({
        _id: "65f4269e9e8ca78b953c9fb6",
        email: email,
      });
      const res = await request(app)
        .get("/api/v1/tasks")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      findSpy.mockRestore();
      findByIdSpy.mockRestore();
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/v1/tasks");
      expect(res.statusCode).toBe(401);
    });
    it("should return 401 if user does not exist", async () => {
      const findByIdSpy = jest.spyOn(User, "findById");
      findByIdSpy.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/v1/tasks")
        .set("Cookie", [`jwt=${token}`]);

      expect(res.statusCode).toBe(401);
      findByIdSpy.mockRestore();
    });

    it("should return 401 if token is invalid", async () => {
      const findByIdSpy = jest.spyOn(User, "findById");
      findByIdSpy.mockResolvedValue({
        _id: "65f4269e9e8ca78b953c9fb6",
        email: email,
      });

      const res = await request(app)
        .get("/api/v1/tasks")
        .set("Cookie", [`jwt=badToken`]);

      expect(res.statusCode).toBe(401);
      findByIdSpy.mockRestore();
    });
  });

  describe("verify Middleware", () => {
    it("should return 401 if token is invalid", async () => {
      const res = await request(app)
        .get("/api/v1/users/verify")
        .set("Cookie", [`jwt=badToken`]);
      expect(res.statusCode).toBe(401);
    });

    it("should return 200 if token is valid", async () => {
      const res = await request(app)
        .get("/api/v1/users/verify")
        .set("Cookie", [`jwt=${token}`]);
      expect(res.statusCode).toBe(200);
    });

    it("should return 401 if token doesnt exist", async () => {
      const res = await request(app).get("/api/v1/users/verify");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /logout", () => {
    it("should return 200 and clear cookie", async () => {
      const res = await request(app).get("/api/v1/users/logout");
      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"][0]).toBe(
        `jwt=loggedout; Path=/; Expires=${new Date(
          Date.now() + 10 * 1000
        ).toUTCString()}; HttpOnly`
      );
    });
  });
});
