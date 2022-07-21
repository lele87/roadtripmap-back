const express = require("express");
const { getUserLocations } = require("../controllers/locationControllers");
const auth = require("../server/middlewares/auth");

const locationRouter = express.Router();

locationRouter.get("/list/:userId", auth, getUserLocations);

module.exports = locationRouter;
