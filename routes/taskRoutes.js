const express = require("express");
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(taskController.setTaskUserIds);

router
  .route("/")
  .get(taskController.getMyTasks)
  .post(taskController.createTask);

router.route("/search").get(taskController.getTasksByQuery);

router
  .route("/:id")
  .get(taskController.checkTaskOwnership, taskController.getMyTask)
  .patch(taskController.checkTaskOwnership, taskController.updateMyTask)
  .delete(taskController.checkTaskOwnership, taskController.deleteMyTask);

module.exports = router;
