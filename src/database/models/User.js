const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  locations: {
    features: [
      {
        type: Schema.Types.ObjectId,
        ref: "Location",
        default: [],
      },
    ],
  },
});

const User = model("User", UserSchema, "users");

module.exports = User;
