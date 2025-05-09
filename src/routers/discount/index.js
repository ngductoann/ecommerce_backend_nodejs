"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

// get amount a discount
router.get("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/list_product_code",
  asyncHandler(discountController.getAllDiscountCodesWithProduct),
);

router.use(authenticationV2);

router.post("", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;
