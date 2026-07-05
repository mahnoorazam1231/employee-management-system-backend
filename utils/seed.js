/**
 * Seed script — populates MongoDB Atlas with sample data so the
 * deliverable ("MongoDB Atlas with sample data") is easy to satisfy.
 *
 * Usage: npm run seed
 * (Requires MONGO_URI to be set in .env)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const { ROLES, EMPLOYEE_STATUS } = require('../config/constants');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([Admin.deleteMany(), Department.deleteMany(), Employee.deleteMany()]);

  console.log('Creating admin user...');
  await Admin.create({
    name: 'Super Admin',
    email: 'admin@ems.com',
    password: 'Admin@123',
    role: ROLES.ADMIN,
  });

  console.log('Creating departments...');
  const [engineering, hr, sales, marketing] = await Department.create([
    { name: 'Engineering', description: 'Builds and maintains all software products' },
    { name: 'Human Resources', description: 'Handles hiring, onboarding and employee welfare' },
    { name: 'Sales', description: 'Drives revenue through client acquisition' },
    { name: 'Marketing', description: 'Brand, growth and product marketing' },
  ]);

  console.log('Creating employees...');
  await Employee.create([
    {
      name: 'Ayesha Khan',
      email: 'ayesha.khan@ems.com',
      phone: '+92-300-1234567',
      position: 'Backend Developer',
      department: engineering._id,
      salary: 120000,
      status: EMPLOYEE_STATUS.ACTIVE,
    },
    {
      name: 'Bilal Ahmed',
      email: 'bilal.ahmed@ems.com',
      phone: '+92-301-2345678',
      position: 'Frontend Developer',
      department: engineering._id,
      salary: 110000,
      status: EMPLOYEE_STATUS.ACTIVE,
    },
    {
      name: 'Sara Malik',
      email: 'sara.malik@ems.com',
      phone: '+92-302-3456789',
      position: 'HR Manager',
      department: hr._id,
      salary: 95000,
      status: EMPLOYEE_STATUS.ACTIVE,
    },
    {
      name: 'Usman Tariq',
      email: 'usman.tariq@ems.com',
      phone: '+92-303-4567890',
      position: 'Sales Executive',
      department: sales._id,
      salary: 80000,
      status: EMPLOYEE_STATUS.INACTIVE,
    },
    {
      name: 'Hina Raza',
      email: 'hina.raza@ems.com',
      phone: '+92-304-5678901',
      position: 'Marketing Specialist',
      department: marketing._id,
      salary: 85000,
      status: EMPLOYEE_STATUS.ACTIVE,
    },
  ]);

  console.log('Seed data created successfully.');
  console.log('Admin login -> email: admin@ems.com | password: Admin@123');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
