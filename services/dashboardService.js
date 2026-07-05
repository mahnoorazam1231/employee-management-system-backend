const Employee = require('../models/Employee');
const Department = require('../models/Department');
const { EMPLOYEE_STATUS } = require('../config/constants');

const getDashboardStats = async () => {
  const [totalEmployees, totalDepartments, activeEmployees, recentlyAdded] = await Promise.all([
    Employee.countDocuments(),
    Department.countDocuments(),
    Employee.countDocuments({ status: EMPLOYEE_STATUS.ACTIVE }),
    Employee.find().sort({ createdAt: -1 }).limit(5).populate('department', 'name'),
  ]);

  return {
    totalEmployees,
    totalDepartments,
    activeEmployees,
    inactiveEmployees: totalEmployees - activeEmployees,
    recentlyAddedEmployees: recentlyAdded,
  };
};

module.exports = { getDashboardStats };
