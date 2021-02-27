const User = require("../models/User");
const bcrypt = require("bcryptjs");
const CustomError = require("../ErrorHandler/error");

exports.registerUser = (req, res) => {
  const { name, email, image, password } = req.body;

  // check if user (email) already exists
  User.findOne({ email: email })
    .then((user) => {
      if (user) throw new CustomError("Email taken", 409);
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      let newUser = new User({
        name,
        email,
        image,
        wallet: 100,
        password: hashedPassword,
      });
      return newUser.save();
    })
    .then(() => res.status(201).json({ message: "Registered successfully" }))
    .catch((err) => {
      if (err instanceof CustomError)
        res.status(err.statusCode).json({ message: err.message });
      else {
        res.status(500).json({ message: "server error" });
      }
    });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) throw new CustomError("Invalid credentials", 401);
      return bcrypt.compare(password, user.password);
    })
    .then((isCorrect) => {
      if (!isCorrect) throw new CustomError("Invalid credentials", 401);
      return res.status(202).json({ message: "logged In" });
    })
    .catch((err) => {
      if (err instanceof CustomError)
        res.status(err.statusCode).json({ message: err.message });
      else {
        res.status(500).json({ message: "server error" });
      }
    });
};

exports.addMoney = (req, res) => {
  const { userId } = req.params;
  let { amount } = req.body;
  amount = parseInt(amount);
  User.findOne({ _id: userId })
    .then((user) => {
      user.wallet = user.wallet + amount;
      return user.save();
    })
    .then(() => res.status(200).json({ message: "wallet updated" }))
    .catch((err) => res.status(500).json({ message: "server error" }));
};

exports.getBookings = (req, res) => {
  const { userId } = req.params;
  User.find({ _id: userId }, "bookings")
    .then((data) => res.status(200).json({ data }))
    .catch((err) => res.status(500).json({ message: "server error" }));
};
