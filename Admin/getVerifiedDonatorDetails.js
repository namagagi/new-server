const donatorsModel = require("../Models/donator");
const educationModel = require("../Models/education");

const getDonatorDetails = async (req, res) => {
    try {
        const {userName, userID} = req.user;
        let donatorData;
        if(userID === "1")
        {
            donatorData = await donatorsModel.find();
        }else{
            const zone = userName.split("_")[1];
            const projectIdsInZone = await educationModel.find({ zone }).distinct("_id");

            donatorData = await donatorsModel.find({ projectId: { $in: projectIdsInZone } });
        }
        
        res.status(200).json({ result: donatorData }); 
    } catch (error)
    {
        console.log(error);
        res.status(500).json({ message: "An error occured", error });
    }
}

module.exports = getDonatorDetails;