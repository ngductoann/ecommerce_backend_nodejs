"use strict";

const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    // check objkey
    const objkey = await findById(key);
    if (!objkey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.objkey = objkey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objkey.permissions) {
      return res.status(403).json({
        message: "permission denied",
      });
    }

    console.log("permissions::", req.objkey.permissions);
    const validPermissions = req.objkey.permissions.includes(permission);

    if (!validPermissions) {
      return res.status(403).json({
        message: "permission denied",
      });
    }

    return next();
  };
};

module.exports = { apiKey, permission };
