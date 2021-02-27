const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  addMoney,
  getBookings,
} = require("../handlers/user");

// register user
router.post("/register", registerUser);

// login user
router.post("/login", loginUser);

//addMoney
router.post("/:userId", addMoney);

// get all bookings
router.get("/:userId/bookings", getBookings);

module.exports = router;
