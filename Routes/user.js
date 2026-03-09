
const routes = require("express").Router();

routes.get("/getApprovedData", require("../Admin/getApprovedEventList"));

routes.get("/getUnapprovedData", require("../Operator/getUnapprovedEventList"));

routes.get("/getAllProjects", require("../users/getAllProjects"));

routes.get("/getApprovedEventDetails/:id", require("../Admin/getApprovedEventDetailsByID"));

routes.get("/getApprovedEducationDetails/:id", require("../Admin/getApprovedEducationDetailsByID"));

routes.get("/getApprovedPublicSpacesDetails/:id", require("../Admin/getApprovedPublicSapcesDetailsByID"));

routes.post("/ContactUS", require("../users/ContactUS"));

routes.post('/donatorsDetails',require("../users/DonationDetailsVerified"));

routes.get('/getEduactionData' , require("../Admin/getEducationDetails"));

routes.post('/otpVerification',require("../users/DonatorsConformation"));

module.exports = routes;
