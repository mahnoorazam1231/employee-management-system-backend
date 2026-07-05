const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Admin = require('../models/Admin');
const { isBlacklisted } = require('./tokenBlacklist');

/**
 * Protect middleware:
 * - Verifies the Bearer token from the Authorization header
 * - Rejects blacklisted (logged-out) tokens
 * - Attaches the authenticated admin (without password) to req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  if (isBlacklisted(token)) {
    throw new ApiError(401, 'Session expired, please log in again');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Not authorized, token invalid or expired');
  }

  const user = await Admin.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'Not authorized, user no longer exists');
  }

  req.user = user;
  req.token = token;
  next();
});

module.exports = { protect };
