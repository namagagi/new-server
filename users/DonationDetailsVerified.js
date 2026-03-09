const nodemailer = require("nodemailer");
const donatorsNotificationModal = require("../Models/donatorConfirmation");
const Otp = require("../Models/otp");
const educationData = require("../Models/education");
const User = require("../Models/login");
const {decryptId} = require("../crypto");
require('dotenv').config();

const DonationDetails = async (req, res) => {
    try {
        let { userId, otp } = req.body;
        userId = decryptId(userId)
        const otpRecord = await Otp.findOne({ userId, otpCode: otp });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const donatorsDetails = await donatorsNotificationModal.findById(userId);
        if (!donatorsDetails) {
            return res.status(404).json({ message: "Donator details not found" });
        }

        donatorsDetails.otpVerification = true;

        await donatorsDetails.save();

        const result = await educationData.findOne({_id: donatorsDetails.projectId},{zone: 1, _id:0});
        const zone = result.zone;
        const user = `BEO_${zone}`;
        const operatorEmail = await User.findOne({userName: user},{email: 1, _id:0})
        await Promise.all([
            sendVerificationEmail(operatorEmail,donatorsDetails.donatorName, zone),
        ])

        res.status(200).json({ userId });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", error });
    }

};

const sendVerificationEmail = async (operatorEmail, donatorName, zone) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: operatorEmail,
    subject: `Donation Request Notification: ${donatorName} Wants to Donate`,
    text: `Dear BEO,

        We have received a donation request for the school in your zone, "${zone}".
        
        Donator Details:
        - Name: ${donatorName}
        
        Please review the request and take necessary action.
        
        Best regards,
        Namagagi`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email to donator:", error);
  }
};

module.exports = DonationDetails;
