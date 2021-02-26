const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
  },
  ticket: {
    type: Array,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
