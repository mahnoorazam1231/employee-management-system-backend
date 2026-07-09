const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Employee Management System (EMS) API',
    version: '1.0.0',
    description: 'REST API for an Employee Management System — authentication, employees, departments and dashboard stats.',
  },
  servers: [{ url: '/api/v1', description: 'Current environment' }],
  tags: [
    { name: 'Auth', description: 'Registration, login, logout' },
    { name: 'Employees', description: 'Employee CRUD, search, filter, pagination' },
    { name: 'Departments', description: 'Department CRUD and employee assignment' },
    { name: 'Dashboard', description: 'Aggregate statistics' },
    { name: 'Health', description: 'Service health check' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Super Admin' },
          email: { type: 'string', example: 'admin@ems.com' },
          password: { type: 'string', example: 'Admin@123' },
          role: { type: 'string', enum: ['admin', 'hr'], example: 'admin' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@ems.com' },
          password: { type: 'string', example: 'Admin@123' },
        },
      },
      DepartmentInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Engineering' },
          description: { type: 'string', example: 'Builds and maintains all software products' },
        },
      },
      AssignEmployeesInput: {
        type: 'object',
        required: ['employeeIds'],
        properties: {
          employeeIds: { type: 'array', items: { type: 'string' }, example: ['6a49e37ecc7d0361cfe9b616'] },
        },
      },
      EmployeeInput: {
        type: 'object',
        required: ['name', 'email', 'position', 'department', 'salary'],
        properties: {
          name: { type: 'string', example: 'Ayesha Khan' },
          email: { type: 'string', example: 'ayesha.khan@ems.com' },
          phone: { type: 'string', example: '+92-300-1234567' },
          position: { type: 'string', example: 'Backend Developer' },
          department: { type: 'string', example: '6a49d3a17c6a94399b272836' },
          salary: { type: 'number', example: 120000 },
          status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: { tags: ['Health'], summary: 'API health check', responses: { 200: { description: 'API is healthy' } } },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new admin',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } },
        responses: { 201: { description: 'Admin registered successfully' }, 409: { description: 'Email already exists' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive a JWT',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
        responses: { 200: { description: 'Login successful, returns token' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Logout', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Logged out successfully' } } },
    },
    '/auth/me': {
      get: { tags: ['Auth'], summary: "Get logged-in admin's profile", security: [{ bearerAuth: [] }], responses: { 200: { description: 'Profile fetched' } } },
    },
    '/departments': {
      get: { tags: ['Departments'], summary: 'List all departments', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Fetched successfully' } } },
      post: {
        tags: ['Departments'],
        summary: 'Create a department (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/DepartmentInput' } } } },
        responses: { 201: { description: 'Created successfully' }, 409: { description: 'Name already exists' } },
      },
    },
    '/departments/{id}': {
      get: {
        tags: ['Departments'], summary: 'Get a single department', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Fetched successfully' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Departments'], summary: 'Update a department (admin only)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/DepartmentInput' } } } },
        responses: { 200: { description: 'Updated successfully' } },
      },
      delete: {
        tags: ['Departments'], summary: 'Delete a department (admin only)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted successfully' }, 400: { description: 'Employees still assigned' } },
      },
    },
    '/departments/{id}/assign-employees': {
      patch: {
        tags: ['Departments'], summary: 'Bulk-assign employees to a department', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignEmployeesInput' } } } },
        responses: { 200: { description: 'Assigned successfully' } },
      },
    },
    '/employees': {
      get: {
        tags: ['Employees'], summary: 'List employees (search, filter, pagination)', security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'department', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'Fetched successfully' } },
      },
      post: {
        tags: ['Employees'], summary: 'Add a new employee', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeInput' } } } },
        responses: { 201: { description: 'Added successfully' }, 404: { description: 'Department not found' } },
      },
    },
    '/employees/{id}': {
      get: {
        tags: ['Employees'], summary: 'Get a single employee', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Fetched successfully' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Employees'], summary: 'Update an employee', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeInput' } } } },
        responses: { 200: { description: 'Updated successfully' } },
      },
      delete: {
        tags: ['Employees'], summary: 'Delete an employee (admin only)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted successfully' } },
      },
    },
    '/dashboard/stats': {
      get: {
        tags: ['Dashboard'], summary: 'Get dashboard summary stats', security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'totalEmployees, totalDepartments, activeEmployees, recentlyAddedEmployees' } },
      },
    },
  },
};

module.exports = swaggerSpec;