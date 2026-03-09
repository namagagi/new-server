const cron = require('node-cron');
const donationConfirmationModel = require("./Models/donatorConfirmation");

async function removeUnverifiedDonations() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  try {
    const unverifiedDonations = await donationConfirmationModel.deleteMany({
      createdAt: { $lt: fiveMinutesAgo },
      otpVerification: false,
    });
  } catch (error) {
    console.error("Error while removing unverified donations:", error);
  }
}

cron.schedule('* * * * *', () => {
  removeUnverifiedDonations();
});


module.exports = removeUnverifiedDonations;
