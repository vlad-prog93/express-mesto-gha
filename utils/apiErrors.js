class ApiErrors {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static BadRequest(msg) {
    return new ApiErrors(400, msg);
  }

  static Unauthorized(msg) {
    return new ApiErrors(401, msg);
  }

  static NotFound(msg) {
    return new ApiErrors(404, msg);
  }

  static Conflict(msg) {
    return new ApiErrors(409, msg);
  }
}

module.exports = ApiErrors;
