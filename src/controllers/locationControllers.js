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

module.exports = { getUserLocations };
