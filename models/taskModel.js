const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Task must have a title."],
    },
    subject: {
      type: String,
    },
    difficulty: {
      type: String,
      required: [true, "Task must have a difficulty."],
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficulty is either: easy, medium or hard.",
      },
    },
    estimatedDuration: {
      type: Number,
      required: [true, "Task must have an estimated duration."],
    },
    deadline: {
      type: Date,
      required: [true, "Task must have a deadline."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
