// app.js
// Entry point for the CodeCraftHub Courses API

const express = require('express');
const app = express();

// Data store helper (ensures the JSON file exists and provides read/write helpers)
const dataStore = require('./utils/dataStore');

// Ensure the data file exists (creates data/courses.json if missing)
dataStore.ensureDataFile();

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount the routes for /api/courses
const coursesRouter = require('./routes/courses');
app.use('/api/courses', coursesRouter);

// Start the server on port 5000 (as requested)
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`CodeCraftHub API listening on port ${PORT}`);
});