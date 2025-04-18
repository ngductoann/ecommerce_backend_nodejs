"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// routers.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Welcome to the API",
//   });
// });

// Custom Dynamic Middleware
// check apiKey
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api", require("./access"));

module.exports = router;
