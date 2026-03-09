const routes = require("express").Router();
const { upload } = require('../imageUpload');

routes.post("/addData",upload, require("../Operator/addEvent"));

routes.post("/operatorAddEducationData", upload, require("../Operator/addEducationData"));

routes.post("/operatorAddPublicSpacesData", upload, require("../Operator/addPublicSpacesData"));

routes.get("/getUnApprovedProjects", require("../Operator/getUnApprovedProjects"));

module.exports = routes;