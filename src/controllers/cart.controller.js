"use strict";

const CartService = require("../services/cart.service");
const { SuccessResponse } = require("../core/success.response");

class CartController {
  /**
   * @description add product to cart
   * @param {int} userId
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /v1/api/cart/user
   * @return {}
   */
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  // update +/- product
  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Add quantity product success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  // delete product from cart
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Deleted cart success",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  // List cart
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "List cart success",
      metadata: await CartService.getListUserCart(req.body),
    }).send(res);
  };
}

module.exports = new CartController();
