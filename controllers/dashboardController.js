const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const dashboardService = require('../services/dashboardService');

// @desc    Get dashboard summary stats (totals, active count, recent hires)
// @route   GET /api/v1/dashboard/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  return new ApiResponse(200, 'Dashboard stats fetched successfully', stats).send(res);
});

module.exports = { getStats };
