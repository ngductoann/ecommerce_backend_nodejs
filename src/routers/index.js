"use strict";

const express = require("express");
const routers = express.Router();

// routers.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Welcome to the API",
//   });
// });

routers.use("/v1/api", require("./access"));

module.exports = routers;
