const User = require('../Models/login');

const approveUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Approve the user by setting a flag or updating their status
      user.approved = true;
      await user.save();

      res.redirect("/approveSignUp.html");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Approval failed. Please try again later." });
    }
}

module.exports = approveUser;