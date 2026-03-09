const routes = require("express").Router();

routes.post("/order", require("../razorPay/createOrder"));
routes.post("/verify", require("../razorPay/verifyPayment"));

module.exports = routes;