const Comment = require("../models/comment");

module.exports = {
  createComment: async (req, res) => {
    const { text, rating } = req.body;
    const email = req.user.email;

    if (rating === undefined) {
      return res.status(400).json({ message: "Rating is required" });
    }

    try {
      const newComment = new Comment({
        email,
        text,
        rating,
      });
      await newComment.save();
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getComments: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const skip = (page - 1) * pageSize;

    try {
      const commentsWithUsers = await Comment.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "email",
            foreignField: "email",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            email: 1,
            text: 1,
            createdAt: 1,
            updatedAt: 1,
            rating: 1,
            "user.username": 1,
            "user.profile_image": 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        { $skip: skip },
        { $limit: pageSize },
      ]);
      res.status(200).json({
        currentPage: page,
        pageSize: pageSize,
        comments: commentsWithUsers,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch comments with user data",
        error: error.message,
      });
    }
  },
};
