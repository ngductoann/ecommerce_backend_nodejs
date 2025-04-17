"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp:: `, req.body);

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

      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
