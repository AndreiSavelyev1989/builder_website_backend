const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authenticateToken");

router.put("/update-profile", authenticateToken, userController.updateProfile);

module.exports = router;
