const express = require("express");
const router = express.Router();
const { registerUser, loginUser, addMoney } = require("../handlers/user");

// register user
router.post("/register", registerUser);

// login user
router.post("/login", loginUser);

//
router.post("/:userId", addMoney);

module.exports = router;
