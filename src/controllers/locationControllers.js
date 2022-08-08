require("dotenv").config();
const debug = require("debug")("roadtripmap:controllers:locationControllers");
const chalk = require("chalk");
const Location = require("../database/models/Location");
const User = require("../database/models/User");
const customError = require("../utils/customError");

const getUserLocations = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const {
      locations: { features },
    } = await User.findById(userId).populate({
      path: "locations",
      populate: {
        path: "features",
        model: Location,
      },
    });

    res.status(200).json({ features });
  } catch {
    const error = customError(400, "Bad request", "Wrong parameters");

    next(error);
  }
};

const createLocation = async (req, res, next) => {
  debug(chalk.yellow("Request to add a location"));

  try {
    const { userId } = req.params;
    const { name, description, latitude, longitude } = req.body;
    const { files, firebaseImagesUrls } = req;

    const user = await User.findById(userId);

    const newLocation = {
      type: "Feature",
      properties: {
        name,
        description,
        image: files.length !== 0 ? [...firebaseImagesUrls] : [],
      },
      geometry: {
        coordinates: [latitude, longitude],
      },
    };

    const addedLocation = await Location.create(newLocation);
    debug(chalk.greenBright("Location added to database"));

    user.locations.features.push(addedLocation);
    await User.findByIdAndUpdate(userId, user, {
      new: true,
    });
    debug(chalk.greenBright("Location added to user favorite locations"));

    res.status(201).json({ new_location: addedLocation });
  } catch {
    const error = customError(400, "Bad request", "Unable to add new location");
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  debug(chalk.yellow("Request to delete a location"));
  const { locationId } = req.params;
  const { userId } = req;

  try {
    await Location.findByIdAndDelete(locationId);
    res.status(200).json({ msg: `Location with ID ${locationId} deleted` });

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { "locations.features": locationId },
      },
      { new: true }
    );
  } catch {
    const error = customError(
      400,
      "Bad request",
      "Unable to delete the location"
    );

    next(error);
  }
};

module.exports = { getUserLocations, createLocation, deleteLocation };
