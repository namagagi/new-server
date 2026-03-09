const healthData = require("../Models/health");
const { uploadFileToDrive } = require("../imageUpload");

const adminAddHealthData = async (req, res) => {
  let { _id, userName } = req.user;
  try {
    const {
      projectName,
      projectSector,
      address,
      contact,
      emailId,
      date,
      descriptionProject,
      accountNo,
      ifscCode,
      upiNumber,
      recommended,
      projectType,
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

    let result = new healthData({
      projectName,
      projectSector,
      address,
      contact,
      emailId,
      date,
      descriptionProject,
      accountNo,
      ifscCode,
      upiNumber,
      recommended,
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

module.exports = adminAddHealthData;