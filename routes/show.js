const express = require("express");
const router = express.Router();
const {
  addShow,
  getShows,
  searchShow,
  bookTicket,
} = require("../handlers/show");

// add a show
router.post("/addShow", addShow);

// get all the shows, filter based on genre, type
router.get("/", getShows);

// serach show by name
router.post("/search", searchShow);

// book ticket
router.post("/:showId/book", bookTicket);

module.exports = router;
