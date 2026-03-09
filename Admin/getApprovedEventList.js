const data = require('../Models/events');

const getEventList = async(req, res) => {
    let result =await data.find();
    if (result) {
        res.status(200).json(result);
    }
    else {
        res.status(500).json({message:"Error"})
    }
}

module.exports = getEventList;