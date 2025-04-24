"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { StatusCodes } = require("../utils/httpStatusCode");

// service
const { findByEmail } = require("./shop.service");

const ROLES_SHOP = {
  SHOP: "SHOP",
  WRITTEN: "00001",
  EDITOR: "00002",
  ADMIN: "00003",
};

class AccessService {
  /**
   * Check refresh token is used ?
   */
  static handlerRefreshToken = async (refreshToken) => {
    // check if refresh token is used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    // if token is used
    if (foundToken) {
      // decode check who are you
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log(`Decode-1::`, { userId, email });

      // remove all token in keyToken
      await KeyTokenService.deleteById(userId);
      throw new ForbiddenError("Something wrong happend !! Pls relogin");
    }

    // if No, it's ok
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError("Shop not registered 1");
    }

    console.log(typeof holderToken);

    // console.log(`Holder Token::`, holderToken);

    // verifyToken
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    // console.log(`Decode-2::`, { userId, email });
    // check UserId
    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthFailureError("Shop not registered 2");

    // create new token
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // this token is used
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  /**
   * Logout a shop
   */
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(`Delete KeyStore::`, delKey);
    return delKey;
  };

  /**
   * 1 - check emails in dbs
   * 2 - match password
   * 3 - create Access Token and Refresh Token and save
   * 4 - generate tokens
   * 5 - get data return login
   * @param {string} email - The email of the shop
   * @param {string} password - The password of the shop
   * @param {string} refreshToken - The refresh token of the shop
   * @return {Promise<{code: number, metadata: {tokens: *, shop: *}}>}
   * @throws {BadRequestError} - If the shop not found or password is incorrect
   * @throws {AuthFailureError} - If the password is incorrect
   */
  static login = async ({ email, password, refreshToken = null }) => {
    console.log(`[P]::login:: `, { email, password, refreshToken });
    // 1.
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new BadRequestError("Error: Shop not found");
    }

    // 2.
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Error: Password is not correct");
    }

    // 3.
    // created private key and public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;

    // 4.
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    // 5.
    return {
      code: StatusCodes.CREATED,
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
  };

  /**
   * Sign up a new shop
   * 1 - check if the email already exists
   * 2 - create a new shop
   * 3 - create a new key token
   * 4 - save public key to the database
   * 5 - create a new tokens
   * 6 - return the tokens and shop info
   * @param {string} name - The name of the shop
   * @param {string} email - The email of the shop
   * @param {string} password - The password of the shop
   * @return {Promise<{code: number, metadata: {tokens: *, shop: *}}>}
   * @throws {BadRequestError} - If the shop already exists or if there is an error creating the shop or key token
   */
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
    const { _id: userId } = newShop;

    const keyStore = await KeyTokenService.createKeyToken({
      userId,
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
      { userId, email },
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
