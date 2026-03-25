// utils/dataStore.js
// Simple JSON-file data store for courses
// Exposes: ensureDataFile(), readAll(), writeAll(), generateNextId()

const fs = require('fs');
const path = require('path');

// Path to the data directory and the JSON file
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'courses.json');

// Ensure data directory and file exist. If missing, create them with an empty array.
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

// Read all courses from the JSON file
function readAll() {
  return new Promise((resolve, reject) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) return reject(err);
      try {
        const arr = JSON.parse(data);
        resolve(Array.isArray(arr) ? arr : []);
      } catch (e) {
        // If invalid JSON, treat as an error
        reject(new Error('Invalid JSON data in courses.json'));
      }
    });
  });
}

// Write the entire courses array back to the JSON file
function writeAll(items) {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(items, null, 2);
    fs.writeFile(DATA_FILE, json, 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Generate the next numeric ID based on existing items
function generateNextId(items) {
  const max = items.reduce((acc, cur) => {
    const id = typeof cur.id === 'number' ? cur.id : 0;
    return Math.max(acc, id);
  }, 0);
  return max + 1;
}

module.exports = {
  ensureDataFile,
  readAll,
  writeAll,
  generateNextId
};