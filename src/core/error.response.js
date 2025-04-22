"use strict";
const { StatusCodes, ReasonsPhrases } = require("../utils/httpStatusCode");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonsPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonsPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonsPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonsPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
};
