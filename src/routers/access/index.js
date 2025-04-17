"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const routers = express.Router();

routers.post("/shop/signup", accessController.signUp);

module.exports = routers;
