const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const departmentService = require('../services/departmentService');

// @desc    Create a new department
// @route   POST /api/v1/departments
// @access  Private (admin)
const createDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.createDepartment(req.body);
  return new ApiResponse(201, 'Department created successfully', department).send(res);
});

// @desc    List all departments (with their employees)
// @route   GET /api/v1/departments
// @access  Private
const listDepartments = asyncHandler(async (req, res) => {
  const departments = await departmentService.listDepartments();
  return new ApiResponse(200, 'Departments fetched successfully', departments).send(res);
});

// @desc    Get a single department by id
// @route   GET /api/v1/departments/:id
// @access  Private
const getDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.id);
  return new ApiResponse(200, 'Department fetched successfully', department).send(res);
});

// @desc    Update a department
// @route   PUT /api/v1/departments/:id
// @access  Private (admin)
const updateDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.updateDepartment(req.params.id, req.body);
  return new ApiResponse(200, 'Department updated successfully', department).send(res);
});

// @desc    Delete a department (blocked if employees are still assigned)
// @route   DELETE /api/v1/departments/:id
// @access  Private (admin)
const deleteDepartment = asyncHandler(async (req, res) => {
  await departmentService.deleteDepartment(req.params.id);
  return new ApiResponse(200, 'Department deleted successfully').send(res);
});

// @desc    Assign a list of employees to a department
// @route   PATCH /api/v1/departments/:id/assign-employees
// @access  Private (admin)
const assignEmployees = asyncHandler(async (req, res) => {
  const department = await departmentService.assignEmployees(req.params.id, req.body.employeeIds);
  return new ApiResponse(200, 'Employees assigned successfully', department).send(res);
});

module.exports = {
  createDepartment,
  listDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  assignEmployees,
};
