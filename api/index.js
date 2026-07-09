require('dotenv').config();
const app = require('../app');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
    return;
  }
  return app(req, res);
};