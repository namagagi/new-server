const User = require("../Models/login");

const Logout = async (req, res) => {
  // Ensure the authorization header is present
  if (req.headers && req.headers["authorization"]) {
    let token = req.headers["authorization"];
    token = token.split("bearer")[1]; // Adjust to handle the token format without a space

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization Fail!" });
    }

    try {
      // Fetch the user from the database using the user ID from req.user
      const user = await User.findById(req.user._id);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found!" });
      }

      // Filter out the current token from the user's token list
      const tokens = user.tokens || [];
      const newTokens = tokens.filter((t) => t.token !== token);

      // Update the user document with the filtered tokens
      user.tokens = newTokens;
      await user.save();

      return res.json({ success: true, message: "Logged out successfully!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error!" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "No authorization header found!" });
  }
};

module.exports = Logout;
