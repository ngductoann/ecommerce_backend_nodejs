"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const routers = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");

// signUp
routers.post("/shop/signup", asyncHandler(accessController.signUp));

// login
routers.post("/shop/login", asyncHandler(accessController.login));

// authentication
// routers.use(authentication);
routers.use(authenticationV2);

// logout
routers.post("/shop/logout", asyncHandler(accessController.logout));

// handler refresh token
routers.post(
  "/shop/handlerRefreshToken",
  asyncHandler(accessController.handlerRefreshToken),
);

module.exports = routers;
