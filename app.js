const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// --- Global middleware ---
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// --- Root ---
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Employee Management System API is running',
    docs: '/api/v1/health',
  });
});

// --- API routes ---
app.use('/api/v1', routes);

// --- 404 + centralized error handler (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
