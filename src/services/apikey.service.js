"use strict";
const apikeySchema = require("../models/apikey.model");
const crypto = require("node:crypto");

const findById = async (key) => {
  // const newKey = await apikeySchema.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ["0000"],
  // });
  // console.log(newKey);
  const objkey = await apikeySchema.findOne({ key: key, status: true }).lean();
  return objkey;
};

module.exports = {
  findById,
};
