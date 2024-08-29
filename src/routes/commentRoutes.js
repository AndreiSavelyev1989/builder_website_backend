const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../middlewares/authenticateToken");

router.post("/comment", authenticateToken, commentController.createComment);
router.delete("/comment/:id", authenticateToken, commentController.deleteComment);
router.get("/comments", commentController.getComments);

module.exports = router;
