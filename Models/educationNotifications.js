const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  item: { type: String, required: true },   
  quantity: { type: Number, required: true, min: 0 },  
  amount: { type: Number, required: true, min: 0 },    
  totalAmount: { type: Number, required: true, min: 0 } 
});

const educationNotificationSchema = new mongoose.Schema({
  schoolName: { type: String, required: false },
  projectSector: { type: String, required: true },
  village: { type: String, required: true },
  taluk: { type: String, required: true },
  zone: {type: String, required:true},
  district: { type: String, required: false },
  fundRaiserName: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true}, 
  edate: { type: String, required: false }, 
  totalAmount: { type: Number, required: true }, 
  description: { type: String, required: true },
  accountNumber: { type: String, required: false },
  ifscCode: { type: String, required: false },
  upiNumber: { type: String, required: false },
  recommended: { type: String, required: false },
  projectName: { type: String, required: false },
  landDetails: { type: String, required: false },
  totalPopulation: { type: Number, required: false }, 
  projectType: { type: String, required: true },
  imagePath: { type: [String], required: false, default: [] }, 
  accessID: { type: String, required: true },
  addedBy: { type: String, required: true },
  amountReceived: { type: Number, default: 0 }, 
  items: [itemSchema],
});


module.exports = mongoose.model(
  "educationNotifications",
  educationNotificationSchema,
  "educationNotifications"
);