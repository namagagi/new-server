const donatorData = require("../Models/donatorConfirmation");

const RejectDonator = async (req, res) => {
    try {
        const data = await donatorData.findById(req.params.id);
        
        if (!data) {
            return res.status(404).json({ message: "Donator not found" });
        }

        await donatorData.deleteOne({ _id: req.params.id });
        
        return res.status(200).json({ message: "Donator rejected successfully" });
    } catch (error) {
        console.error("Error rejecting donator:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = RejectDonator;
