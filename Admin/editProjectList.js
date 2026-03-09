const educationData = require("../Models/education");

const editProjectList = async (req, res) => {
  try {
    const role = req.params.role;
    const projectType = req.params.pType;
    const { id } = req.params;
    const { totalAmount, items } = req.body;
    let updateData = {};
    let result;

    if (role === "1" && projectType === "1") {
      result = await educationData.findById(id);
      if (!result) {
        return res.status(404).send("Document not found in any database.");
      }
      const newAmountReceived = result.amountReceived + (result.totalAmount - totalAmount);
      updateData = {
        $set: {
          items,
          totalAmount,
          amountReceived: newAmountReceived
        }
      };
      const updateResult = await educationData.updateOne({ _id: id }, updateData);

      if (updateResult.matchedCount > 0) {
        res.status(200).json({message: "The data updated successfully!"});
      } else {
        res.status(404).json({message: "Document not found in any database."});
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = editProjectList;
