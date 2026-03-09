const educationData = require("../Models/education");
const healthData = require("../Models/health");
const publicSpacesData = require("../Models/publicSpaces");
const educationNotificationData = require("../Models/educationNotifications");
const healthNotificationData = require("../Models/healthNotifications");
const publicSpacesNotificationData = require("../Models/publicSpacesNotifications");

const collections = [
  educationData,
  healthData,
  publicSpacesData,
  educationNotificationData,
  healthNotificationData,
  publicSpacesNotificationData,
];

const getProjectDetails = async(req,res) => {
     try {
       let result = null;

       for (const collection of collections) {
         result = await collection.findOne({ _id: req.params.id });
         if (result) {
           res.send(result);
           return;
         }
         }
         
       res.status(404).send("Document not found in any database.");
     } catch (error) {
       console.error("Error:", error);
       res.status(500).send("Internal Server Error");
     }
}

module.exports = getProjectDetails;