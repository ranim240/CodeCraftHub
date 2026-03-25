// controllers/courseController.js
// Controller for CRUD operations on courses
// Uses dataStore to read/write data and performs validation

const dataStore = require('../utils/dataStore');

// Allowed status values
const STATUS_OPTIONS = new Set(['Not Started', 'In Progress', 'Completed']);

// Helper: validate target_date format YYYY-MM-DD
function isValidDateYYYYMMDD(dateStr) {
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const [y, m, day] = dateStr.split('-').map(Number);
  // Check that the date parts match (e.g., not 2023-02-31)
  return d.getUTCFullYear() === y && (d.getUTCMonth() + 1) === m && d.getUTCDate() === day;
}

// GET /api/courses/stats
// Get statistics about courses
async function getStats(req, res) {
  try {
    const courses = await dataStore.readAll();
    const total = courses.length;
    
    // Count courses by status
    const statusCounts = {
      'Not Started': 0,
      'In Progress': 0,
      'Completed': 0
    };
    
    courses.forEach(course => {
      if (statusCounts.hasOwnProperty(course.status)) {
        statusCounts[course.status]++;
      }
    });
    
    const stats = {
      total: total,
      byStatus: statusCounts
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve course statistics' });
  }
}

// GET /api/courses/:id
// Get a single course by id from URL path parameter
async function getById(req, res) {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid course id' });
    }

    const courses = await dataStore.readAll();
    const course = courses.find(c => c.id === numericId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read course' });
  }
}

// GET /api/courses
// - If query param id is provided, return that specific course
// - Otherwise, return all courses
async function getAll(req, res) {
  try {
    const { id } = req.query;
    const courses = await dataStore.readAll();

    if (id) {
      const numericId = parseInt(id, 10);
      if (Number.isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid course id' });
      }
      const course = courses.find(c => c.id === numericId);
      if (!course) return res.status(404).json({ error: 'Course not found' });
      return res.json(course);
    }

    // No id provided, return all courses
    res.json(courses);
  } catch (err) {
    // IO or parse error
    res.status(500).json({ error: 'Failed to read courses' });
  }
}

// POST /api/courses
// Create a new course
// Required fields in body: name, description, target_date, status
async function create(req, res) {
  const { name, description, target_date, status } = req.body;

  // Validate required fields
  if (!name || !description || !target_date || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate status
  if (!STATUS_OPTIONS.has(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // Validate date format
  if (!isValidDateYYYYMMDD(target_date)) {
    return res.status(400).json({ error: 'Invalid target_date format. Expected YYYY-MM-DD' });
  }

  try {
    const courses = await dataStore.readAll();
    const newId = dataStore.generateNextId(courses);
    const newCourse = {
      id: newId,
      name,
      description,
      target_date,
      status,
      created_at: new Date().toISOString()
    };

    courses.push(newCourse);
    await dataStore.writeAll(courses);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
}

// PUT /api/courses/:id
// Update an existing course (partial update)
// Payload can include any of: name, description, target_date, status
async function update(req, res) {
  const { id } = req.params;
  const { name, description, target_date, status } = req.body;

  // Validate id
  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return res.status(400).json({ error: 'Missing or invalid course id' });
  }

  // At least one field must be provided
  if (!name && !description && !target_date && !status) {
    return res.status(400).json({ error: 'At least one field must be provided for update' });
  }

  // Validate status if provided
  if (status && !STATUS_OPTIONS.has(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // Validate date if provided
  if (target_date && !isValidDateYYYYMMDD(target_date)) {
    return res.status(400).json({ error: 'Invalid target_date format. Expected YYYY-MM-DD' });
  }

  try {
    const courses = await dataStore.readAll();
    const index = courses.findIndex(c => c.id === numericId);
    if (index === -1) return res.status(404).json({ error: 'Course not found' });

    const existing = courses[index];
    const updated = {
      id: numericId,
      name: name !== undefined ? name : existing.name,
      description: description !== undefined ? description : existing.description,
      target_date: target_date !== undefined ? target_date : existing.target_date,
      status: status !== undefined ? status : existing.status,
      created_at: existing.created_at // Preserve original creation timestamp
    };

    courses[index] = updated;
    await dataStore.writeAll(courses);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
}

// DELETE /api/courses/:id
// Delete a course by id (from URL path parameter)
async function remove(req, res) {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (Number.isNaN(numericId)) {
    return res.status(400).json({ error: 'Missing or invalid course id' });
  }

  try {
    const courses = await dataStore.readAll();
    const index = courses.findIndex(c => c.id === numericId);
    if (index === -1) return res.status(404).json({ error: 'Course not found' });

    courses.splice(index, 1);
    await dataStore.writeAll(courses);
    res.status(204).send(); // No Content
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
}

module.exports = { getAll, getById, getStats, create, update, remove };