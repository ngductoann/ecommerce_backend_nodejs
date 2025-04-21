"use strict";

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
}

module.exports = KeyTokenService;
