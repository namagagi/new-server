const educationData = require("../Models/education");
const healthData = require("../Models/health");
const publicSpacesData = require("../Models/publicSpaces");
const educationNotificationData = require("../Models/educationNotifications");
const healthNotificationData = require("../Models/healthNotifications");
const publicSpacesNotificationData = require("../Models/publicSpacesNotifications");
const storedEducationData = require("../Models/storedEducationData");

const adminApproveProjects = async (req, res) => {
  try {
    let projectType = req.params.pType;
    let result;

    if (projectType === "1") {
      result = await educationNotificationData.findOneAndDelete({ _id: req.params.id });

      if (!result) {
        return res.status(404).json({ message: "No document found in the collection" });
      }

      const { _id, ...dataWithoutId } = result._doc || result;
      const insertedEducationData = await educationData.create(dataWithoutId);

      const storedEducationEntry = {
        ...dataWithoutId,
        projectId: insertedEducationData._id,
      };

      await storedEducationData.create(storedEducationEntry);

      return res.json({message: "The data approved Successfully!"}); 
    }
    else if (projectType === "2") {
      result = await publicSpacesNotificationData.findOneAndDelete({ _id: req.params.id });

      if (!result) {
        return res.status(404).json({ message: "No document found in the collection" });
      }

      delete result._id;
      await publicSpacesData.insertMany([result]);

      return res.json({message: "The data approved Successfully!"}); 
    } 
    else if (projectType === "3") {
      result = await healthNotificationData.findOneAndDelete({ _id: req.params.id });

      if (!result) {
        return res.status(404).json({ message: "No document found in the collection" });
      }

      delete result._id;
      await healthData.insertMany([result]);

      return res.json({message: "The data approved Successfully!"}); 
    } 
    else {
      return res.status(404).send("No document found in the collection");
    }

  } catch (error) {
    console.error("Error transferring document:", error);
    return res.status(500).send("Internal server error");
  }
};

module.exports = adminApproveProjects;
