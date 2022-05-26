class ApiErrors extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
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

  static Internal(msg) {
    return new ApiErrors(500, msg);
  }
}

module.exports = ApiErrors;
