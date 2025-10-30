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
      const dt = new Date(d.date); 
      dt.setHours(0, 0, 0, 0); 
      return dt.getTime() === today.getTime();
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
        return sum + (h.completedDates.some(x => { 
          const dx = new Date(x.date); 
          dx.setHours(0,0,0,0); 
          return dx.getTime() === time; 
        }) ? 1 : 0);
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
        const dt = new Date(t.completedAt); 
        dt.setHours(0,0,0,0);
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
      const todays = entries.filter(e => { 
        const de = new Date(e.createdAt); 
        de.setHours(0,0,0,0); 
        return de.getTime() === time; 
      });
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