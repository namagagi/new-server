const jwt = require("jsonwebtoken");
const User = require("./Models/login");
require('dotenv').config();

const authenticate = (req, res, next) => {
  let token = req.headers["authorization"];
  const sessionId = req.cookies.sessionId;

  if (token) {
    token = token.split("bearer")[1];
    jwt.verify(token, process.env.SECRATE_KEY, async(err, valid) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
      } else {
        const user = await User.findOne({
          _id: valid._id,
          "tokens.token": token,
          "tokens.sessionId": sessionId,
        });

        if (!user) {
          return res.status(401).json({ message: "Session is invalid. Please log in again." });
        }
    
        req.user = valid;
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authenticate;
