# API Documentation - Approval Workflow System

This document outlines the available REST API endpoints for the Approval Workflow System.

## Base URL
`http://localhost:3000`

---

## 🔐 Authentication

### Login
Authenticates a user and returns their profile and role information.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "identity": "mithra@isquare.com",
    "password": "password123"
  }
  ```
  *(Identity can be email or phone number)*

- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "id": 102,
      "name": "Mithra (Manager)",
      "email": "mithra@isquare.com",
      "role": {
        "role_name": "MANAGER"
      }
    }
  }
  ```

---

## 🛒 Purchase Requests (PR)

### Create Purchase Request
Initiates a new purchase request and starts the approval workflow.

- **URL**: `/pr`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "customer_name": "Google",
    "product_name": "Cloud Server",
    "quantity": 5,
    "unit_price": 1000,
    "created_by": 101
  }
  ```

### List Purchase Requests
Retrieves a paginated list of all purchase requests.

- **URL**: `/pr/list`
- **Method**: `GET`
- **Parameters**: `page` (number), `limit` (number)
- **Example**: `/pr/list?page=1&limit=10`

---

## ✅ Approvals

### Get Pending Approvals
Lists all requests awaiting action from a specific user.

- **URL**: `/approval/pending`
- **Method**: `GET`
- **Parameters**: `user_id` (number)
- **Example**: `/approval/pending?user_id=102`

### Approve Request
Approves a request at the current level.

- **URL**: `/approval/:request_id/approve`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "user_id": 102,
    "remarks": "Budget looks good."
  }
  ```

### Reject Request
Rejects a request and stops the workflow.

- **URL**: `/approval/:request_id/reject`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "user_id": 102,
    "remarks": "Too expensive."
  }
  ```

---

## 🛠 Admin Management

### Get All Users
Retrieves a list of all registered users (excluding administrators).

- **URL**: `/admin/users`
- **Method**: `GET`

- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
        {
            "id": 101,
            "name": "Kavya (Sales Exec)",
            "role": { "role_name": "SALES_EXEC" },
            "is_active": true
        }
    ]
  }
  ```

---

## Notes
- **Security**: Current version is in prototype mode. Security tokens (JWT) are not yet implemented; user identification is handled via `user_id` in the payload/query.
- **Errors**: Standard error responses return a `success: false` flag and an `error` message.
