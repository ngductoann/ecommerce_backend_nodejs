"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonsStatusCode = {
  OK: "Success",
  CREATED: "Created",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonsStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      metadata,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonsStatusCode.CREATED,
    metadata,
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      metadata,
    });
  }
}

module.exports = {
  OK,
  CREATED,
};
