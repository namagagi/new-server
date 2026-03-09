const User = require("../Models/login");
const bcrypt = require("bcrypt");
const OTP = require("../Models/otp");
const nodemailer = require("nodemailer");
const { encryptId }= require("../crypto");
require("dotenv").config();
const login = async (req, res) => {
  try {
    if (req.body.email && req.body.password && req.body.userID) {
      const { email, password, userID } = req.body;
      let user = await User.findOne({ email, userID });

      if (!user) {
        return res.status(401).json({ message: "User Not Found" });
      }

      let Password = await bcrypt.compare(password, user.password);
      if (
        user &&
        Password &&
        user.confirmed === true &&
        user.approved === true
      ) {
        const existingOtp = await OTP.findOne({ userId: user._id });
        if (existingOtp) {
          await OTP.deleteOne({ _id: existingOtp._id });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const otp = new OTP({ userId: user._id, otpCode });
        await otp.save();

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mail = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "OTP for Login",
          text: `Your OTP for login is ${otpCode}. This OTP is valid for 5 minutes.`,
        };

        transporter.sendMail(mail, (error, info) => {
          if (error) {
            return res.status(500).json({ error: "Failed to send OTP" });
          }
    
          const encryptedUserId = encryptId(user._id);
          res.status(200).json({
            message: "OTP sent to your email for verification",
            userId: encryptedUserId,userName: user.userName,
          });
        });
      } else {
        res.status(403).json({
          message: "Invalid password or account not confirmed/approved",
        });
      }
    } else {
      res
        .status(400)
        .json({ message: "Email, Password and UserID are required" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while logging in the user" });
  }
};

module.exports = login;
