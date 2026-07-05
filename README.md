# Employee Management System (EMS) — Backend API

A REST API backend for an Employee Management System, built with the MERN-stack backend (Node.js, Express, MongoDB/Mongoose) using MVC + service-layer architecture, JWT authentication, role-based authorization, and request validation.

## Tech Stack

| Layer          | Technology                     |
|----------------|---------------------------------|
| Runtime        | Node.js                        |
| Framework      | Express.js                     |
| Database       | MongoDB Atlas                  |
| ODM            | Mongoose                       |
| Auth           | JSON Web Tokens (JWT)          |
| Password Hash  | bcryptjs                       |
| Validation     | express-validator              |
| Config         | dotenv                         |
| CORS           | cors                           |
| Logging        | morgan                         |

## Folder Structure

```
server/
│
├── config/            # DB connection, app-wide constants (roles, statuses)
├── controllers/        # Thin HTTP layer — calls services, shapes responses
├── middleware/          # auth, role check, validation, error handling, token blacklist
├── models/              # Mongoose schemas (Admin, Employee, Department)
├── routes/              # Express routers per resource
├── services/           # Business logic / DB queries, reusable & testable
├── validators/          # express-validator chains per resource
├── utils/               # ApiError, ApiResponse, asyncHandler, generateToken, seed script
├── app.js               # Express app setup (middleware, routes, error handlers)
├── server.js            # Entry point — connects DB, starts HTTP server
└── .env.example
```

**Why a service layer?** Controllers stay thin (parse request → call service → send response). Services own the actual DB/business logic and can be reused or unit-tested independently of Express.

## Getting Started

### 1. Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

| Variable        | Description                                              |
|-----------------|------------------------------------------------------------|
| `PORT`          | Port the server listens on (default 5000)                |
| `NODE_ENV`      | `development` or `production`                             |
| `MONGO_URI`     | MongoDB Atlas connection string                            |
| `JWT_SECRET`    | Long random string used to sign JWTs                       |
| `JWT_EXPIRES_IN`| Token lifetime, e.g. `1d`, `12h`                            |
| `CORS_ORIGIN`   | Comma-separated allowed origins, or `*`                    |

### 4. Seed sample data (optional but recommended)
Populates the database with one admin user, four departments, and five employees.
```bash
npm run seed
```
Seeded admin login: `admin@ems.com` / `Admin@123`

### 5. Run the server
```bash
npm run dev     # nodemon, auto-restarts on change
# or
npm start       # plain node
```
API will be live at `http://localhost:5000/api/v1`.

## Authentication & Authorization

- **JWT-based**: `POST /auth/login` returns a Bearer token. Send it as `Authorization: Bearer <token>` on protected routes.
- **Password hashing**: bcryptjs hashes passwords before saving (pre-save Mongoose hook); passwords are never returned in responses (`select: false`).
- **Logout**: Since JWTs are stateless, logout works by adding the current token to a server-side blacklist (in-memory `Set` — see `middleware/tokenBlacklist.js`). For a multi-instance production deployment, swap this for a shared store like Redis.
- **Role-based authorization**: `roles` are `admin` and `hr`. The `authorize(...roles)` middleware restricts sensitive actions (e.g. only `admin` can delete employees/departments).

## API Overview

Base URL: `/api/v1`

### Auth
| Method | Endpoint          | Access  | Description               |
|--------|-------------------|---------|----------------------------|
| POST   | `/auth/register`  | Public  | Register a new admin       |
| POST   | `/auth/login`     | Public  | Login, returns JWT         |
| POST   | `/auth/logout`    | Private | Blacklists current token   |
| GET    | `/auth/me`        | Private | Get logged-in admin profile|

### Employees
| Method | Endpoint         | Access        | Description                                              |
|--------|------------------|---------------|-----------------------------------------------------------|
| GET    | `/employees`     | Private       | List employees — supports `search`, `department`, `status`, `page`, `limit`, `sortBy`, `order` |
| GET    | `/employees/:id` | Private       | Get single employee details                                |
| POST   | `/employees`     | admin, hr     | Add a new employee                                          |
| PUT    | `/employees/:id` | admin, hr     | Update an employee                                          |
| DELETE | `/employees/:id` | admin         | Delete an employee                                           |

Example: `GET /employees?search=ali&department=<deptId>&status=active&page=1&limit=10`

### Departments
| Method | Endpoint                            | Access     | Description                          |
|--------|--------------------------------------|------------|----------------------------------------|
| GET    | `/departments`                      | Private    | List all departments with their employees |
| GET    | `/departments/:id`                  | Private    | Get single department                  |
| POST   | `/departments`                      | admin      | Create a department                     |
| PUT    | `/departments/:id`                  | admin      | Update a department                     |
| DELETE | `/departments/:id`                  | admin      | Delete a department (blocked if employees still assigned) |
| PATCH  | `/departments/:id/assign-employees` | admin, hr  | Bulk-assign employees to a department (`{ "employeeIds": [...] }`) |

### Dashboard
| Method | Endpoint          | Access  | Description                                                    |
|--------|-------------------|---------|-------------------------------------------------------------------|
| GET    | `/dashboard/stats`| Private | Returns totalEmployees, totalDepartments, activeEmployees, inactiveEmployees, recentlyAddedEmployees (last 5) |

### Response Shape
All responses follow the same envelope:
```json
{
  "success": true,
  "message": "Employees fetched successfully",
  "data": { "...": "..." }
}
```
Errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "A valid email is required" }]
}
```

## Error Handling & Status Codes
Centralized in `middleware/errorHandler.js`:
- `400` Bad request / invalid ObjectId
- `401` Unauthenticated / invalid or missing token
- `403` Authenticated but not authorized for this action
- `404` Resource not found
- `409` Duplicate key (e.g. email/department name already exists)
- `422` Validation failed (express-validator)
- `500` Unexpected server error

## Postman Collection
Import `EMS.postman_collection.json` (included in this repo) into Postman. It contains:
- Authentication requests (register, login, logout, me)
- Employee requests (CRUD, search, filter, pagination)
- Department requests (CRUD, assign employees)
- Dashboard stats request

The collection uses a `{{baseUrl}}` variable (default `http://localhost:5000/api/v1`) and a `{{token}}` variable that is auto-populated by a test script on the Login request, so subsequent requests are authenticated automatically.

## Data Models (summary)

**Admin**: `name, email (unique), password (hashed), role [admin|hr]`

**Department**: `name (unique), description`, virtual `employees` (reverse-populated from Employee.department)

**Employee**: `name, email (unique), phone, position, department (ref Department), salary, status [active|inactive], dateOfJoining`

## Scripts
| Command       | Description                          |
|---------------|----------------------------------------|
| `npm run dev` | Start with nodemon (auto-reload)       |
| `npm start`   | Start with plain node                  |
| `npm run seed`| Wipe & reseed the database with sample data |

## Notes on Design Decisions
- **Virtual populate for `Department.employees`** avoids keeping a duplicated array of employee IDs on the department document, which would be redundant with the `Employee.department` reference and prone to going out of sync.
- **Delete department is blocked** if employees are still assigned, to prevent orphaned references — the API returns a `400` with a clear message asking the caller to reassign employees first.
- **Pagination** returns `total`, `page`, `limit`, `totalPages`, `hasNextPage`, `hasPrevPage` so the frontend can build pagination controls without extra requests.
