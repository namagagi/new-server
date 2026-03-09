const adminData = require("../Models/publicSpaces");

const viewPublicSpacesDetails = async (req, res) => {
  try {
    let result = await adminData.findOne({ _id: req.params.id });

    if (result) {
      res.status(200).send({ id: result._id });
    } else {
      res.status(404).send("Document not found in any database.");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = viewPublicSpacesDetails;
