const educationData = require("../Models/education");
const healthData = require("../Models/health");
const publicSpaces = require("../Models/publicSpaces");

const getApprovedprojects = async (req, res) => {
  try {

    const approvedEducationData = await educationData.find().select("-accessID").select("-addedBy");
    const approvedHealthData = await healthData.find().select("-accessID").select("-addedBy");
    const approvedPublicSpacesData = await publicSpaces.find().select("-accessID").select("-addedBy");


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
