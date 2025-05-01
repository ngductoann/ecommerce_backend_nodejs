"use strict";

const inventoryModel = require("../inventory.model");

const { Type } = require("mongoose");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId,
  });
};

module.exports = { insertInventory };
