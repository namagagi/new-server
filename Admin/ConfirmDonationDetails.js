const nodemailer = require("nodemailer");
const donatorsModel = require("../Models/donator");
const donationConfirmationModel = require("../Models/donatorConfirmation");
const EducationData = require("../Models/education");

const ConfirmDonationDetails = async (req, res) => {
  let { id } = req.params;
  try {
    const donatorData = await donationConfirmationModel.findOne({ _id: id });
    if (donatorData?.otpVerification === true) {
      let parsedItems = [];
      if (typeof donatorData.donatedItems === "string") {
        parsedItems = JSON.parse(donatorData.donatedItems);
      } else {
        parsedItems = donatorData.donatedItems;
      }

      const { donatorName, donatorAddress, donatorMail, donatorPhone, totalDonationCost, projectId } = donatorData;

      let result = new donatorsModel({
        donatorName,
        donatorAddress,
        donatorMail,
        donatorPhone,
        donatedItems: parsedItems,
        totalDonationCost,
        projectId
      });

      result = await result.save();
      if (!result) {
        return res.status(500).json({ message: "Failed to save donator details" });
      }

      for (const donatedItem of parsedItems) {
        const { id, quantity, totalCost } = donatedItem;

        const updated = await EducationData.updateOne(
          { "items._id": id },
          {
            $inc: {
              "items.$.quantity": -quantity,
              "items.$.totalAmount": -totalCost
            }
          }
        );

        if (updated.nModified === 0) {
          return res
            .status(400)
            .json({ message: `Failed to update item with ID ${id}` });
        }
      }


      const updateCost = await EducationData.updateOne(
        {"_id":projectId},
        {
          $inc:{
            "amountReceived": +totalDonationCost,
            "totalAmount": -totalDonationCost,
          }
        }
      )

      if (updateCost.nModified === 0) {
        return res
          .status(400)
          .json({ message: `Failed to update item with ID ${id}` });
      }

      const educationData = await EducationData.findOne({ _id: donatorData.projectId });
      if (!educationData) {
        return res.status(404).json({ message: "Project not found" });
      }

      const schoolName = educationData.schoolName.split("-")[0];

      await Promise.all([
        sendConfirmationEmail(donatorData.donatorMail, donatorData.donatorName,schoolName),
        sendHeadmasterEmail(educationData, donatorData, parsedItems,result._id)
      ]);

      await donationConfirmationModel.findByIdAndDelete(id);

      res.status(200).json({ message: "Verified Successfully" });
    }else {
      return res.status(400).json({ message: "OTP verification failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

const sendConfirmationEmail = async (donatorEmail, donatorName,schoolName) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: donatorEmail,
    subject: "Your Generous Contribution: Donation Successfully Confirmed!",
    text: `Dear ${donatorName},\n\nWe are thrilled to confirm your donation! Your support is a powerful step towards transforming the learning experience for students in ${schoolName} and uplifting our community.\n\nThank you for being a part of this important journey. Together, we are making a lasting impact that will benefit generations to come.\nThe Headmaster/Headmistress of ${schoolName} will be in touch with you shortly to arrange the acceptance of the items you are donating. \nWith sincere gratitude,
Namagagi`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email to donator:", error);
  }
};

// Function to send confirmation email to the headmaster with donator details and project items list
const sendHeadmasterEmail = async (headmasterData, donatorData, donatedItems,donatorID) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Create a list of the donated items
  let itemsList = donatedItems.length > 0
    ? donatedItems.map(item => `- ${item.name}: Quantity: ${item.quantity}, Total Cost: ${item.totalCost}`).join("\n")
    : "No items were donated.";

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: headmasterData.email,
    subject: "Donation Verified",
    text: `Dear ${headmasterData.fundRaiserName},

A donation has been successfully verified. Below are the details of the donator:

Donator Details:
- Name: ${donatorData.donatorName || 'N/A'}
- Email: ${donatorData.donatorMail || 'N/A'}
- Phone: ${donatorData.donatorPhone || 'N/A'}
- Address: ${donatorData.donatorAddress || 'N/A'}
- DonatorId: ${ donatorID || 'N/A'}

Interested in donating:
${itemsList}

Please contact the donar at the above contact number to arrange and collect the donation.

Best regards,
Namagagi`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email to headmaster:", error);
  }
};


module.exports = ConfirmDonationDetails;