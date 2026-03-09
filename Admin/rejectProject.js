const fs = require('fs');
const path = require('path');
const educationNotificationData = require("../Models/educationNotifications");
const healthNotificationData = require("../Models/healthNotifications");
const publicSpacesNotificationData = require("../Models/publicSpacesNotifications");
const rejectedProjects = require("../Models/rejectProjects");

const deleteFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    const fullPath = path.join('/usr/src/app/uploads', filePath.replace('/uploads/', ''));
    fs.unlink(fullPath, (err) => {
    });
  });
};

const rejectProjects = async (req, res) => {
  try {
    let projectType = req.params.pType;
    let result;
    let id = req.params.id;
    const { rejectedReason } = req.body;
    let { userName } = req.user;
    let filePaths = [];

    if (!userName) {
      return res.status(400).send({ message: "Incomplete user data" });
    }

    if (projectType === "1") {
      result = await educationNotificationData.findOne({ _id: id });
      if (!result) {
        return res.status(404).send({ message: "Project not found" });
      }
      const { schoolName, projectName, fundRaiserName, contact, email } =
        result;
      const projectTitle = schoolName || projectName; 
      if (!projectTitle || !fundRaiserName || !contact || !email) {
        return res.status(400).send({ message: "Incomplete project data" });
      }
      filePaths = result.imagePath || [];
      if (filePaths.length > 0) {
      deleteFiles(filePaths);
      }
      await educationNotificationData.deleteOne({ _id: id });
      delete result._id;

      let reject = new rejectedProjects({
        rejectedProjectID: id,
        rejectedProjectName: projectTitle,
        projectGivenBy: fundRaiserName,
        contactNumber: contact,
        email,
        rejectedBy: userName,
        rejectedReason,
      });
      await reject.save();
      res.status(200).send({ message: "Event rejected successfully" }); 
    } else if (projectType === "2") {
      result = await publicSpacesNotificationData.findOne({ _id: id });
      if (!result) {
        return res.status(404).send({ message: "Project not found" });
      }
      const { projectName, fundRaiserName, contact, email } = result;
      if (!projectName || !fundRaiserName || !contact || !email) {
        return res.status(400).send({ message: "Incomplete project data" });
      }
      await publicSpacesNotificationData.deleteOne({ _id: id });
      delete result._id;

      let reject = new rejectedProjects({
        rejectedProjectID: id,
        rejectedProjectName: projectName,
        projectGivenBy: fundRaiserName,
        contactNumber: contact,
        email,
        rejectedBy: userName,
        rejectedReason,
      });
      await reject.save();
      res.status(200).send({ message: "Event rejected successfully" });
    } else if (projectType === "3") {
      result = await healthNotificationData.findOne({ _id: id });
      if (!result) {
        return res.status(404).send({ message: "Project not found" });
      }
      await healthNotificationData.deleteOne({ _id: id });
      delete result._id;

      let reject = new rejectedProjects({
        rejectedProjectID: id,
        rejectedProjectName: result.projectName,
        projectGivenBy: result.fundRaiserName,
        contactNumber: result.contact,
        email: result.email,
        rejectedBy: userName,
        rejectedReason,
      });
      await reject.save();
      res.status(200).send({ message: "Event rejected successfully" });
    } else {
      res.send("No document found in the collection");
      return;
    }
  } catch (error) {
    console.error("Error transferring document:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = rejectProjects;
