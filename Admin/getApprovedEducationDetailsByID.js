const adminData = require("../Models/education");

const viewEducationDetails = async (req, res) => {
  try {
    let result = await adminData.findOne({ _id: req.params.id });

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send("Document not found in any database.");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = viewEducationDetails;
