const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after express-validator chains defined in /validators.
 * Collects any validation errors and throws a single 422 ApiError
 * with a structured list, instead of letting each route handle it.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(new ApiError(422, 'Validation failed', formatted));
  }
  next();
};

module.exports = validateRequest;
