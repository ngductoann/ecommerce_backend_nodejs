"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const createTokenPair = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const ROLES_SHOP = {
  SHOP: "SHOP",
  WRITTEN: "00001",
  EDITOR: "00002",
  ADMIN: "00003",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    // Step 1: create a new shop
    /**
     * Check if the email already exists
     * lean() is used to return a plain JavaScript object instead of a Mongoose document
     */
    const shopHolder = await shopModel.findOne({ email }).lean();

    // if email already exists, return an error
    if (shopHolder) {
      // return {
      //   code: "xxx",
      //   message: "Email already exists",
      //   status: "error",
      // };

      throw new BadRequestError("Error: Shop already exists");
    }

    // Step 2: create a new shop
    const passwordHash = bcrypt.hashSync(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [ROLES_SHOP.SHOP],
    });

    if (!newShop) {
      // return {
      //   code: "xxx",
      //   message: "Error creating shop",
      //   status: "error",
      // };
      throw new BadRequestError("Error: Shop creation error");
    }

    // Step 3: create a new key token
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    console.log({ privateKey, publicKey });

    // Step 4: save public key to the database
    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
    });

    if (!keyStore) {
      // return {
      //   code: "xxx",
      //   message: "Key store error",
      //   status: "error",
      // };

      throw new BadRequestError("Error: Key store error");
    }

    // Step 5: create a new tokens
    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKey,
      privateKey
    );

    console.log(`Create Token Success::`, tokens);

    // Step 6: return the tokens and shop info
    return {
      code: 201,
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      },
    };
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;
