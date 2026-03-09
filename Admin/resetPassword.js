const Login = require("../Models/login");
const {decryptId} = require("../crypto")
const bcrypt = require("bcrypt");
const saltRounds = 10;

const resetPassword = async (req, res) => {
  try {
    let { userId, newPassword } = req.body;
    userId = decryptId(userId);

    
    const user = await Login.findOne({ _id: userId });

    if (!user) {
      return res.status(400).send("Invalid OTP or OTP has expired.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;

    await user.save();

      res.status(200).send({ message: "Password has been reset." });
  } catch (error) {
    console.error("Error resetting password:", error);
      res.status(500).send({ message: "An error occurred while resetting the password." });
  }
};

module.exports = resetPassword;
