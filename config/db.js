const mongoose = require("mongoose");
require('dotenv').config();

const dbConnect = async() => {
    try {
        console.log(process.env.DB_NAME);
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
