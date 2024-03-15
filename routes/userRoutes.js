const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/verify", authController.verify);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
