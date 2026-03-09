const routes = require("express").Router();
const { upload } = require("../imageUpload");
const {uploads} = require("../invoiceUpload");

routes.post('/addData',upload, require('../Admin/adminAddEvent'));

routes.get('/approveEventData/:id', require('../Admin/approveEventData'));

routes.put('/editEventData/:id/:role', require('../Admin/editEventData'));

routes.get("/viewEventDetails/:id", require("../Admin/getEventDetails"));

routes.get("/viewProjectDetails/:id", require("../Admin/getProjectDetails"));

routes.post('/addEducationData', upload, require('../Admin/adminAddEducationData'));

routes.post('/addPublicSpacesData', upload, require("../Admin/adminAddPublicSpaceData"));

routes.get('/approveProject/:id/:pType', require('../Admin/adminApproveProjects'));

routes.put('/editProjectData/:id/:role/:pType',require('../Admin/editProjectData'));

routes.post('/rejectEvent/:id', require('../Admin/rejectEvent'));

routes.post('/rejectProject/:id/:pType', require('../Admin/rejectProject'));

routes.get('/deleteProject/:id/:pType', require("../Admin/deleteProject"));

routes.get('/confirmDonatorDetails/:id',require("../Admin/ConfirmDonationDetails"));

routes.get('/rejectVerifiedDonatorDetails/:id',require("../Admin/RejectVerifiedDonationDetails"));

routes.get('/rejectDonatorDetails/:id',require("../Admin/rejectDonatorDetails"));

routes.get('/getDonatorsDetails/:id',require("../Admin/getDonatorDataById"));

routes.get('/getVerifiedDonatorsDetails/:id',require("../Admin/getVerifiedDonatorDataById"));

routes.get("/getApprovedProjects", require("../Admin/getApprovedProjects"));

routes.get('/getDonatorData',require("../Admin/getDonatorDetailsForVerification"));

routes.get('/getVerifiedDonatorData',require("../Admin/getVerifiedDonatorDetails"));

routes.post('/certifyDonatorsList/:id',uploads,require("../Admin/certifyDonators"));

routes.put('/editProjectList/:id/:role/:pType',require('../Admin/editProjectList'));

module.exports = routes;