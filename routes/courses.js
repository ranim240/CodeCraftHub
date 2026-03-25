// routes/courses.js
// REST API endpoints for courses
// - POST /api/courses -> Add a new course
// - GET /api/courses -> Get all courses (and optional single by id query)
// - GET /api/courses/:id -> Get a single course by id
// - PUT /api/courses/:id -> Update a course
// - DELETE /api/courses/:id -> Delete a course
// - GET /api/courses/stats -> Get course statistics

const express = require('express');
const router = express.Router();

// Controller functions
const courseController = require('../controllers/courseController');

// Route mappings
router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);
router.get('/stats', courseController.getStats);
router.post('/', courseController.create);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.remove);

module.exports = router;