require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

// init middleware

// log requests to the console
app.use(morgan("dev"));
// app.use(morgan("combined"));
// app.use(morgan("common"));
// app.use(morgan("short));
// app.use(morgan("tiny"));

// set security HTTP headers
app.use(helmet());

// compress responses
app.use(compression());

// parse application/x-www-form-urlencoded
app.use(express.json());

// parse application/json
app.use(express.urlencoded({ extended: true }));

// init database
// require("./dbs/init.mongodb.lv0.js");
require("./dbs/init.mongodb");
// const { checkOverLoad } = require("./helper/check.connect");
// checkOverLoad();

// init routes
app.use("/", require("./routers/index"));

// init error handler
// middleware only have 3 parameters (req, res, next)
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// error handler only have 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: err.stack,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
