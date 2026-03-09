const donatorsModel = require("../Models/donator");
const EducationData = require("../Models/education");

const RejectDonationDetails = async (req, res) => {
            const { id } = req.params;
    try {
        const donatorData = await donatorsModel.findOne({ _id: id });
        let parsedItems = [];
        if (typeof donatorData.donatedItems === "string") {
          parsedItems = JSON.parse(donatorData.donatedItems);
        } else {
          parsedItems = donatorData.donatedItems;
        }

        for (const donatedItem of parsedItems) {
          const { id: itemId, quantity, totalCost } = donatedItem;
          const updated = await EducationData.updateOne(
            { "items._id": itemId },
            {
              $inc: {
                "items.$.quantity": +quantity,
                "items.$.totalAmount": +totalCost,
              },
            }
          );

          if (updated.nModified === 0) {
            return res
              .status(400)
              .json({ message: `Failed to update item with ID ${id}` });
          }
        }

        const updateCost = await EducationData.updateOne(
          {"_id":donatorData.projectId},
          {
            $inc:{
              "amountReceived": -donatorData.totalDonationCost,
              "totalAmount": +donatorData.totalDonationCost,
            }
          }
        )
        if (updateCost.nModified === 0) {
          return res
            .status(400)
            .json({ message: `Failed to update item with ID ${id}` });
        }

        await donatorsModel.deleteOne({ _id: id });

        res.status(200).json({ message: "The donator details deleted successfully.." });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong", error });
    }
}

module.exports = RejectDonationDetails;