const donatorData = require("../Models/donatorConfirmation");
const educationModel = require("../Models/education");

const getDonatorDataDetails = async (req, res) => {
    try {
        const donatorResult = await donatorData.findOne({ _id: req.params.id });

        if (donatorResult) {
            const educationResult = await educationModel.findOne({ _id: donatorResult.projectId });

            res.status(200).json({ donator: donatorResult, education: educationResult });
        } else {
            res.status(404).send("There is no data for the specified donator ID.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = getDonatorDataDetails;
