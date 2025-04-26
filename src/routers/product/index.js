"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const routers = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");

// authentication
routers.use(authentication);

// create product
routers.post("", asyncHandler(productController.createProduct));

module.exports = routers;
