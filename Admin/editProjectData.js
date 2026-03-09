const educationData = require("../Models/education");
const healthData = require("../Models/health");
const publicSpacesData = require("../Models/publicSpaces");
const storedEducationData = require("../Models/storedEducationData");
const educationNotificationData = require("../Models/educationNotifications");
// const healthNotificationData = require("../Models/healthNotifications");
// const publicSpacesNotificationData = require("../Models/publicSpacesNotifications");

const editProjectData = async (req, res) => {
  try {
    const role = req.params.role;
    const projectType = req.params.pType;
    const { id } = req.params;
    const { contact, email, description, village, totalAmount, fundRaiserName, items } = req.body;
    const updateData = {};
    let result;

    if (contact) updateData.contact = contact;
    if (email) updateData.email = email;
    if (description) updateData.description = description;
    if (village) updateData.village = village;
    if (totalAmount) updateData.totalAmount = totalAmount;
    if (fundRaiserName) updateData.fundRaiserName = fundRaiserName;

    if (role === "1" || role === "2") {
      if (projectType === "1") {
        result = await educationData.findOne({ _id: id });
        if (result) {
          const newTotalAmount = result.amountReceived + (totalAmount || 0);
          result = await educationData.updateOne({ _id: id }, { $set: updateData });
          updateData.totalAmount = newTotalAmount;
          const storedProject = await storedEducationData.findOne({ projectId: id });
          if (storedProject) {
            await storedEducationData.updateOne({ projectId: id }, { $set: updateData });
            if (items && items.length > 0) {
              items.forEach((newItem) => {
                const itemExists = storedProject.items.some(
                  (existingItem) => existingItem.item === newItem.item
                );
                if (!itemExists) {
                  storedProject.items.push(newItem);
                }
              });
            }
            await storedProject.save();
          }
          if (items && items.length > 0) {
            const existingItems = result.items || [];
            items.forEach((newItem) => {
              const itemExistsInEducation = existingItems.some(
                (existingItem) => existingItem.item === newItem.item
              );
              if (!itemExistsInEducation) {
                existingItems.push(newItem);
              }
            });
            await educationData.updateOne({ _id: id }, { items: existingItems });
          }
        } else {
          const unapprovedProject = await educationNotificationData.findOne({ _id: id });
          if (unapprovedProject) {
            updateData.items = items || [];
            result = await educationNotificationData.updateOne({ _id: id }, { $set: updateData });
          }
        }
      } else if (projectType === "2") {
        result = await publicSpacesData.updateOne({ _id: id }, updateData);
      } else if (projectType === "3") {
        result = await healthData.updateOne({ _id: id }, updateData);
      }

      if (result.matchedCount > 0) {
        res.send(result);
      } else {
        res.status(404).send("Document not found in any database.");
      }
    }
    // else {
    //   if (projectType === "1") {
    //     result = await educationData.updateOne({ _id: id }, updateData);
    //     if (result.matchedCount > 0) {
    //       const doc = await educationData.findOne({ _id: id });
    //       await educationNotificationData.create(doc.toObject());
    //       await educationData.deleteOne({ _id: id });
    //       res.send(doc);
    //     }
    //   } else if (projectType === "2") {
    //     result = await publicSpacesData.updateOne({ _id: id }, updateData);
    //     if (result.matchedCount > 0) {
    //       const doc = await publicSpacesData.findOne({ _id: id });
    //       await publicSpacesNotificationData.create(doc.toObject());
    //       await publicSpacesData.deleteOne({ _id: id });
    //       res.send(doc);
    //     }
    //   } else if (projectType === "3") {
    //     result = await healthData.updateOne({ _id: id }, updateData);
    //     if (result.matchedCount > 0) {
    //       const doc = await healthData.findOne({ _id: id });
    //       await healthNotificationData.create(doc.toObject());
    //       await healthData.deleteOne({ _id: id });
    //       res.send(doc);
    //     }
    //   }
    // }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = editProjectData;
