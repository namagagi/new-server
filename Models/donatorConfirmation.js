const mongoose = require("mongoose");

const donationConfirmationDetails = new mongoose.Schema({
    donatorName: { type: String, required: true },
    donatorAddress: { type: String, required: true },
    donatorMail: { type: String, required: true},
    donatorPhone: { type: Number, required: true },
    donatedItems: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        totalCost: { type: Number, required: true },
    }],
    totalDonationCost: { type: Number, required: true },
    projectId: { type: String, required: true },
    otpVerification: {type: Boolean, default:false},
    createdAt: { type: Date, default: Date.now},
})

module.exports = mongoose.model("donatorsNotifications", donationConfirmationDetails, "donatorsNotifications");