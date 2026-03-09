const crypto = require("crypto");
const Payment = require("../Models/razorpay");
require("dotenv").config();

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;
    const secret = process.env.RAZORPAY_SECRET;

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = shasum.digest("hex");

    if (digest === razorpay_signature) {
      try {
        const payment = new Payment({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount,
        });
        await payment.save();

        res.status(200).json({ status: "payment success" });
      } catch (error) {
        res.status(500).json({ status: "failure", message: error.message });
      }
    } else {
      res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};

module.exports = verifyPayment;
