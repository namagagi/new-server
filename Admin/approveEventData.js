const unApprovedData = require('../Models/notification');
const approvedData = require('../Models/events');

const approveEventData = async (req, res) => {
    try {
        let result = await unApprovedData.findOne({ _id: req.params.id });
        if (result) {
          const insertData = await approvedData.insertMany(result);

            const deleteData = await unApprovedData.deleteOne(result);
            res.send(result);
        } else {    
          res.send('No document found in the collection');
        }
    }
    catch (error) {
        console.error("Error transferring document:", error);
    }
}

module.exports = approveEventData;