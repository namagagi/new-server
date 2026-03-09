const mongoose = require("mongoose");
require('dotenv').config();

const dbConnect = async() => {
    try {
        await mongoose.connect(
         	process.env.DB_NAME,
          { useNewUrlParser: true, useUnifiedTopology: true }
        );
        console.log("Conected to mongodb");
    }
    catch(error) {
        console.error("Error:", error);
    }
} 
module.exports = dbConnect;
