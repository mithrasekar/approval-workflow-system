# Approval Workflow System - ISquare

A robust, multi-level approval workflow system built for enterprise purchase requests. This project includes a dynamic rule-based engine, secure authentication, and a premium administrative dashboard.

## 🚀 Key Features
- **Dynamic Approval Engine**: Rule-based workflow that adjusts based on user roles and PR values.
- **Multi-Level Approvals**: Configurable sequential approval steps (e.g., Level 1: Manager, Level 2: Role-based).
- **Security**: Password encryption using `bcrypt` and secure authentication flows.
- **Admin Dashboard**: Specialized interface for user management and system monitoring.
- **Rich UI**: Modern, responsive design using React and Material UI with premium aesthetics.

## 🛠 Tech Stack
- **Frontend**: React, Material UI (MUI), Axios
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL
- **Security**: Bcryptjs for password hashing

## 📂 Project Structure
- `/frontend`: React application (Vite-based)
- `/backend`: Express API and Sequelize models/migrations
- `database_migration.sql`: Consolidated PostgreSQL script for schema and seed data
- `api_documentation.md`: Detailed REST API reference
- `postman_collection.json`: Importable collection for API testing

## 🏁 Setup Instructions

### 1. Database Setup
1. Create a PostgreSQL database named `approval_process`.
2. Run the provided [database_migration.sql](./backend/database_migration.sql) script in your SQL editor (like pgAdmin or psql) to create the schema and initial seed data.

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies: `npm install`
3. Configure `.env` with your database credentials (if applicable).
4. Start the server: `node app.js` (Server runs on port 3000).

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev` (Runs on port 5173).

## 🔑 Default Credentials
- **Admin**: `admin@isquare.com` / `admin1234`
- **Manager**: `mithra@isquare.com` / `password123`
- **Sales Executive**: `kavya@isquare.com` / `password123`

## 📦 How to Submit / Package
To deliver the project to the client, it is recommended to:
1. Delete all `node_modules` folders from both `/frontend` and `/backend`.
2. ZIP the entire root folder.
3. Ensure the `database_migration.sql` and `api_documentation.md` are included in the root for easy access.
