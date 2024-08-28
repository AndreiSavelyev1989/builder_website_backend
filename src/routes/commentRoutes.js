const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../middlewares/authenticateToken");

router.post("/comment", authenticateToken, commentController.createComment);
router.get("/comments", commentController.getComments);

module.exports = router;
