const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//app.use("/api/auth", require("./routes/auth"));
app.use("/api/cars", require("./routes/cars"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
