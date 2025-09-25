// backend/controllers/analyticsController.js
const Habit = require('../models/Habit');
const Task = require('../models/Task');
const Journal = require('../models/Journal');

// @desc    Get dashboard overview stats
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [habits, tasksIncomplete, tasksComplete, journals] = await Promise.all([
      Habit.find({ user: userId }),
      Task.countDocuments({ user: userId, completed: false }),
      Task.countDocuments({ user: userId, completed: true }),
      Journal.countDocuments({ user: userId })
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const habitsCompletedToday = habits.filter(h => h.completedDates.some(d => {
      const dt = new Date(d.date); dt.setHours(0, 0, 0, 0); return dt.getTime() === today.getTime();
    })).length;

    res.json({
      success: true,
      data: {
        totalHabits: habits.length,
        habitsCompletedToday,
        tasksIncomplete,
        tasksComplete,
        totalJournals: journals
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Build date series helper
const buildDateRange = (days) => {
  const arr = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(start.getDate() - i);
    arr.push(new Date(d));
  }
  return arr;
};

// @desc    Habit analytics (daily counts over N days)
// @route   GET /api/analytics/habits?days=30
// @access  Private
const getHabitAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days || '30');
    const userId = req.user.id;
    const since = new Date();
    since.setDate(since.getDate() - days + 1);
    since.setHours(0, 0, 0, 0);

    const habits = await Habit.find({ user: userId, 'completedDates.date': { $gte: since } });
    const series = buildDateRange(days);

    const counts = series.map(d => {
      const time = d.getTime();
      const c = habits.reduce((sum, h) => {
        return sum + (h.completedDates.some(x => { const dx = new Date(x.date); dx.setHours(0,0,0,0); return dx.getTime() === time; }) ? 1 : 0);
      }, 0);
      return { date: d, count: c };
    });

    res.json({ success: true, data: counts });
  } catch (error) {
    console.error('Habit analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Task analytics (completed per day over N days)
// @route   GET /api/analytics/tasks?days=30
// @access  Private
const getTaskAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days || '30');
    const userId = req.user.id;
    const since = new Date();
    since.setDate(since.getDate() - days + 1);
    since.setHours(0, 0, 0, 0);

    const tasks = await Task.find({ user: userId, completed: true, completedAt: { $gte: since } });
    const series = buildDateRange(days);
    const counts = series.map(d => {
      const time = d.getTime();
      const c = tasks.reduce((sum, t) => {
        const dt = new Date(t.completedAt); dt.setHours(0,0,0,0);
        return sum + (dt.getTime() === time ? 1 : 0);
      }, 0);
      return { date: d, count: c };
    });

    res.json({ success: true, data: counts });
  } catch (error) {
    console.error('Task analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Journal analytics (mood average per day)
// @route   GET /api/analytics/journals?days=30
// @access  Private
const getJournalAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days || '30');
    const userId = req.user.id;
    const since = new Date();
    since.setDate(since.getDate() - days + 1);
    since.setHours(0, 0, 0, 0);

    const entries = await Journal.find({ user: userId, createdAt: { $gte: since } });
    const series = buildDateRange(days);
    const data = series.map(d => {
      const time = d.getTime();
      const todays = entries.filter(e => { const de = new Date(e.createdAt); de.setHours(0,0,0,0); return de.getTime() === time; });
      const avg = todays.length ? (todays.reduce((s, e) => s + (e.moodScore || 3), 0) / todays.length) : 0;
      return { date: d, avgMood: avg, count: todays.length };
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Journal analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getHabitAnalytics,
  getTaskAnalytics,
  getJournalAnalytics
};

// backend/controllers/analyticsController.js
const Habit = require('../models/Habit');
const Task = require('../models/Task');
const Journal = require('../models/Journal');
const User = require('../models/User');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get basic counts
    const [habits, tasks, journals, user] = await Promise.all([
      Habit.find({ user: userId, isActive: true }),
      Task.find({ user: userId }),
      Journal.find({ user: userId }),
      User.findById(userId).select('-password')
    ]);

    // Calculate today's stats
    const todayHabits = habits.filter(habit => habit.isCompletedToday());
    const todayTasks = tasks.filter(task => 
      task.completed && 
      task.completedAt && 
      task.completedAt.toDateString() === new Date().toDateString()
    );

    // Calculate streaks
    const activeStreaks = habits.filter(habit => habit.currentStreak > 0);
    const longestStreak = Math.max(...habits.map(h => h.currentStreak), 0);

    // Weekly progress
    const weeklyHabitsCompleted = habits.reduce((total, habit) => {
      const weekCompletions = habit.completedDates.filter(completion => 
        new Date(completion.date) >= startOfWeek
      ).length;
      return total + weekCompletions;
    }, 0);

    const weeklyTasksCompleted = tasks.filter(task => 
      task.completed && 
      task.completedAt && 
      task.completedAt >= startOfWeek
    ).length;

    const weeklyJournalEntries = journals.filter(journal => 
      journal.createdAt >= startOfWeek
    ).length;

    res.json({
      success: true,
      data: {
        overview: {
          totalHabits: habits.length,
          totalTasks: tasks.length,
          totalJournals: journals.length,
          totalPoints: user.points,
          badges: user.badges.length
        },
        today: {
          habitsCompleted: todayHabits.length,
          totalHabits: habits.length,
          tasksCompleted: todayTasks.length,
          habitCompletionRate: habits.length > 0 ? (todayHabits.length / habits.length * 100).toFixed(1) : 0
        },
        streaks: {
          activeStreaks: activeStreaks.length,
          longestStreak,
          totalActiveStreakDays: activeStreaks.reduce((sum, h) => sum + h.currentStreak, 0)
        },
        weekly: {
          habitsCompleted: weeklyHabitsCompleted,
          tasksCompleted: weeklyTasksCompleted,
          journalEntries: weeklyJournalEntries
        },
        recentBadges: user.badges.slice(-3).reverse()
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get habit analytics
// @route   GET /api/analytics/habits
// @access  Private
const getHabitAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const userId = req.user._id;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const habits = await Habit.find({ 
      user: userId, 
      isActive: true 
    });

    // Daily completion rates
    const dailyStats = [];
    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const completedCount = habits.reduce((count, habit) => {
        const completed = habit.completedDates.some(completion => {
          const completionDate = new Date(completion.date);
          completionDate.setHours(0, 0, 0, 0);
          return completionDate.getTime() === date.getTime();
        });
        return completed ? count + 1 : count;
      }, 0);

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        completed: completedCount,
        total: habits.length,
        percentage: habits.length > 0 ? (completedCount / habits.length * 100).toFixed(1) : 0
      });
    }

    // Individual habit performance
    const habitStats = habits.map(habit => ({
      id: habit._id,
      title: habit.title,
      currentStreak: habit.currentStreak,
      bestStreak: habit.bestStreak,
      totalCompletions: habit.completedDates.length,
      completionRate: habit.completedDates.length > 0 ? 
        (habit.completedDates.filter(c => new Date(c.date) >= startDate).length / parseInt(days) * 100).toFixed(1) : 0,
      color: habit.color
    }));

    res.json({
      success: true,
      data: {
        dailyStats,
        habitStats,
        summary: {
          totalHabits: habits.length,
          averageStreak: habits.length > 0 ? 
            (habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length).toFixed(1) : 0,
          bestOverallStreak: Math.max(...habits.map(h => h.bestStreak), 0)
        }
      }
    });
  } catch (error) {
    console.error('Get habit analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get task analytics
// @route   GET /api/analytics/tasks
// @access  Private
const getTaskAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const tasks = await Task.find({ user: userId });

    // Task completion by priority
    const priorityStats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$priority',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      }
    ]);

    // Task completion by category
    const categoryStats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      }
    ]);

    // Daily task completions
    const dailyCompletions = await Task.aggregate([
      {
        $match: {
          user: userId,
          completed: true,
          completedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const overdueTasks = tasks.filter(t => 
      !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;

    res.json({
      success: true,
      data: {
        summary: {
          total: totalTasks,
          completed: completedTasks,
          pending: totalTasks - completedTasks,
          overdue: overdueTasks,
          completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0
        },
        priorityStats,
        categoryStats,
        dailyCompletions
      }
    });
  } catch (error) {
    console.error('Get task analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get journal analytics
// @route   GET /api/analytics/journals
// @access  Private
const getJournalAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Mood distribution
    const moodStats = await Journal.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
          avgMoodScore: { $avg: '$moodScore' }
        }
      }
    ]);

    // Daily mood scores
    const dailyMoods = await Journal.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          avgMoodScore: { $avg: '$moodScore' },
          entryCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Writing frequency
    const writingFrequency = await Journal.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dayOfWeek: '$createdAt'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalEntries = await Journal.countDocuments({ user: userId });
    const recentEntries = await Journal.countDocuments({
      user: userId,
      createdAt: { $gte: startDate }
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalEntries,
          recentEntries,
          averageEntriesPerDay: (recentEntries / parseInt(days)).toFixed(1)
        },
        moodStats,
        dailyMoods,
        writingFrequency
      }
    });
  } catch (error) {
    console.error('Get journal analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getDashboardStats,
  getHabitAnalytics,
  getTaskAnalytics,
  getJournalAnalytics
};'Server error'
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

// @desc    Mark habit as complete for today
// @route   POST /api/habits/:id/complete
// @access  Private
const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    const alreadyCompleted = habit.completedDates.some(item => {
      const date = new Date(item.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Habit already completed today'
      });
    }

    // Add today's completion
    habit.completedDates.push({ 
      date: today, 
      note: req.body.note || '' 
    });
    habit.calculateStreak();

    await habit.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    user.stats.totalHabitsCompleted += 1;
    if (habit.currentStreak > user.stats.longestStreak) {
      user.stats.longestStreak = habit.currentStreak;
    }

    // Award points and check badges
    await awardPoints(user, 'habit_complete', 20);
    const newBadges = await checkBadges(user, 'habit_streak', habit.currentStreak);
    await checkBadges(user, 'points');

    res.json({
      success: true,
      data: habit,
      pointsAwarded: 20,
      newBadges
    });
  } catch (error) {
    console.error('Complete habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Uncomplete habit for today
// @route   DELETE /api/habits/:id/complete
// @access  Private
const uncompleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Remove today's completion
    habit.completedDates = habit.completedDates.filter(item => {
      const date = new Date(item.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime() !== today.getTime();
    });

    habit.calculateStreak();
    await habit.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    user.stats.totalHabitsCompleted = Math.max(0, user.stats.totalHabitsCompleted - 1);
    user.points = Math.max(0, user.points - 20);
    await user.save();

    res.json({
      success: true,
      data: habit,
      message: 'Habit unmarked for today'
    });
  } catch (error) {
    console.error('Uncomplete habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    let habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const { title, description, color, icon, frequency } = req.body;

    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { title, description, color, icon, frequency },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: habit
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Soft delete
    habit.isActive = false;
    await habit.save();

    res.json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });