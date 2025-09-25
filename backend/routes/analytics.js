
// backend/routes/analytics.js
const express = require('express');
const {
  getDashboardStats,
  getHabitAnalytics,
  getTaskAnalytics,
  getJournalAnalytics
} = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Routes
router.get('/dashboard', getDashboardStats);
router.get('/habits', getHabitAnalytics);
router.get('/tasks', getTaskAnalytics);
router.get('/journals', getJournalAnalytics);

module.exports = router;