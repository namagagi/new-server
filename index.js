const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dbConnect = require("./config/db");
const signup = require("./Message/signup");
const approve = require("./Message/approveUser");
const reject = require("./Message/rejectUser");
const confirm = require("./Message/confirmUser");
const forgotPassword = require("./Admin/forgotpassword");
const verifyForgotOtp = require("./Admin/otpVerificationForPassword");
const resetPassword = require("./Admin/resetPassword");
const path = require("path");
require("dotenv").config();
require("./removeUnverifiedDonations");

const port = process.env.PORT || 2000;
// Connect to the database
dbConnect();
const app = express();
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/invoices",express.static(path.join(__dirname, "invoices")));

app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// Define allowed origins
const allowedOrigins = ["https://new-client-theta.vercel.app", "https://cf.dakshinakannada.org"];

// CORS options to handle multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    // Check if the origin is one of the allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, 
};

// Use body-parser middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true ,limit: "50mb"}));

// Use CORS middleware
app.use(cors(corsOptions));



// Define routes
app.post("/login", require("./Admin/login"));
app.post("/verify-otp", require("./Admin/verifyOtp"));
app.post("/forgotpassword", forgotPassword);
app.post("/verifyForgotOtp", verifyForgotOtp);
app.post("/resetpassword", resetPassword);
app.post("/signup", signup);
app.get("/confirm/:userId", confirm);
app.get("/approve/:userId", approve);
app.get("/reject/:userId", reject);
app.post("/logout",require("./jwt_authoriser"), require("./Admin/logout"));
app.use("/admin", require("./jwt_authoriser"), require("./Routes/admin"));
app.use("/operator", require("./jwt_authoriser"), require("./Routes/operator"));
app.use("/users", require("./Routes/user"));
// app.use("/payment", require("./Routes/razorpay"));

// Start the server
app.listen(port, () => {
  console.log("Server is Running on port 2000");
});
