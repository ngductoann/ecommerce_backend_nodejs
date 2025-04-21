"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
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
