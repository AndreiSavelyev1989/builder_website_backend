const User = require("../models/user");

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, profile_image } = req.body;

    if (username) {
      user.username = username;
    }

    if (profile_image && isValidHttpUrl(profile_image)) {
      user.profile_image = profile_image;
    } else if (profile_image) {
      return res.status(400).json({ message: "Invalid profile image URL" });
    }

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        email: user.email,
        username: user.username,
        lastLogin: user.lastLogin,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

// Helper function to validate URLs
function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
