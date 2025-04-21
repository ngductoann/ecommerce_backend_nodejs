"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const routers = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");

// signUp
routers.post("/shop/signup", asyncHandler(accessController.signUp));

// login
routers.post("/shop/login", asyncHandler(accessController.login));

module.exports = routers;
