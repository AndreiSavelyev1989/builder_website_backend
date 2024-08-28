const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, username, password } = req.body;

      const newUser = new User({
        email,
        username,
        password,
        lastLogin: new Date(),
      });
      await newUser.save();

      res.status(201).json({
        message: "User registered successfully",
        user: { email, username, lastLogin: newUser.lastLogin },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "3h" }
        );

        res.status(200).json({
          message: "Logged in successfully",
          token: token,
          user: { email, username: user.username, lastLogin: user.lastLogin },
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error logging in", error: err.message });
    }
  },

  googleLogin: async (req, res) => {
    const { accessToken } = req.body;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
      );
      const { email, name, picture } = response.data;

      let user = await User.findOne({ email });

      if (!user) {
        const newUser = new User({
          email,
          username: name,
          profile_image: picture,
          lastLogin: new Date(),
          isGoogleAccount: true,
        });
        await newUser.save();
        user = newUser;
      } else {
        user.lastLogin = new Date();
        user.profile_image = picture;
        await user.save();
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      res.status(200).json({
        message: "Logged in successfully",
        token: token,
        user: {
          email,
          username: user.username,
          lastLogin: user.lastLogin,
          profile_image: user.profile_image,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error logging in with Google",
        error: error.message,
      });
    }
  },

  logout: (req, res) => {
    res.status(200).json({
      message: "Logged out successfully",
    });
  },

  auth: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { email, username, profile_image, lastLogin } = user;
      res.json({ email, username, profile_image, lastLogin });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to retrieve user", error: error.message });
    }
  },
};
