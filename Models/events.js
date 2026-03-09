const mongoose = require("mongoose");

const addDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  organizers: { type: String, required: true },
  sdate: { type: String, required: true },
  edate: { type: String, required: true },
  email: {type: String, required:true},
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  address: { type: String, required: true },
  accountNumber: { type: String, required: true },
  IFSC: { type: String, required: true },
  UPI: { type: String, required: true },
  recommendedBy: { type: String, required: true },
  imagePath: { type: [String], required: false, default: null },
  accessID: { type: String, required: true },
  addedBy: { type: String, required: true },
  amountRecived: { type: Number, default: 0},
});

module.exports = mongoose.model("events", addDataSchema);
