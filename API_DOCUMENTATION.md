# GigFlow – Smart Leads Dashboard API Specification

Welcome to the **GigFlow REST API** documentation. All requests should be sent to the base URL:

```
http://localhost:5000/api/v1
```

---

## 🔒 Authentication & Headers

All endpoints under the `/leads` path and `/auth/me` are protected and require a Bearer JSON Web Token (JWT).

### Required Headers (Protected Routes)
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 📂 Auth Endpoints

### 1. Register User
Create a new user account (defaults to role `SALES` or `ADMIN`).

* **Route**: `POST /auth/register`
* **Authentication**: None
* **Request Body**:
```json
{
  "name": "Alex Mercer",
  "email": "alex@gigflow.io",
  "password": "SecurePassword123",
  "role": "SALES"
}
```
* **Response (201 Created)**:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60c72b2f9b1d8b2e88a6d4d1",
    "name": "Alex Mercer",
    "email": "alex@gigflow.io",
    "role": "SALES",
    "createdAt": "2026-05-18T15:20:00.000Z"
  }
}
```
* **Status Codes**:
  * `201 Created`: Account successfully registered.
  * `400 Bad Request`: Validation failure or email already in use.

---

### 2. Login User
Authenticate an existing user and obtain a JWT.

* **Route**: `POST /auth/login`
* **Authentication**: None
* **Request Body**:
```json
{
  "email": "alex@gigflow.io",
  "password": "SecurePassword123"
}
```
* **Response (200 OK)**:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60c72b2f9b1d8b2e88a6d4d1",
    "name": "Alex Mercer",
    "email": "alex@gigflow.io",
    "role": "SALES"
  }
}
```
* **Status Codes**:
  * `200 OK`: Login successful.
  * `401 Unauthorized`: Invalid credentials.

---

### 3. Get Current User (Me)
Fetch details of the currently authenticated session.

* **Route**: `GET /auth/me`
* **Authentication**: Bearer Token
* **Response (200 OK)**:
```json
{
  "status": "success",
  "user": {
    "_id": "60c72b2f9b1d8b2e88a6d4d1",
    "name": "Alex Mercer",
    "email": "alex@gigflow.io",
    "role": "SALES"
  }
}
```

---

## 📂 Leads Endpoints

### 1. List Leads
Fetch a paginated list of leads, complete with advanced searching, filtering, and sorting query parameters.

* **Route**: `GET /leads`
* **Authentication**: Bearer Token
* **Query Parameters**:
  | Parameter | Type | Default | Description |
  | :--- | :--- | :--- | :--- |
  | `page` | `number` | `1` | Page index of the pagination results. |
  | `search` | `string` | `""` | Search criteria matching partial name or email (case-insensitive). |
  | `status` | `string` | `""` | Filter by lead status: `NEW`, `CONTACTED`, `QUALIFIED`, `LOST`. |
  | `source` | `string` | `""` | Filter by lead source: `WEBSITE`, `INSTAGRAM`, `REFERRAL`. |
  | `sort` | `string` | `"latest"` | Sorting order: `latest` (newest first), `oldest` (oldest first). |

* **Request Example**:
```http
GET /leads?page=1&status=QUALIFIED&source=INSTAGRAM&sort=latest&search=alex
```

* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [
    {
      "_id": "60c72b2f9b1d8b2e88a6d4ee",
      "name": "Alex Rider",
      "email": "rider@alex.com",
      "status": "QUALIFIED",
      "source": "INSTAGRAM",
      "assignedTo": {
        "_id": "60c72b2f9b1d8b2e88a6d4d1",
        "name": "Alex Mercer",
        "email": "alex@gigflow.io",
        "role": "SALES"
      },
      "createdAt": "2026-05-18T12:00:00.000Z",
      "updatedAt": "2026-05-18T13:45:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 24,
    "hasNextPage": true,
    "hasPrevPage": false,
    "perPage": 10
  }
}
```

---

### 2. Create Lead
Add a new lead to the pipeline.

* **Route**: `POST /leads`
* **Authentication**: Bearer Token
* **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com",
  "status": "NEW",
  "source": "WEBSITE",
  "assignedTo": "60c72b2f9b1d8b2e88a6d4d1"
}
```
* **Response (210 Created)**:
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "60c72b2f9b1d8b2e88a6d4fa",
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "status": "NEW",
    "source": "WEBSITE",
    "assignedTo": {
      "_id": "60c72b2f9b1d8b2e88a6d4d1",
      "name": "Alex Mercer",
      "email": "alex@gigflow.io",
      "role": "SALES"
    },
    "createdAt": "2026-05-18T15:22:10.000Z",
    "updatedAt": "2026-05-18T15:22:10.000Z"
  }
}
```

---

### 3. Get Lead By ID
Fetch details of a single lead.

* **Route**: `GET /leads/:id`
* **Authentication**: Bearer Token
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": {
    "_id": "60c72b2f9b1d8b2e88a6d4fa",
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "status": "NEW",
    "source": "WEBSITE",
    "assignedTo": {
      "_id": "60c72b2f9b1d8b2e88a6d4d1",
      "name": "Alex Mercer",
      "email": "alex@gigflow.io",
      "role": "SALES"
    },
    "createdAt": "2026-05-18T15:22:10.000Z",
    "updatedAt": "2026-05-18T15:22:10.000Z"
  }
}
```
* **Status Codes**:
  * `200 OK`: Request successful.
  * `400 Bad Request`: Invalid Lead Object ID format.
  * `404 Not Found`: Lead could not be found.

---

### 4. Update Lead
Modify properties of an existing lead.

* **Route**: `PUT /leads/:id`
* **Authentication**: Bearer Token
* **Request Body**:
```json
{
  "name": "Johnathan Doe",
  "status": "CONTACTED"
}
```
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "_id": "60c72b2f9b1d8b2e88a6d4fa",
    "name": "Johnathan Doe",
    "email": "john.doe@gmail.com",
    "status": "CONTACTED",
    "source": "WEBSITE",
    "assignedTo": {
      "_id": "60c72b2f9b1d8b2e88a6d4d1",
      "name": "Alex Mercer",
      "email": "alex@gigflow.io",
      "role": "SALES"
    },
    "createdAt": "2026-05-18T15:22:10.000Z",
    "updatedAt": "2026-05-18T15:24:00.000Z"
  }
}
```

---

### 5. Delete Lead
Delete a lead from the registry.

* **Route**: `DELETE /leads/:id`
* **Authentication**: Bearer Token (ADMIN Role Only)
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": null
}
```
* **Status Codes**:
  * `200 OK`: Lead successfully removed.
  * `403 Forbidden`: Authenticated user is not an Admin.
  * `404 Not Found`: Lead not found.
