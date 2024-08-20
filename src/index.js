require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require('jsonwebtoken');

const saltRounds = 10; // Количество раундов соли для bcrypt

const app = express();
app.use(express.json());

const allowedDomains = [
  'http://localhost:3000',
  'https://andreisavelyev1989.github.io/bilder_website',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // некоторые старые браузеры (IE11, разные SmartTV) хантрят 204 как ошибку
};

app.use(cors(corsOptions));

const port = process.env.PORT || 5000;

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Определите схему пользователя
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  profile_image: { type: String, default: null },
  lastLogin: Date,
});

// Создайте модель Mongoose
const User = mongoose.model("User", userSchema);

// Роут для регистрации нового пользователя
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Хэшируем пароль

    const newUser = new User({
      username,
      password: hashedPassword,
      profile_image,
      lastLogin: new Date(),
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { username, lastLogin: newUser.lastLogin },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Роут для логина пользователя
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      user.lastLogin = new Date();
      await user.save();
        
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
      );

      res.status(200).json({
        message: "Logged in successfully",
        token: token,
        user: { username, lastLogin: user.lastLogin }
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
