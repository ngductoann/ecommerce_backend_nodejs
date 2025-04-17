"use strict";

const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop", // Ensure this matches the Shop model
    },
    privateKey: {
      type: String, // Ensure privateKey is stored as a string
      required: true,
    },
    publicKey: {
      type: String, // Ensure publicKey is stored as a string
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
