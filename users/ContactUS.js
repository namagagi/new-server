const nodemailer = require("nodemailer");
const Contact_requests = require("../Models/ContactUS");
require("dotenv").config();

const ContactUs = async (req, res) => {
  const { name, email, subject, message } = req.body;
    const data = new Contact_requests({ Name: name, email, subject, message });
    if (name && email && subject && message) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "shreyasbhandaricse@gmail.com",
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send({ error: "The mail is not sent!" });
            }
            data.save();
            res.status(200).send({ message: "The mail sent successfully!!!" });
        });
    } else {
        res.status(403).send({message:"Please enter all the details"})
    }
};

module.exports = ContactUs;
