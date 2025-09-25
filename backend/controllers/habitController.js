// backend/controllers/habitController.js
const Habit = require('../models/Habit');
const User = require('../models/User');
const { awardPoints, checkBadges } = require('../utils/points');

// @desc    Get all habits for user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id, isActive: true })
      .sort({ createdAt: -1 });

    // Add completion status for today to each habit
    const habitsWithStatus = habits.map(habit => {
      const habitObj = habit.toObject();
      habitObj.completedToday = habit.isCompletedToday();
      return habitObj;
    });

    res.json({
      success: true,
      count: habits.length,
      data: habitsWithStatus
    });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
  try {
    const { title, description, color, icon, frequency } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Habit title is required'
      });
    }

    const habit = await Habit.create({
      title: title.trim(),
      description,
      color,
      icon,
      frequency,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: habit
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Mark habit complete for today
// @route   POST /api/habits/:id/complete
// @access  Private
const completeHabit = async (req, res) => {
  try {
    let habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    // If already completed today, ignore
    if (habit.isCompletedToday()) {
      return res.json({ success: true, data: habit, pointsAwarded: 0, newBadges: [] });
    }

    habit.completedDates.push({ date: new Date() });
    habit.calculateStreak();
    await habit.save();

    // Update user stats and award points
    const user = await User.findById(req.user.id);
    user.stats.totalHabitsCompleted += 1;
    const pointsAwarded = await awardPoints(user, 'habit_complete');
    const newBadges = [
      ...(await checkBadges(user, 'habit_streak', habit.currentStreak)),
    ];
    await checkBadges(user, 'points');

    res.json({ success: true, data: habit, pointsAwarded, newBadges });
  } catch (error) {
    console.error('Complete habit error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Unmark habit complete for today
// @route   DELETE /api/habits/:id/complete
// @access  Private
const uncompleteHabit = async (req, res) => {
  try {
    let habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const before = habit.completedDates.length;
    habit.completedDates = habit.completedDates.filter(item => {
      const d = new Date(item.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() !== today.getTime();
    });

    if (habit.completedDates.length === before) {
      return res.json({ success: true, data: habit });
    }

    habit.calculateStreak();
    await habit.save();

    res.json({ success: true, data: habit });
  } catch (error) {
    console.error('Uncomplete habit error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    let habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const allowed = ['title', 'description', 'color', 'icon', 'frequency', 'isActive'];
    const updateData = {};
    for (const key of allowed) {
      if (key in req.body) updateData[key] = req.body[key];
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.json({ success: true, data: habit });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    await Habit.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getHabits,
  createHabit,
  completeHabit,
  uncompleteHabit,
  updateHabit,
  deleteHabit
};