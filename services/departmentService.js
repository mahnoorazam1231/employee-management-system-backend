const mongoose = require('mongoose');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');

const createDepartment = async ({ name, description }) => {
  const existing = await Department.findOne({ name });
  if (existing) {
    throw new ApiError(409, 'A department with this name already exists');
  }
  return Department.create({ name, description });
};

const listDepartments = async () => {
  return Department.find().populate('employees', 'name email position status');
};

const getDepartmentById = async (id) => {
  const department = await Department.findById(id).populate(
    'employees',
    'name email position status'
  );
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
  return department;
};

const updateDepartment = async (id, payload) => {
  const department = await Department.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
  return department;
};

const deleteDepartment = async (id) => {
  const employeeCount = await Employee.countDocuments({ department: id });
  if (employeeCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete department: ${employeeCount} employee(s) are still assigned to it. Reassign them first.`
    );
  }

  const department = await Department.findByIdAndDelete(id);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
  return department;
};

/**
 * Bulk-assign a list of employees to a department by updating each
 * employee's `department` reference. Runs in a single bulkWrite for
 * efficiency.
 */
const assignEmployees = async (departmentId, employeeIds) => {
  const department = await Department.findById(departmentId);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }

  const objectIds = employeeIds.map((id) => new mongoose.Types.ObjectId(id));
  const foundCount = await Employee.countDocuments({ _id: { $in: objectIds } });
  if (foundCount !== employeeIds.length) {
    throw new ApiError(404, 'One or more employee ids are invalid');
  }

  await Employee.updateMany(
    { _id: { $in: objectIds } },
    { $set: { department: departmentId } }
  );

  return getDepartmentById(departmentId);
};

module.exports = {
  createDepartment,
  listDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignEmployees,
};
