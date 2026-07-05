const express = require('express');
const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  listEmployees,
} = require('../controllers/employeeController');
const {
  createEmployeeValidator,
  updateEmployeeValidator,
  employeeIdValidator,
  listEmployeeValidator,
} = require('../validators/employeeValidator');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

// All employee routes require authentication
router.use(protect);

// GET /api/v1/employees?search=&department=&status=&page=&limit=
router.get('/', listEmployeeValidator, validateRequest, listEmployees);
router.get('/:id', employeeIdValidator, validateRequest, getEmployee);

router.post(
  '/',
  authorize(ROLES.ADMIN, ROLES.HR),
  createEmployeeValidator,
  validateRequest,
  addEmployee
);
router.put(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.HR),
  updateEmployeeValidator,
  validateRequest,
  updateEmployee
);
router.delete('/:id', authorize(ROLES.ADMIN), employeeIdValidator, validateRequest, deleteEmployee);

module.exports = router;
