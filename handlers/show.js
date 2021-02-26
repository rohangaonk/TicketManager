const User = require("../models/show");
const Show = require("../models/show");

exports.addShow = (req, res) => {
  let { name, time, genre, type, price, tickets } = req.body;
  //  time =  Febraury 28, 2021 03:24:00
  time = new Date(time);
  price = parseInt(price);
  tickets = parseInt(tickets);

  let newShow = new Show({
    name,
    time,
    genre,
    type,
    price,
    tickets,
  });
  newShow
    .save()
    .then(() => res.status(201).json({ message: "show created" }))
    .catch((err) => res.status(500).json({ messsage: "server error" }));
};

exports.getShows = (req, res) => {
  const { genre, type } = req.query;

  if (genre) {
    Show.find({ genre: genre }).then((shows) => {
      if (!shows) {
        res.status(400).json({ message: "No shows matching this genre" });
      } else {
        res.status(200).json({ data: shows });
      }
    });
  } else if (type) {
    Show.find({ type: type }).then((shows) => {
      if (!shows) {
        res.status(400).json({ message: "No shows matching this type" });
      } else {
        res.status(200).json({ data: shows });
      }
    });
  } else {
    Show.find()
      .then((shows) => res.status(200).json({ data: shows }))
      .catch((err) => res.status(500).json({ message: "server error" }));
  }
};

exports.searchShow = (req, res) => {
  const { name } = req.body;

  Show.find({ name: name })
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).json({ message: "server error" }));
};

// imcomplete
exports.bookTicket = (req, res) => {
  const { count, userId } = req.body;
  const { showId } = req.params;

  if (count > 5)
    return res
      .status(100)
      .json({ message: "only 5 tickets can be booked at a time" });

  Show.findOne({ _id: showId })
    .then((show) => {
      const diff = new Date() - show.time;
      if (show.tickets < count)
        res.status(100).json({ message: "Fewer tickets remaining" });
      else if (diff < 3 * 24 * 60 * 60 * 1000) {
        res.status(100).json({ message: "You are out of time" });
      } else return User.findOne({ _id: userId });
    })
    .then((user) => {});
};
