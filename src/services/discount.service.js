"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodeUnSelect,
  checkDiscountExists,
  findAllDiscountCodeSelect,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIdMongoDB } = require("../utils");

/*
  Discount Services
  1 - Generator Discount Code [Shop|Admin]
  2 - Get Discount amount [User]
  3 - Get All discount codes [User|Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Shop|Admin]
  6 - Cancel discount code [User]
*/

/*
  discount_name: { type: String, required: true },
  discount_description: { type: String, required: true },
  discount_type: { type: String, default: "fixed_amount" }, // percentage
  discount_value: { type: Number, required: true }, // 10.000, 10
  discount_max_value: { type: Number, required: true }, // 10.000, 10
  discount_code: { type: String, required: true },
  discount_start_date: { type: Date, required: true }, // date to start the discount
  discount_end_date: { type: Date, required: true }, // date to end the discount
  discount_max_uses: { type: Number, require: true }, // max uses of the discount
  discount_uses_count: { type: Number, require: true }, // count of how many times the discount has been used
  discount_users_used: { type: Array, default: [] }, // array of users who have used the discount
  discount_max_uses_per_user: { type: Number, require: true }, // max uses of the discount per user
  discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop', require: true }, // shop id

  discount_is_active: { type: Boolean, default: true }, // is the discount active
  discount_applies_to: { type: String, require: true, enum: ['all', 'specific'] }, // all or specific products
  discount_product_ids: { type: Array, default: [] }, // array of product ids (products that the discount applies to)
*/

class DiscountService {
  static async createDiscountCode(payload) {
    console.log(
      "🚀 ~ file: discount.service.js:45 ~ DiscountService ~ createDiscountCode ~ payload:",
      payload,
    );
    const {
      name,
      description,
      type,
      value,
      max_value,
      code,
      start_date,
      end_date,
      max_uses,
      uses_count,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_active,
      applies_to,
      product_ids,
    } = payload;

    // check input
    // date
    let condition1 = new Date() > new Date(start_date);
    let condition2 = new Date() > new Date(end_date);
    if (condition1 || condition2) {
      throw new BadRequestError("Discount code has expired!!");
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError(
        "Discount code start date must be less than end date!!",
      );
    }

    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists!!");
    }

    // create discount code
    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {
    // TODO: implement this function
  }

  /*
    Get all discount codes avaliable with products
  */
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    console.log("Code: ", code);
    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found!!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products = [];

    if (discount_applies_to === "all") {
      // get all products
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongoDB(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      // get specific products ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  /*
    Get all discount codes of shop
  */
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongoDB(shopId),
        discount_is_active: true,
      },
      select: ["discount_code", "discount_name"],
      model: discountModel,
    });

    return discounts;
  }

  /*
    Apply Discount Code
  */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount code not found!!");

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) {
      throw new BadRequestError("Discount code is not active!!");
    }
    if (!discount_max_uses) {
      throw new BadRequestError("Discount code are out!");
    }

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount code has expired!!");
    }

    // check if set min order value
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduct((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `Discount code requires minimum order value of ${discount_min_order_value}`,
        );
      }
    }

    if (discount_max_uses_per_user) {
      const userUsesDiscount = discount_users_used.find(
        (user) => user.userId === userId,
      );

      if (userUsesDiscount) {
        // TODO: check if user has used discount code
      }
    }

    // check if discount is a fixed amount or percentage
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  /*
    Delete Discount Code
  */
  static async deleteDiscountCode({ codeId, shopId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found!!");
    }

    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongoDB(shopId),
    });

    return deleted;
  }

  /*
    Cancel Discount Code
  */
  static async cancelDiscountCode({ codeId, userId, shopId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount code not found!!");

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: { userId },
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
