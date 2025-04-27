"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../../models/product.model");
const { getSelectData, unGetSelectData } = require("../../utils/index");
const { Types } = require("mongoose");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch); // case-insensitive
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch }, // search by text
      },
      { score: { $meta: "textScore" } }, // sort by text score
    )
    .lean()
    .exec();
  return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  }); // not lean() because we want to update the document with mongoose function

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit; // skip products already fetched
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }; // sort by createdAt descending (Example)
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select)) // select only the fields we need. Select is a object not a Array
    .lean()
    .exec();

  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect)); // unSelect is a field not to select
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "shop_name -_id") // populate the product_shop field with shop_name.
    // -_id to exclude the _id field
    .sort({ updatedAt: -1 }) // sort by updatedAt descending
    .skip(skip) // skip the first n products
    .limit(limit) // limit the number of products returned
    .lean() // to convert to plain JavaScript object
    .exec(); // exec() to return a promise
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
};
