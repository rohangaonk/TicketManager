const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));

app.use("/user", require("./routes/user"));
app.use("/shows", require("./routes/show"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
