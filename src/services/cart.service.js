"use strict";

const { cart } = require("../models/cart.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { getProductById } = require("../models/repositories/product.repo");

/*
  TODO: Key features Cart Service:
    - add product to cart [User]
    - reduce product quantity by one [User]
    - increase product quantity by one [User]
    - get cart [User]
    - delete cart [User]
    - Delete cart item [User]
*/

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    },
      updateSet = {
        $inc: {
          "cart_products.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId });

    // check cart with user id not exists
    if (!userId) {
      // create cart for user
      return await CartService.createUserCart({ userId, product });
    }

    // if exists cart but not have any product ?
    if (!userCart.cart_products.length) {
      // add product to cart
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // if cart exists and have the product
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  /*
    Update Cart. Payload:
    shop_order_id: [
      {
        shopId,
        item_products: [
          {
            quantity,
            price,
            shopId,
            old_quantity,
            productId
          }
        ]
      }
    ]
  */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    // check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product Not Found");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError("Product do not belong to the shop");

    if (quantity === 0) {
      // delete product
    }

    return await CartService.updateUserCartQuantity({
      userId,
      productId: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };
    updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
