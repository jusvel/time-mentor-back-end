const request = require("supertest");

describe("Auth Controller", () => {
  //CHANGE EMAIL TO A UNIQUE EMAIL EVERYTIME YOU RUN THE TEST
  const email = "test1@email.com";

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
      console.log(response);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("data.user");
      expect(response.body.data.user.email).toBe(email);
    });
  });
});
