"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const routers = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

// authentication
routers.use(authenticationV2);

// create product
routers.post("", asyncHandler(productController.createProduct));

module.exports = routers;
