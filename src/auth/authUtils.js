"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helper/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  USER_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error("verification failed::", err);
      } else {
        console.log("verified decoded::", decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1 - check useId missing ??
   * 2 - get accessToken
   * 3 - verify Token
   * 4 - check user in db is correct
   * 5 - check keyStore with this userId
   * 6 - Ok all => return next
   */

  // 1.
  const userId = req.headers[HEADER.USER_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2.
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found KeyStore");

  // 3.
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodedUser.userId)
      throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { createTokenPair, authentication };
