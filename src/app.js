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

module.exports = app;
