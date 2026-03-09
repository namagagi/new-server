const eventNotification = require("../Models/notification");
const rejectProjects = require("../Models/rejectProjects");

const rejectEvent = async (req, res) => {
  try {
    let id = req.params.id;
      const { rejectedReason } = req.body;
      const {userName} = req.user;

    // Find the event notification
    let result = await eventNotification.findOne({ _id: id });
    if (!result) {
      return res.status(404).send({ message: "Event not found" });
    }

    const { name, organizers, contact, email} = result;
    if (!name || !organizers || !contact || !email ) {
      return res.status(400).send({ message: "Incomplete event data" });
    }

    // Delete the event notification
    await eventNotification.deleteOne({ _id: id });

    // Find the user
    if (!userName) {
      return res.status(400).send({ message: "Incomplete user data" });
    }

    // Create a new rejected project entry
    let reject = new rejectProjects({
      rejectedProjectID: id,
      rejectedProjectName: name,
      projectGivenBy: organizers,
      contactNumber: contact,
      email,
      rejectedBy: userName,
      rejectedReason,
    });

    await reject.save();

    res.status(200).send({ message: "Event rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

module.exports = rejectEvent;
