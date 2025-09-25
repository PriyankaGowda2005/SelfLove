// backend/routes/journals.js
const express = require('express');
const {
  getJournals,
  createJournal,
  getJournal,
  updateJournal,
  deleteJournal,
  getMoodStats
} = require('../controllers/journalController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Routes
router.route('/')
  .get(getJournals)
  .post(createJournal);

router.get('/mood-stats', getMoodStats);

router.route('/:id')
  .get(getJournal)
  .put(updateJournal)
  .delete(deleteJournal);

module.exports = router;
