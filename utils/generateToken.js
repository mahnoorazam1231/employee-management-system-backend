const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for a given admin user id + role.
 * Token is stateless; "logout" is handled via a server-side blacklist
 * (see middleware/tokenBlacklist.js) since JWTs cannot be revoked by
 * themselves.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

module.exports = generateToken;
