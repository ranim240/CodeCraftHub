# CodeCraftHub Courses API

A beginner-friendly Express REST API for managing courses. Data is stored in a JSON file (data/courses.json). The server runs on port 5000 and includes full CRUD operations with validation and helpful error messages.

---

## Project overview

- Lightweight REST API to manage courses
- Data stored in a JSON file: data/courses.json (created automatically if missing)
- Endpoints under /api/courses
- Each course has:
  - id: auto-generated, starting from 1
  - name: required
  - description: required
  - target_date: required, format YYYY-MM-DD
  - status: required, one of "Not Started", "In Progress", "Completed"
  - created_at: auto-generated timestamp

---

## Features

- Create, Read (all and single), Update, Delete (CRUD)
- Automatic data file creation if it doesn't exist
- Input validation for required fields, date format, and status values
- Clear error handling:
  - Missing required fields
  - Course not found
  - Invalid status values
  - File read/write errors
- Easy to run and understand, great for beginners

---

## Tech stack

- Node.js
- Express

---

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node.js)

---

## Installation

1. Clone or download the project.
2. Open a terminal in the project root.
3. Install dependencies:
   - npm install

---

## How to run the application

- Start the server:
  - npm start
- The server listens on port 5000

Note: The app uses data/courses.json as the data store. If the data directory or file does not exist, it will be created automatically.

---

## API endpoint documentation

Base URL: http://localhost:5000/api/courses

Endpoints and behavior:

- POST /api/courses
  - Create a new course
  - Required fields in JSON body: name, description, target_date (YYYY-MM-DD), status
  - Response: 201 Created with the new course object

- GET /api/courses
  - Get all courses
  - Optional query parameter id to fetch a single course:
    - GET /api/courses?id=1 (if your implementation supports the query form)
  - Response: array of courses

- GET /api/courses/:id
  - Get a single course by ID
  - Response: the course object or 404 if not found

- PUT /api/courses/:id
  - Update an existing course
  - ID is provided in the URL: /api/courses/:id
  - Body should include: name, description, target_date (YYYY-MM-DD), status
  - Response: the updated course object

- DELETE /api/courses/:id
  - Delete a course
  - ID is provided in the URL: /api/courses/:id
  - Response: 204 No Content on success
- GET /api/courses/stats
  - Get statistics about courses
  - Response:
    - 200 OK with a JSON body containing:
      {
        "total": <number_of_courses>,
        "by_status": {
          "Not Started": <count>,
          "In Progress": <count>,
          "Completed": <count>
        }
      }

Status values for a course:
- Not Started
- In Progress
- Completed

Date format:
- target_date must be in YYYY-MM-DD (e.g., 2026-08-01)

---

## Data storage

- Data file: data/courses.json
- Created automatically if missing
- Structure: an array of course objects

Example of a course object:
{
  "id": 1,
  "name": "Intro to Node.js",
  "description": "Learn the basics of Node.js",
  "target_date": "2026-05-01",
  "status": "Not Started",
  "created_at": "2026-03-25T12:34:56.789Z"
}

---

## Error handling

Common errors and responses:
- Missing required fields
  - 400 Bad Request with a message like "Missing required fields"
- Course not found
  - 404 Not Found with a message like "Course not found"
- Invalid status values
  - 400 Bad Request with a message like "Invalid status"
- Invalid target_date format
  - 400 Bad Request with a message like "Invalid target_date format. Expected YYYY-MM-DD"
- File read/write errors
  - 500 Internal Server Error with a message like "Failed to read courses" or "Failed to create course"

---

## Project structure (for reference)

- app.js (Express server setup)
- data/
  - courses.json (data store, auto-created)
- utils/
  - dataStore.js (readAll, writeAll, generateNextId, ensureDataFile)
- controllers/
  - courseController.js (CRUD logic)
- routes/
  - courses.js (CRUD endpoints)
- package.json (dependencies and start script)

---

## Troubleshooting

- Server not starting on port 5000
  - Ensure the port is not in use by another process
  - Check console for error messages
- Data file not being created
  - Ensure the process has permission to write to the project directory
  - Verify data directory permissions
- JSON parse errors in courses.json
  - The app will reset to an empty array if the JSON is invalid, but it’s safer to fix the JSON format
- Validation failures (date format, status)
  - Double-check target_date format (YYYY-MM-DD) and ensure status is one of the allowed values

---

