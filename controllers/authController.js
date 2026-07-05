const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/authService');
const { addToBlacklist } = require('../middleware/tokenBlacklist');

// @desc    Register a new admin
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await authService.registerAdmin({ name, email, password, role });
  return new ApiResponse(201, 'Admin registered successfully', result).send(res);
});

// @desc    Login admin & receive JWT
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginAdmin({ email, password });
  return new ApiResponse(200, 'Login successful', result).send(res);
});

// @desc    Logout admin (blacklists current token)
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  addToBlacklist(req.token);
  return new ApiResponse(200, 'Logged out successfully').send(res);
});

// @desc    Get currently authenticated admin's profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email, role } = req.user;
  return new ApiResponse(200, 'Profile fetched successfully', { id: _id, name, email, role }).send(
    res
  );
});

module.exports = { register, login, logout, getMe };
