const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getUserLocations,
  createLocation,
} = require("../controllers/locationControllers");
const auth = require("../server/middlewares/auth");

const upload = multer({
  dest: path.join("uploads", "locations"),
  limits: {
    fileSize: 8000000,
  },
});

const locationRouter = express.Router();

locationRouter.get("/list/:userId", auth, getUserLocations);
locationRouter.post(
  "/:userId",
  auth,
  upload.array("image", 10),
  createLocation
);

module.exports = locationRouter;
