const mongoose = require("mongoose");
const TicketSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  showId: {
    type: String,
    required: true,
  },
  count: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;
