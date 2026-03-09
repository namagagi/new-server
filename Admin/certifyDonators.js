const donatorsModel = require("../Models/donator");
const generateCertificate = require("./generateCertificate");  
const nodemailer = require('nodemailer');
const educationModel = require("../Models/education");
const path = require('path');
require('dotenv').config();

const sendCertificateEmail = async (donatorData, certificatePath,schoolName) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: donatorData.donatorMail,
        subject: 'Thank You for Your Generous Contribution!',
        text: `Dear ${donatorData.donatorName},

We are truly grateful for your generous support! Your contribution is making a tangible difference in transforming the learning experience for students at ${schoolName}.

As a token of our appreciation, we are delighted to present you with a certificate of appreciation. You can view and download your certificate using the pdf below:

Your support is not just a donation—it’s an investment in the brighter future of our community. Together, we are creating a lasting impact that will resonate for generations to come.

With heartfelt regards,
    Namagagi`,
        attachments: [
            {
                filename: 'certificate.pdf',
                path: path.join('/usr/src/app', `${certificatePath}`),  
                contentType: 'application/pdf',
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};

const certifyDonator = async (req, res) => {
    try {
        const { id } = req.params; 
        const { invoiceId} = req.body;

        let imagePaths = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                imagePaths.push(`/invoices/${file.filename}`);
            }
        }

        const updatedDonator = await donatorsModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    invoiceId: invoiceId,
                    invoiceImages: imagePaths,
                    certify: true,
                }
            },
            { new: true }
        );

        const educationData = await educationModel.findById(updatedDonator.projectId);

        if (!updatedDonator) {
            return res.status(404).json({ message: "Donator not found" });
        }

        const schoolName = educationData.schoolName.split("-")[0];


        const certificatePath = await generateCertificate(
            updatedDonator.donatorName.toUpperCase(),
            schoolName,  
            updatedDonator._id
        );

        // Save the certificate link in the database
        updatedDonator.certificateLink = `${process.env.SERVER_URL}${certificatePath}`;
        await updatedDonator.save();

        // Send the certificate via email
        await sendCertificateEmail(updatedDonator, certificatePath,schoolName);

        res.status(200).json({ 
            message: "Donator certified successfully, certificate sent!", 
            donator: updatedDonator 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error certifying donator", error });
    }
};

module.exports = certifyDonator;
