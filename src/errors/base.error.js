module.exports = class BaseError extends Error {
  constructor(statusCode, ok, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.ok = ok;
    this.errors = errors;
  }

  // Static methods for common HTTP errors
  static BadRequest(message, errors = []) {
    return new BaseError(400, false, message, errors);
  }

  static NotFound(message) {
    return new BaseError(404, false, message);
  }

  static InternalServerError(message, errors = []) {
    return new BaseError(500, false, message, errors);
  }
};
