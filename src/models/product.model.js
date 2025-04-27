"use strict";
const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    product_attributes: { type: Schema.Types.Mixed, required: true },

    // more
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // round to 1 decimal place
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// document middleware: runs before .save() and .create()
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// create index for search
productSchema.index({ product_name: "text", product_description: "text" });

// define the product type = closthing
const DOCUMENT_NAME_CLOTHING = "Clothing";
const COLLECTION_NAME_CLOTHING = "Clothes";

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
  },
  {
    collection: COLLECTION_NAME_CLOTHING,
    timestamps: true,
  },
);

// define the product type = electronics
const DOCUMENT_NAME_ELECTRONIC = "Electronics";
const COLLECTION_NAME_ELECTRONIC = "Electronics";

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
  },
  {
    collection: COLLECTION_NAME_ELECTRONIC,
    timestamps: true,
  },
);

// define the product type = furniture
const DOCUMENT_NAME_FUNITURE = "Furniture";
const COLLECTION_NAME_FUNITURE = "Furnitures";

const furnitureSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
  },
  {
    collection: COLLECTION_NAME_FUNITURE,
    timestamps: true,
  },
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model(DOCUMENT_NAME_CLOTHING, clothingSchema),
  electronic: model(DOCUMENT_NAME_ELECTRONIC, electronicSchema),
  furniture: model(DOCUMENT_NAME_FUNITURE, furnitureSchema),
};
