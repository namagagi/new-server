const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  otpCode: { type: String, required: true },
  attemptCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("otps", otpSchema);
