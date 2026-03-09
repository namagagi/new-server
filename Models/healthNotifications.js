const mongoose = require('mongoose');

const healthNotificationsSchema = new mongoose.Schema({
  projectName: { type: String, default: null },
  projectSector: { type: String, default: null },
  address: { type: String, default: null },
  contact: { type: String, default: null },
  emailId: { type: String, default: null },
  date: { type: String, default: null },
  descriptionProject: { type: String, default: null },
  accountNo: { type: String, default: null },
  ifscCode: { type: String, default: null },
  upiNumber: { type: String, default: null },
  recommended: { type: String, default: null },
  imagePath: { type: [String], required: false, default: null },
  accessID: { type: String, required: true },
  addedBy: { type: String, required: true },
  amountRecived: { type: Number, default: 0 },
});


module.exports = mongoose.model(
  "healthNotifications",
  healthNotificationsSchema,
  "healthNotifications"
);