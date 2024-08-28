require("dotenv").config();

module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  allowedDomains: [
    "http://localhost:3000",
    "https://andreisavelyev1989.github.io",
  ],
};
