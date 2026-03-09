const User = require("../Models/login");
const Otp = require("../Models/otp");
const {decryptId} = require("../crypto")

const verifyForgotOtp = async (req, res) => {
  try {
    let { userId, otp } = req.body;
    userId = decryptId(userId);
    
    const otpRecord = await Otp.findOne({ userId});
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.attemptCount >= 5) {
      await Otp.deleteOne({ userId: userId }); 
      return res.status(403).json({ message: "Maximum attempts reached. Please log in again." });
    }

    if(otpRecord.otpCode === otp){
    await Otp.deleteOne({ userId: userId }); 
    const user = await User.findById(userId);
    res.send({ userId: user._id });
    }else {
      otpRecord.attemptCount += 1;
      await otpRecord.save();
      return res.status(400).json({
        message: `Invalid OTP. ${5 - otpRecord.attemptCount} attempts remaining.`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while verifying OTP" });
  }
};

module.exports = verifyForgotOtp;
