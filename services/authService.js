const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

const registerAdmin = async ({ name, email, password, role }) => {
  const existing = await Admin.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const admin = await Admin.create({ name, email, password, role });
  const token = generateToken({ id: admin._id, role: admin.role });

  return {
    token,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};

const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: admin._id, role: admin.role });

  return {
    token,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};

module.exports = { registerAdmin, loginAdmin };
