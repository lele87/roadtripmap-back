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
  locations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
  ],
});

const User = model("User", UserSchema, "users");

module.exports = User;
