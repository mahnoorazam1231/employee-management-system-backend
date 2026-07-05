const { body, param, query } = require('express-validator');
const mongoose = require('mongoose');
const { EMPLOYEE_STATUS } = require('../config/constants');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const createEmployeeValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Please provide a valid phone number'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .custom(isValidObjectId)
    .withMessage('Department must be a valid id'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
  body('status')
    .optional()
    .isIn(Object.values(EMPLOYEE_STATUS))
    .withMessage(`Status must be one of: ${Object.values(EMPLOYEE_STATUS).join(', ')}`),
  body('dateOfJoining').optional().isISO8601().withMessage('dateOfJoining must be a valid date'),
];

const updateEmployeeValidator = [
  param('id').custom(isValidObjectId).withMessage('Invalid employee id'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Please provide a valid phone number'),
  body('position').optional().trim().notEmpty(),
  body('department').optional().custom(isValidObjectId).withMessage('Department must be a valid id'),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
  body('status')
    .optional()
    .isIn(Object.values(EMPLOYEE_STATUS))
    .withMessage(`Status must be one of: ${Object.values(EMPLOYEE_STATUS).join(', ')}`),
  body('dateOfJoining').optional().isISO8601().withMessage('dateOfJoining must be a valid date'),
];

const employeeIdValidator = [param('id').custom(isValidObjectId).withMessage('Invalid employee id')];

const listEmployeeValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('department').optional().custom(isValidObjectId).withMessage('department must be a valid id'),
  query('status').optional().isIn(Object.values(EMPLOYEE_STATUS)),
];

module.exports = {
  createEmployeeValidator,
  updateEmployeeValidator,
  employeeIdValidator,
  listEmployeeValidator,
};
