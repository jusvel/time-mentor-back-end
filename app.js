const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const taskRouter = require("./routes/taskRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//Allow cors for front end app
app.use(
  cors({
    origin: ["http://localhost:8000", "https://timementor.netlify.app"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials (cookies)
  })
);
app.options("*", cors());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  // console.log(req.body);
  next();
});
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
