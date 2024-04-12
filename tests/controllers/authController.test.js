const request = require("supertest");

describe("Auth Controller", () => {
  //CHANGE EMAIL TO A UNIQUE EMAIL EVERYTIME YOU RUN THE TEST
  const email = "test1@email.com";
  let token = "";

  describe("POST /signup", () => {
    it("should create a new user and return a token", async () => {
      const response = await request("127.0.0.1:3000")
        .post("/api/v1/users/signup")
        .send({
          name: "John Doe",
          email: email,
          password: "password123",
          passwordConfirm: "password123",
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("data.user");
      expect(response.body.data.user.email).toBe(email);
    });
  });

  describe("POST /login", () => {
    it("should log in a user and return a token", async () => {
      const response = await request("127.0.0.1:3000")
        .post("/api/v1/users/login")
        .send({
          email: email,
          password: "password123",
        });

      token = response.body.token;
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("data.user");
      expect(response.body.data.user.email).toBe(email);
    });
  });

  describe("GET /verify", () => {
    it("should confirm that user is logged in", async () => {
      const response = await request("127.0.0.1:3000")
        .get("/api/v1/users/verify")
        .set("Cookie", [`jwt=${token}`]);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Authenticated");
    });
  });

  describe("GET /logout", () => {
    it("should log out the user", async () => {
      const response = await request("127.0.0.1:3000").get(
        "/api/v1/users/logout"
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
    });
  });
});
