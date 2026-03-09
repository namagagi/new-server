const mongoose = require("mongoose");

const rejectSchema = new mongoose.Schema({
  rejectedProjectID: { type: String, required: true },
  rejectedProjectName: { type: String, required: true },
  projectGivenBy: { type: String, requird: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  rejectedBy: { type: String, required: true },
  rejectedReason: { type: String, required: true },
  rejectedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "rejectProjects",
  rejectSchema,
  "rejectProjects"
);
