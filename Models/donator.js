const mongoose = require("mongoose");

const donationDetails = new mongoose.Schema({
    donatorName: { type: String, required: true },
    donatorAddress: { type: String, required: true },
    donatorMail: { type: String, required: true},
    donatorPhone: { type: Number, required: true},
    donatedItems: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        totalCost: { type: Number, required: true },
    }],
    totalDonationCost: { type: Number, required: true },
    projectId: { type: String, required: true },
    invoiceId: {type:String},
    certify:{type: Boolean, default:false},
    invoiceImages:  { type: [String], required: false, default: [] },
    certificateLink: {type:String}
})

module.exports = mongoose.model("donators", donationDetails);