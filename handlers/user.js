const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = (req, res) => {
  const { name, email, image, password } = req.body;

  // check if user (email) already exists
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        throw new Error({ message: "Email taken", statusCode: 409 });
      } else {
        return bcrypt.hash(password, 10);
      }
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
    .catch((err) => res.status(500).json({ message: "server Error" }));
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "invalid credentials" });
      } else {
        return bcrypt.compare(password, user.password);
      }
    })
    .then((isCorrect) => {
      if (!isCorrect)
        return res.status(401).json({ message: "invalid credentials" });
      else {
        return res.status(202).json({ message: "logged In" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Server Error" }));
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
