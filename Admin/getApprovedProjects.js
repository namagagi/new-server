const educationData = require("../Models/education");
const healthData = require("../Models/health");
const publicSpaces = require("../Models/publicSpaces");

const getApprovedprojects = async (req, res) => {
  try {
    const {userName, userID} = req.user;
    const zone = userName.split("_")[1];
    let approvedEducationData,approvedHealthData,approvedPublicSpacesData;

    if(userID === "1")
    {
    approvedEducationData = await educationData.find();
    approvedHealthData = await healthData.find();
    approvedPublicSpacesData = await publicSpaces.find();
    }else{
    approvedEducationData = await educationData.find({zone: zone});
    approvedHealthData = await healthData.find({zone: zone});
    approvedPublicSpacesData = await publicSpaces.find({zone: zone});
    }

    const combinedData = {
      education: approvedEducationData,
      health: approvedHealthData,
      publicSpaces: approvedPublicSpacesData,
    };

    res.status(200).json(combinedData);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "error", error });
  }
};

module.exports = getApprovedprojects;
