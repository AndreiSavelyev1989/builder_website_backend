require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const saltRounds = 10;

const app = express();
app.use(express.json());

const allowedDomains = [
  "http://localhost:3000",
  "https://andreisavelyev1989.github.io/bilder_website",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).send({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ message: "Invalid token" });

    req.user = user;
    next();
  });
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: String,
  password: String,
  profile_image: { type: String, default: null },
  lastLogin: Date,
  isGoogleAccount: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
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
});

app.post("/login", async (req, res) => {
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
});

app.post("/google-login", async (req, res) => {
  const { accessToken } = req.body;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
    );
    const { email, name, picture } = response.data;

    let user = await User.findOne({ email });
    console.log(response);

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
    res
      .status(500)
      .json({ message: "Error logging in with Google", error: error.message });
  }
});

app.post("/logout", (req, res) => {
  res.status(200).json({
    message: "Logged out successfully",
  });
});

app.get("/auth", authenticateToken, async (req, res) => {
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
});

app.listen(port, () => console.log(`Server running on port ${port}`));
