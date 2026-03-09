const nodemailer = require("nodemailer");
const Login = require("../Models/login");
const OTP = require("../Models/otp");
const {encryptId} = require("../crypto")
require('dotenv').config();

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await Login.findOne({ email });

  if (!user) {
    return res.status(400).send("User with given email does not exist.");
  }

  if (!user.confirmed && !user.approved)
  {
    return res.status(400).send("User without approval can't reset the password.");
  }

  const existingOtp = await OTP.findOne({ userId: user._id });
        if (existingOtp) {
          await OTP.deleteOne({ _id: existingOtp._id });
        }

  const otpCode = Math.floor(100000 + Math.random() * 900000);
  const otp = new OTP({ userId: user._id, otpCode });
  await otp.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset OTP",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.Your OTP is: ${otpCode}\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(500).send("Error while sending email.");
    }
    const encryptedUserId = encryptId(user._id)
      res.status(200).json({userId: encryptedUserId});
  });
};


module.exports = forgotPassword;