const ApiError = require('../utils/ApiError');

/**
 * Restricts access to the given list of roles.
 * Usage: router.delete('/:id', protect, authorize('admin'), controller)
 * Must run AFTER `protect` so req.user is populated.
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized, please log in');
  }
  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, `Role '${req.user.role}' is not permitted to perform this action`);
  }
  next();
};

module.exports = authorize;
