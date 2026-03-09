const data = require("../Models/events");

const getEventList = async (req, res) => {
  try {
    let result = await data.find({ _id: req.params.id });
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

module.exports = getEventList;
