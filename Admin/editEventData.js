const eventsData = require("../Models/events");
const notificationsData = require("../Models/notification");

const editEventData = async (req, res) => {
  try {
    let role = req.params.role;
    if (role === '1') {
     let result = await eventsData.updateOne(
        { _id: req.params.id },
        {
          $set: req.body
        }
      );

      if (result.matchedCount > 0) {
        res.send(result);
      } else {
        res.status(404).send("Document not found in any database.");
      }
    } else {
      result = await eventsData.updateOne(
        { _id: req.params.id },
        {
          $set: req.body
        }
      );
      if (result.matchedCount > 0) {
        let result = await eventsData.findOne({ _id: req.params.id });
        await notificationsData.insertMany(result);
        await eventsData.deleteOne(result);
        res.send(result);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = editEventData;
