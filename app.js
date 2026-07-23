const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const swaggerSpec = require('./config/swagger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// --- Global middleware ---
app.use(
  cors({
    origin:
      !process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*'
        ? '*'
        : process.env.CORS_ORIGIN.split(','),
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
    healthCheck: '/api/v1/health',
    docs: '/api-docs',
  });
});

// --- Swagger API docs
// Serve the raw OpenAPI spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// Serve Swagger UI via CDN (avoids serving static assets ourselves,
// which is unreliable on serverless platforms like Vercel)
app.get('/api-docs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>EMS API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
      });
    };
  </script>
</body>
</html>
  `);
});

// --- API routes ---
app.use('/api/v1', routes);

// --- 404 + centralized error handler (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;