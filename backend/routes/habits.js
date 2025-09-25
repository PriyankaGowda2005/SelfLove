// backend/routes/habits.js
const express = require('express');
const {
  getHabits,
  createHabit,
  completeHabit,
  uncompleteHabit,
  updateHabit,
  deleteHabit
} = require('../controllers/habitController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Routes
router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .put(updateHabit)
  .delete(deleteHabit);

router.post('/:id/complete', completeHabit);
router.delete('/:id/complete', uncompleteHabit);

module.exports = router;


