const fs = require('fs');
const path = require('path');
const educationData = require("../Models/education");
const healthData = require("../Models/health");
const publicSpacesData = require("../Models/publicSpaces");
const storedEducationData = require("../Models/storedEducationData");
const educationNotificationModel = require("../Models/educationNotifications");

const deleteFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    const fullPath = path.join('/usr/src/app/uploads', filePath.replace('/uploads/', ''));
    fs.unlink(fullPath, (err) => {
    });
  });
};

const DeleteProject = async (req, res) => {
  try {
    const projectType = req.params.pType;
    const projectId = req.params.id;
    let filePaths = [];

    if (projectType === "1") {
      const education = await educationData.findById(projectId);
      if (education) {
        filePaths = education.imagePath || [];
        await educationData.deleteOne({ _id: projectId });
        await storedEducationData.deleteOne({projectId: projectId});
      }else{
        const educationNotification = await educationNotificationModel.findById(projectId);
        filePaths = educationNotification.imagePath || [];
        await educationNotification.deleteOne({_id: projectId});
      }
    } else if (projectType === "2") {
      const publicSpaces = await publicSpacesData.findById(projectId);
      if (publicSpaces) {
        filePaths = publicSpaces.imagePath || [];
        await publicSpacesData.deleteOne({ _id: projectId });
      }
    } else if (projectType === "3") {
      const health = await healthData.findById(projectId);
      if (health) {
        filePaths = health.imagePath || [];
        await healthData.deleteOne({ _id: projectId });
      }
    }

    if (filePaths.length > 0) {
      deleteFiles(filePaths);
    }

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error:", error });
  }
};

module.exports = DeleteProject;
