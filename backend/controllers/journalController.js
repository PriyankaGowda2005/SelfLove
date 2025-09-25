// backend/controllers/journalController.js
const Journal = require('../models/Journal');
const User = require('../models/User');
const { awardPoints, checkBadges } = require('../utils/points');

// @desc    Get all journal entries for user
// @route   GET /api/journals
// @access  Private
const getJournals = async (req, res) => {
  try {
    const { search, mood, page = 1, limit = 10, startDate, endDate } = req.query;
    
    // Build query
    let query = { user: req.user.id };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (mood && mood !== 'all') {
      query.mood = mood;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const journals = await Journal.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Journal.countDocuments(query);

    res.json({
      success: true,
      count: journals.length,
      total,
      data: journals,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get journals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new journal entry
// @route   POST /api/journals
// @access  Private
const createJournal = async (req, res) => {
  try {
    const { title, content, mood, moodScore, tags, isPrivate, weather, location } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Journal title is required'
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Journal content is required'
      });
    }

    const journal = await Journal.create({
      title: title.trim(),
      content: content.trim(),
      mood,
      moodScore,
      tags,
      isPrivate,
      weather,
      location,
      user: req.user.id
    });

    // Update user stats and award points
    const user = await User.findById(req.user.id);
    user.stats.totalJournalEntries += 1;
    const pointsAwarded = await awardPoints(user, 'journal_entry', 15);
    const newBadges = await checkBadges(user, 'journal_count', user.stats.totalJournalEntries);
    await checkBadges(user, 'points');

    res.status(201).json({
      success: true,
      data: journal,
      pointsAwarded,
      newBadges
    });
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single journal entry
// @route   GET /api/journals/:id
// @access  Private
const getJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Get journal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update journal entry
// @route   PUT /api/journals/:id
// @access  Private
const updateJournal = async (req, res) => {
  try {
    let journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Update journal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journals/:id
// @access  Private
const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    await Journal.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete journal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get mood statistics
// @route   GET /api/journals/mood-stats
// @access  Private
const getMoodStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const moodStats = await Journal.aggregate([
      {
        $match: {
          user: req.user._id,
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

    res.json({
      success: true,
      data: moodStats
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getJournals,
  createJournal,
  getJournal,
  updateJournal,
  deleteJournal,
  getMoodStats
};