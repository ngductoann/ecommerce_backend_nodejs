"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const createTokenPair = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const ROLES_SHOP = {
  SHOP: "SHOP",
  WRITTEN: "00001",
  EDITOR: "00002",
  ADMIN: "00003",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // Step 1: create a new shop

      /**
       * Check if the email already exists
       * lean() is used to return a plain JavaScript object instead of a Mongoose document
       */
      const shopHolder = await shopModel.findOne({ email }).lean();

      // if email already exists, return an error
      if (shopHolder) {
        return {
          code: "xxx",
          message: "Email already exists",
          status: "error",
        };
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
        return {
          code: "xxx",
          message: "Error creating shop",
          status: "error",
        };
      }

      // Step 3: create a new key token
      // hard version
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096, // bits - standard for RSA
        publicKeyEncoding: {
          // pkcs1: Public key CryptoGraphy Standard 1
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      console.log({ privateKey, publicKey });

      // Step 4: save public key to the database
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        return {
          code: "xxx",
          message: "Error creating key token",
          status: "error",
        };
      }

      // Step 5: create a new tokens
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyString,
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
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
