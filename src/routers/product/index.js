"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const routers = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

routers.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct),
);
routers.get("", asyncHandler(productController.findAllProducts));
routers.get("/:product_id", asyncHandler(productController.findProduct));

// authentication
routers.use(authenticationV2);

// create product
routers.post("", asyncHandler(productController.createProduct));
routers.post(
  "/published/:id",
  asyncHandler(productController.publishProductByShop),
);

routers.post(
  "/unpublished/:id",
  asyncHandler(productController.unPublishProductByShop),
);

// QUERY //
routers.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
routers.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop),
);
// END QUERY //

module.exports = routers;
