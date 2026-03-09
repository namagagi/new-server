const educationNotificationData = require("../Models/educationNotifications");
const healthNotificationData = require("../Models/healthNotifications");
const publicSpacesNotificationData = require("../Models/publicSpacesNotifications");

const getUnApprovedprojects = async (req, res) => {
  try {

    const { userName, userID } = req.user;

    const zone = userName.split("_")[1];

    let unApprovedEducationData, unApprovedHealthData, unApprovedPublicSpacesData;
    if (userID === "1") {
      unApprovedEducationData = await educationNotificationData.find();
      unApprovedHealthData = await healthNotificationData.find();
      unApprovedPublicSpacesData = await publicSpacesNotificationData.find();
    } else {
      unApprovedEducationData = await educationNotificationData.find({zone: zone});
      unApprovedHealthData = await healthNotificationData.find({zone: zone});
      unApprovedPublicSpacesData = await publicSpacesNotificationData.find({zone: zone});
    }

    const combinedData = {
      education: unApprovedEducationData,
      health: unApprovedHealthData,
      publicSpaces: unApprovedPublicSpacesData,
    };

    res.status(200).json(combinedData);
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

module.exports = getUnApprovedprojects;
