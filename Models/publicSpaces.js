const mongoose = require('mongoose');

const publicSpacesSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  village: { type: String, required: true },
  taluk: { type: String, required: true },
  district: { type: String, required: true },
  projectParticular: { type: String, required: true },
  projectObjective: { type: String, required: true },
  fundRaiserName: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  edate: { type: String, required: true },
  amount: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  upiNumber: { type: String, required: true },
  recommended: { type: String, required: true },
  landDetails: { type: String, required: true },
  totalPopulation: { type: String, required: true },
  projectType: { type: String, required: true },
  imagePath: { type: [String], required: false, default: null },
  accessID: { type: String, required: true },
  addedBy: { type: String, required: true },
  amountRecived: { type: Number, default: 0 },
});


module.exports = mongoose.model(
  "publicSpaces",
  publicSpacesSchema,
  "publicSpaces"
);