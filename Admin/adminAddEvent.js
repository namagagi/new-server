const data = require("../Models/events");
const { uploadFileToDrive } = require("../imageUpload");

const adminAddData = async (req, res) => {
  let { _id, userName } = req.user;
  try {
    const {
      name,
      address,
      contact,
      organizers,
      email,
      sdate,
      edate,
      description,
      accountNumber,
      IFSC,
      UPI,
      recommendedBy,
      amount,
    } = req.body;

    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileId = await uploadFileToDrive(file.buffer, file.originalname);
        imagePaths.push(`https://drive.google.com/thumbnail?id=${fileId}`);
      }
    } else {
      imagePaths = null; // No files uploaded
    }

    let result = new data({
      name,
      address,
      contact,
      organizers,
      email,
      sdate,
      edate,
      description,
      amount,
      accountNumber,
      IFSC,
      UPI,
      recommendedBy,
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

module.exports = adminAddData;
