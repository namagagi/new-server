const educationNotificationData = require("../Models/educationNotifications");

const addEducationData = async (req, res) => {
  let { _id, userName } = req.user;
  try {
    const {
      projectType,
      projectSector,
      schoolName,
      village,
      taluk,
      zone,
      district,
      fundRaiserName,
      contact,
      email,
      edate,
      amount,
      description,
      accountNumber,
      ifscCode,
      upiNumber,
      recommended,
      projectName,
      landDetails,
      totalPopulation,
      items
    } = req.body;

    let parsedItems = [];
    if (typeof items === 'string') {
      parsedItems = JSON.parse(items);
    } else {
      parsedItems = items; 
    }

        let imagePaths = [];

        if (req.files && req.files.length > 0) {
          for (const file of req.files) {
            imagePaths.push(`/uploads/${file.filename}`);
          }
        } else {
          imagePaths = [];
        }
    
    const operatorData = new educationNotificationData({
      projectType,
      projectSector,
      schoolName,
      village,
      taluk,
      zone,
      district,
      fundRaiserName,
      contact,
      email,
      edate,
      totalAmount: amount,
      description,
      accountNumber,
      ifscCode,
      upiNumber,
      recommended,
      projectName,
      landDetails,
      totalPopulation,
      imagePath: imagePaths,
      accessID: _id,
      addedBy: userName,
      items: parsedItems
    });
    const result = await operatorData.save();
    if (result) {
      res.send({ message: "Data added successfully!!!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = addEducationData;
