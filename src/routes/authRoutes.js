const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const { authenticateToken } = require("../middlewares/authenticateToken.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google-login", authController.googleLogin);
router.post("/logout", authenticateToken, authController.logout);
router.get("/auth", authenticateToken, authController.auth);

module.exports = router;
