// backend/controllers/taskController.js
const Task = require('../models/Task');
const User = require('../models/User');
const { awardPoints, checkBadges } = require('../utils/points');

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { completed, category, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { user: req.user.id };
    
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const tasks = await Task.find(query)
      .sort({ completed: 1, priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      count: tasks.length,
      total,
      data: tasks,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, category, tags } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      dueDate,
      priority,
      category,
      tags,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const wasCompleted = task.completed;
    const { completed, ...updateData } = req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...updateData, completed },
      { new: true, runValidators: true }
    );

    // Award points if task was just completed
    let pointsAwarded = 0;
    let newBadges = [];
    
    if (completed && !wasCompleted) {
      const user = await User.findById(req.user.id);
      user.stats.totalTasksCompleted += 1;
      pointsAwarded = await awardPoints(user, 'task_complete', task.points || 10);
      newBadges = await checkBadges(user, 'task_count', user.stats.totalTasksCompleted);
      await checkBadges(user, 'points');
    }

    res.json({
      success: true,
      data: task,
      pointsAwarded,
      newBadges
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get task categories
// @route   GET /api/tasks/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Task.distinct('category', { user: req.user.id });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getCategories
};