const User = require("../models/User");
const Show = require("../models/Show");
const CustomError = require("../ErrorHandler/error");

exports.addShow = (req, res) => {
  let { name, time, genre, type, price, tickets, image } = req.body;
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
    image,
  });
  newShow
    .save()
    .then(() => res.status(201).json({ message: "show created" }))
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ messsage: "server error" });
    });
};

exports.getShows = (req, res) => {
  let filter = { ...req.query };
  Show.find(filter)
    .then((shows) => res.status(200).json({ data: shows }))
    .catch((err) => res.status(500).json({ message: "server error" }));
};

exports.searchShow = (req, res) => {
  const { name } = req.body;

  Show.find({ name: name })
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).json({ message: "server error" }));
};

exports.bookTicket = (req, res) => {
  const { ticketCount, userId } = req.body;
  const { showId } = req.params;
  let totalPrice = 0;
  let totalTickets = 0;
  let ticketObj = {};

  // At a time only 5 tickets can be bought
  if (ticketCount > 5)
    return res
      .status(400)
      .json({ message: "only 5 tickets can be booked at a time" });

  Show.findOne({ _id: showId })
    .then((show) => {
      const diff = show.time - new Date();
      // book tickets 3 days prior
      if (diff < 3 * 24 * 60 * 60 * 1000) {
        throw new CustomError("Tickets no longer available", 400);
      }
      // check if show had tickets left
      if (show.tickets < ticketCount)
        throw new CustomError("Fewer tickets remaining", 400);

      totalTickets = show.tickets;
      totalPrice = ticketCount * show.price;
      ticketObj.image = show.image;
      ticketObj.name = show.name;
      ticketObj.quantity = ticketCount;
      ticketObj.price = totalPrice;
      ticketObj.time = show.time;

      return User.findOne({ _id: userId });
    })
    .then((user) => {
      if (user.wallet < totalPrice)
        throw new CustomError("Recharge your wallet", 400);

      let numberOfTickets = 0;
      if (user.bookings.length > 0)
        numberOfTickets = user.bookings.reduce(
          (acc, item) => (item.time - new Date() > 0 ? acc + item.quantity : 0),
          0
        );
      console.log(numberOfTickets);
      if (numberOfTickets + ticketCount > 15)
        throw new CustomError("You can buy only 15 tickets", 400);

      user.bookings.push(ticketObj);
      user.wallet = user.wallet - totalPrice; //payement
      user.wallet = user.wallet + totalPrice * 0.1; //cashback
      console.log(user.wallet);
      return user.save();
    })
    .then(() => {
      return Show.findOneAndUpdate(
        { _id: showId },
        { tickets: totalTickets - ticketCount }
      );
    })
    .then(() => res.status(200).json({ message: "booking successfull" }))
    .catch((err) => {
      if (err instanceof CustomError)
        res.status(err.statusCode).json({ message: err.message });
      else {
        res.status(500).json({ message: "server error" });
      }
    });
};
