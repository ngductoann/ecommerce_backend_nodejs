"use strict";

const { Types } = require("mongoose");
const keyTokenSchema = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // try {
    //   const tokens = await keyTokenSchema.create({
    //     user: userId,
    //     publicKey: publicKey,
    //     privateKey: privateKey,
    //   });
    //   return tokens ? tokens : null;
    // } catch (error) {
    //   return error;
    // }

    const filter = { user: userId };
    const update = {
      publicKey,
      privateKey,
      refreshTokensUsed: [],
      refreshToken,
    };
    const options = { new: true, upsert: true };

    const tokens = await keyTokenSchema.findOneAndUpdate(
      filter,
      update,
      options
    );
    return tokens ? tokens : null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenSchema.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenSchema.deleteOne({ _id: id });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenSchema
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenSchema.findOne({ refreshToken });
  };

  static deleteById = async (userId) => {
    return await keyTokenSchema.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
