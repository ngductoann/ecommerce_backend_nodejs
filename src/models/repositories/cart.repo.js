"use strict";

const { cart } = require("../cart.model");
const { convertToObjectIdMongoDB } = require("../../utils");

const findCartById = async (cartId) => {
  return await cart.findOne({ _id: convertToObjectIdMongoDB(cartId) });
};

module.exports = { findCartById };
