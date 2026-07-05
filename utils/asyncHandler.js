/**
 * Wraps an async controller/middleware so any thrown error or
 * rejected promise is forwarded to Express's error-handling
 * middleware via next(), instead of needing try/catch everywhere.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
