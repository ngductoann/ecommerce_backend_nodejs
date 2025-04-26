"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    // Version 1 (authorization v1)
    // new SuccessResponse({
    //   message: "Get token success",
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);
    // Version 2 (authorization v2) fixed, no need accessToken

    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handlerRefreshTokenV2({
        keyStore: req.keyStore,
        user: req.user,
        refreshToken: req.body.refreshToken,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout Success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login Success",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    // try {
    //   console.log(`[P]::signUp:: `, req.body);

    /*
        HTTP Status Codes
        200: OK
        201: Created
      */
    // return res.status(201).json({
    //   // code is body of the response is custom defined in the documentation
    //   code: "20001",
    //   metadata: {
    //     userId: 1,
    //   },
    // });

    // return res.status(201).json(await AccessService.signUp(req.body));
    // } catch (error) {
    //   next(error);
    // }

    new CREATED({
      message: "Sign Up Success",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
