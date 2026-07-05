const express = require('express');
const {
  createDepartment,
  listDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  assignEmployees,
} = require('../controllers/departmentController');
const {
  createDepartmentValidator,
  updateDepartmentValidator,
  departmentIdValidator,
  assignEmployeesValidator,
} = require('../validators/departmentValidator');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect);

router.get('/', listDepartments);
router.get('/:id', departmentIdValidator, validateRequest, getDepartment);

router.post(
  '/',
  authorize(ROLES.ADMIN),
  createDepartmentValidator,
  validateRequest,
  createDepartment
);
router.put(
  '/:id',
  authorize(ROLES.ADMIN),
  updateDepartmentValidator,
  validateRequest,
  updateDepartment
);
router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  departmentIdValidator,
  validateRequest,
  deleteDepartment
);
router.patch(
  '/:id/assign-employees',
  authorize(ROLES.ADMIN, ROLES.HR),
  assignEmployeesValidator,
  validateRequest,
  assignEmployees
);

module.exports = router;
