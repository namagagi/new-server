const donatorsNotificationsData = require("../Models/donatorConfirmation");
const OTP = require("../Models/otp");
const { encryptId } = require("../crypto");

const DonatorsNotification = async(req,res) => {
    try {
        const {
          donatorName,
          donatorAddress,
          donatorMail,
          donatorPhone,
          donatedItems,
          totalDonationCost,
          projectId,
        } = req.body;

        let parsedItems = [];
        if (typeof donatedItems === "string") {
          parsedItems = JSON.parse(donatedItems);
        } else {
          parsedItems = donatedItems; 
        }

          
        let result = new donatorsNotificationsData({
          donatorName,
          donatorAddress,
          donatorMail,
          donatorPhone,
          donatedItems: parsedItems,
          totalDonationCost,
          projectId
        });
        result = await result.save();

        
        if (result) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpResult = new OTP({
                userId: result._id,
                otpCode: otp,
              });


            const apiKey = "R1AKX83xhSjTmq6YBtc5dasNOuUvZFykwInVpQi0lJg7obELePTMcR6irZBxkwGeOANWUpqv7aHb0lmE"; 
            const message = `Your OTP code is ${otp}`;
            const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&sender_id=TXTIND&message=${encodeURIComponent( message)}&language=english&route=q&numbers=${donatorPhone}`;

            const response = await fetch(url, {
            method: "GET",
            headers: {
                "cache-control": "no-cache",
            },
            });

            const encryptedUserId = encryptId(result._id);

            const data = await response.json();
            if (data.return) {
                await otpResult.save();
                res.status(200).json({ message: "OTP sent successfully",userId: encryptedUserId });
            } else {
            res
                .status(400)
                .json({ message: "Failed to send OTP", error: data.message });
            }
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", error });
    }
}

module.exports = DonatorsNotification;