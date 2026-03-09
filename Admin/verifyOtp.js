const User = require("../Models/login");
const Otp = require("../Models/otp");
const jwt = require("jsonwebtoken");
const {decryptId} = require("../crypto");
require("dotenv").config();

const verifyOtp = async (req, res) => {
  try {
    let { userId, otp } = req.body;
      userId = decryptId(userId);


    const otpRecord = await Otp.findOne({ userId});
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP  or OTP has expired." });
    }

    if (otpRecord.attemptCount >= 5) {
      await Otp.deleteOne({ userId: userId }); 
      return res.status(403).json({ message: "Maximum attempts reached. Please log in again." });
    }

    if(otpRecord.otpCode === otp){
    await Otp.deleteOne({ userId: userId }); 
    const user = await User.findById(userId);
    const payload = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      userID: user.userID,
    };
    jwt.sign(
      payload,
      process.env.SECRATE_KEY,
      { expiresIn: "10h" },
      async (err, token) => {
        if (err) {
          res.send({
            message: "Something Went Wrong, Please try after sometime",
          });
        }
        let oldTokens = user.tokens || [];

        if (oldTokens.length) {
          oldTokens = oldTokens.filter((t) => {
            const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
            if (timeDiff < 36000) {
              return t;
            }
          });
        }

        const sessionId = Date.now().toString();
        await User.findByIdAndUpdate(user._id, {
          tokens: [...oldTokens, { token, sessionId,signedAt: Date.now().toString() }],
        });

        res.cookie("sessionId", sessionId, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === "production", 
          sameSite: "strict",
          maxAge: 36000000, 
        });

        res.send({ user: user.userID, auth: token, userId: userId });
      }
    );
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

module.exports = verifyOtp;
