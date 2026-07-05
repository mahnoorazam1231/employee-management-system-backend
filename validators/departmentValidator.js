const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const createDepartmentValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ min: 2, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
];

const updateDepartmentValidator = [
  param('id').custom(isValidObjectId).withMessage('Invalid department id'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
];

const departmentIdValidator = [param('id').custom(isValidObjectId).withMessage('Invalid department id')];

const assignEmployeesValidator = [
  param('id').custom(isValidObjectId).withMessage('Invalid department id'),
  body('employeeIds')
    .isArray({ min: 1 })
    .withMessage('employeeIds must be a non-empty array'),
  body('employeeIds.*').custom(isValidObjectId).withMessage('Each employeeId must be a valid id'),
];

module.exports = {
  createDepartmentValidator,
  updateDepartmentValidator,
  departmentIdValidator,
  assignEmployeesValidator,
};
