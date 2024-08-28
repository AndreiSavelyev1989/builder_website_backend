const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: String,
  password: String,
  profile_image: { type: String, default: null },
  lastLogin: Date,
  isGoogleAccount: { type: Boolean, default: false },
});

userSchema.pre("save", async function (next) {
  // only hash the password if it has been modified (or is new)
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
