const User = require("../Models/login");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();

const signup = async (req, res) => {
  try {
    const { name, email, password, userID ,contact} = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({userName: name, email, password: hashedPassword, userID ,contact});
    await user.save();

    res.json({ result: "Signup Loading", userId: user._id });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const confirmationUrl = `https://cf.api.dk.dakshinakannada.org/confirm/${user._id}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Confirm your email",
      html: `<p style="color: #000000; font-size: 15px; font-family: Arial, sans-serif;">Thank you for signing up with Dakshina Kannada!! <br> Please click the link below to confirm your email address. Once confirmed, your registration will be reviewed by our administrator for approval. You will be notified once your account has been approved.<br></p>
    <a href="${confirmationUrl}" style="color: #1a73e8; font-size: 16px; font-family: Arial, sans-serif;">Confirm your email</a>`,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "shreyasbhandaricse@gmail.com", // Send approval request to your email
      subject: "New user signup approval request",
      html: `
        <p style="color: #000000; font-size: 16px; font-family: Arial, sans-serif;">
            A new user has signed up with the following details:
        </p>
        <p style="color: #000000; font-size: 16px; font-family: Arial, sans-serif;">
            Name of User: ${user.userName} <br>
            Email: ${user.email}<br>
            Role of User: ${user.userID === "1" ? `admin` : `operator`}
        </p>
        <p style="color: #000000; font-size: 16px; font-family: Arial, sans-serif;">
            Please review their details and choose to approve or reject their account:
        </p>
          <a href='https://cf.api.dk.dakshinakannada.org/approve/${
            user._id
          }' style="color: #1a73e8; font-size: 16px; font-family: Arial, sans-serif;"><button >Approve</button></a>
          <a href='https://cf.api.dk.dakshinakannada.org/reject/${
            user._id
          }' style="color: #1a73e8; font-size: 16px; font-family: Arial, sans-serif;"><button >Reject</button></a>
        `,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed. Please try again later." });
  }
};

module.exports = signup;
