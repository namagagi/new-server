const eduactionModel = require("../Models/education");

const getEduactionDetails = async (req, res) => {
    try {
        const eduactionData = await eduactionModel.find();
        res.status(200).json({ result: eduactionData }); 
    } catch (error)
    {
        console.log(error);
        res.status(500).json({ message: "An error occured", error });
    }
}

module.exports = getEduactionDetails;