const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    // Employees belonging to this department (one-to-many relationship,
    // kept as a virtual/reverse-populate to avoid duplicating the
    // relationship on both sides; see virtual below).
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual populate: fetch all employees whose `department` field
// references this department, without storing an array on Department.
departmentSchema.virtual('employees', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'department',
});

module.exports = mongoose.model('Department', departmentSchema);
