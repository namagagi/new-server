const publicSpacesData = require("../Models/publicSpaces");
const { uploadFileToDrive } = require("../imageUpload");

const adminAddPublicSpaceData = async (req, res) => {
  let { _id, userName } = req.user;
  try {
    const {
      projectType,
      projectName,
      village,
      taluk,
      district,
      fundRaiserName,
      contact,
      email,
      edate,
      amount,
      accountNumber,
      ifscCode,
      upiNumber,
      recommended,
      totalPopulation,
      landDetails,
      projectParticular,
      projectObjective,
    } = req.body;

        let imagePaths = [];

        if (req.files && req.files.length > 0) {
          for (const file of req.files) {
            const fileId = await uploadFileToDrive(
              file.buffer,
              file.originalname
            );
            imagePaths.push(`https://drive.google.com/thumbnail?id=${fileId}`);
          }
        } else {
          imagePaths = null; // No files uploaded
        }

    let result = new publicSpacesData({
      projectType,
      village,
      taluk,
      district,
      fundRaiserName,
      contact,
      email,
      edate,
      amount,
      accountNumber,
      ifscCode,
      upiNumber,
      recommended,
      projectName,
      totalPopulation,
      landDetails,
      projectParticular,
      projectObjective,
      imagePath: imagePaths,
      accessID: _id,
      addedBy: userName,
    });
    result = await result.save();
    if (result) {
      res.send({ result: "Data added successfully!!!" });
    } 
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }


};

module.exports = adminAddPublicSpaceData;
