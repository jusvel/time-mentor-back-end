const Task = require("../models/taskModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

exports.setTaskUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getMyTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ user: req.user.id });

  if (!tasks) return next(new AppError("No tasks found", 404));

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

exports.getMyTask = catchAsync(async (req, res, next) => {
  if (req.params.id === "search") return next();
  const task = await Task.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.updateMyTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.deleteMyTask = catchAsync(async (req, res, next) => {
  await Task.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.createTask = factory.createOne(Task);

exports.checkTaskOwnership = catchAsync(async (req, res, next) => {
  if (req.params.id === "search") return next();
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (task.user.toString() !== req.user.id) {
    return next(
      new AppError("You are not authorized to access this task", 403)
    );
  }
  next();
});

exports.getTasksByQuery = catchAsync(async (req, res, next) => {
  const { query, difficulty } = req.query;
  let searchQuery = {};

  if (query) {
    searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { subject: { $regex: query, $options: "i" } },
      ],
    };
  }

  if (difficulty) {
    searchQuery.difficulty = difficulty;
  }

  const tasks = await Task.find({ ...searchQuery, user: req.user.id });

  if (!tasks.length) {
    return next(new AppError("No tasks found", 404));
  }

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
});
