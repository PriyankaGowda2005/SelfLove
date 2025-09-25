// backend/routes/tasks.js
const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getCategories
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

router.get('/categories', getCategories);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;


