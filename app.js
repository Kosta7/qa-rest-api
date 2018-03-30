"use strict";

const express = require("express");
const app = express();
const routes = require("./routes");

const jsonParser = require("body-parser").json;
const logger = require("morgan");

app.use(jsonParser());
app.use(logger("dev"));

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
