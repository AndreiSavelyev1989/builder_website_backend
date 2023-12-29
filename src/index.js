const express = require("express");
const mongoose = require("mongoose");
const imagesRouter = require("./routes/images-router");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(imagesRouter);

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Successful connection to MongoDB!");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.listen(port, () => {
  console.log("Server started on port: " + port);
});
