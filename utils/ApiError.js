/**
 * Custom error class used throughout controllers/services so the
 * centralized error handler can respond with a consistent shape and
 * the correct HTTP status code.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
