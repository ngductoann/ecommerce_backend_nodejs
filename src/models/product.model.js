"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: String,
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// define the product type = closthing
const DOCUMENT_NAME_CLOTHING = "Clothing";
const COLLECTION_NAME_CLOTHING = "Clothes";

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    collection: "Clothes",
    timestamps: true,
  },
);

// define the product type = electronics
const DOCUMENT_NAME_ELECTRONIC = "Electronics";
const COLLECTION_NAME_ELECTRONIC = "Electronics";

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    collection: COLLECTION_NAME_ELECTRONIC,
    timestamps: true,
  },
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model(DOCUMENT_NAME_CLOTHING, clothingSchema),
  electronic: model(DOCUMENT_NAME_ELECTRONIC, electronicSchema),
};
