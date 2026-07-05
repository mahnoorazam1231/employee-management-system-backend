const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const employeeService = require('../services/employeeService');

// @desc    Add a new employee
// @route   POST /api/v1/employees
// @access  Private (admin)
const addEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);
  return new ApiResponse(201, 'Employee added successfully', employee).send(res);
});

// @desc    Update an employee
// @route   PUT /api/v1/employees/:id
// @access  Private (admin)
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployee(req.params.id, req.body);
  return new ApiResponse(200, 'Employee updated successfully', employee).send(res);
});

// @desc    Delete an employee
// @route   DELETE /api/v1/employees/:id
// @access  Private (admin)
const deleteEmployee = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);
  return new ApiResponse(200, 'Employee deleted successfully').send(res);
});

// @desc    Get single employee details
// @route   GET /api/v1/employees/:id
// @access  Private
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  return new ApiResponse(200, 'Employee fetched successfully', employee).send(res);
});

// @desc    List employees (supports search, filter by department/status, pagination)
// @route   GET /api/v1/employees
// @access  Private
const listEmployees = asyncHandler(async (req, res) => {
  const { employees, pagination } = await employeeService.listEmployees(req.query);
  return new ApiResponse(200, 'Employees fetched successfully', { employees, pagination }).send(
    res
  );
});

module.exports = { addEmployee, updateEmployee, deleteEmployee, getEmployee, listEmployees };
