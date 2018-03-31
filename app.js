"use strict";

const express = require("express");
const app = express();
const routes = require("./routes");

const jsonParser = require("body-parser").json;
const logger = require("morgan");

app.use(jsonParser());
app.use(logger("dev"));

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/qa");

const db = mongoose.connection;

db.on("error", err => {
  console.error("connection error:", err);
});

db.once("open", () => {});

// set up all this api to be used by a browser
// (but it works only in development, not in production)
// (learn about CORS to make it work in production as well)
// (also learn about user authentication and user authorization)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/questions", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log("catch 404 and forward to error handler");
  const err = new Error("not found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  console.log("error handler");
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Express server is listening on port", port);
});
