const { Schema, model } = require("mongoose");

const LocationSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  properties: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: String,
    },
  },
  geometry: {
    coordinates: [
      {
        type: Number,
        required: true,
      },
    ],
  },
});

const Location = model("Location", LocationSchema, "locations");

module.exports = Location;
