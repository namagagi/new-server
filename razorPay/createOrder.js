const razorpay = require("../razorpayconfig");

const createOrder = async (req, res) => {
  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
    receipt: "receipt#1",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = createOrder;
