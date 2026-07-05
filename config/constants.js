// Centralized enums / constants used across the app so magic strings
// don't get scattered across models, controllers and validators.

const ROLES = Object.freeze({
  ADMIN: 'admin',
  HR: 'hr',
});

const EMPLOYEE_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
});

module.exports = { ROLES, EMPLOYEE_STATUS };
