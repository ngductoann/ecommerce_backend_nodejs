"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const routers = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");

routers.post("/shop/signup", asyncHandler(accessController.signUp));

module.exports = routers;
