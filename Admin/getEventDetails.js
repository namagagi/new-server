const adminData = require('../Models/events');
const operatorData = require('../Models/notification');

const viewDetails = async (req, res) => {
    try {
      let result = await operatorData.findOne({ _id: req.params.id });

      if (result) {
        res.send(result);
      } else {
        result = await adminData.findOne({ _id: req.params.id });

        if (result) {
          res.send(result);
        } else {
          res.status(404).send("Document not found in any database.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
}

module.exports = viewDetails;