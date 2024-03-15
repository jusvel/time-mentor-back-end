const fs = require("fs");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("Connection to database successful");
});

const tasks = JSON.parse(fs.readFileSync(`${__dirname}/tasks.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const importData = async () => {
  try {
    await Task.create(tasks);
    await User.create(users, { validateBeforeSave: false });
    console.log("Data successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Task.deleteMany();
    await User.deleteMany();
    console.log("Data successfully deleted");
    await importData();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

deleteData();
