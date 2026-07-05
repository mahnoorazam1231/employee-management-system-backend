const Employee = require('../models/Employee');
const Department = require('../models/Department');
const ApiError = require('../utils/ApiError');

const createEmployee = async (payload) => {
  const department = await Department.findById(payload.department);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }

  const existing = await Employee.findOne({ email: payload.email });
  if (existing) {
    throw new ApiError(409, 'An employee with this email already exists');
  }

  const employee = await Employee.create(payload);
  return employee.populate('department', 'name');
};

const updateEmployee = async (id, payload) => {
  if (payload.department) {
    const department = await Department.findById(payload.department);
    if (!department) {
      throw new ApiError(404, 'Department not found');
    }
  }

  const employee = await Employee.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate('department', 'name');

  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }
  return employee;
};

const deleteEmployee = async (id) => {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }
  return employee;
};

const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id).populate('department', 'name description');
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }
  return employee;
};

/**
 * List employees with search, department/status filtering, and pagination.
 * Query params:
 *  - search: text search across name/email/position
 *  - department: department ObjectId filter
 *  - status: 'active' | 'inactive'
 *  - page, limit: pagination
 *  - sortBy, order: sorting (default createdAt desc)
 */
const listEmployees = async (query) => {
  const { search, department, status, sortBy = 'createdAt', order = 'desc' } = query;
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (search) {
    // Regex search is more forgiving for partial matches than $text
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = order === 'asc' ? 1 : -1;

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate('department', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Employee.countDocuments(filter),
  ]);

  return {
    employees,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  listEmployees,
};
