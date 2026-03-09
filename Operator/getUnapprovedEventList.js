const data = require('../Models/notification');

const getUnapprovedList = async(req, res) => {
    try {
        let result = await data.find();
        if (result) {
            res.status(200).send(result);
        }
        else {
            res.status(500).json({ message: "List is empty", error });
        }
    }
    catch (error)
    {
        res.status(500).json({ message: "Somthing is wrong", error });
    }
}

module.exports = getUnapprovedList;