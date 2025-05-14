"use strict";
const shopModel = require("../models/shop.model");

/**
 * @param {string} email - The email of the shop
 * @param {object} select - The fields to select
 * @return {Promise<*>}
 */
const findByEmail = async (
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1,
  },
) => {
  console.log(`[P]::findByEmail:: `, { email, select });
  return await shopModel.findOne({ email }).select(select).lean();
};

module.exports = { findByEmail };
