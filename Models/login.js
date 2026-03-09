const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  userName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: false, unique: true },
  password: { type: String, required: true },
  userID: { type: String, required: true },
  confirmed: {type: Boolean,default: false},
  approved: { type: Boolean, default: false },
  tokens: [{type: Object}],
});

module.exports = mongoose.model("logins", loginSchema);
