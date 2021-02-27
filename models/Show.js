const mongoose = require("mongoose");
const ShowsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tickets: {
    type: Number,
    required: true,
  },
});

const Show = mongoose.model("Shows", ShowsSchema);
module.exports = Show;
