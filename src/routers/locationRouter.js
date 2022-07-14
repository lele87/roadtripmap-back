const express = require("express");
const { getUserLocations } = require("../controllers/locationControllers");

const locationRouter = express.Router();

locationRouter.get("/list/:userId", getUserLocations);

module.exports = locationRouter;
