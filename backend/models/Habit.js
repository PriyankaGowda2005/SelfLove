// backend/models/Habit.js
const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Habit title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedDates: [{
    date: {
      type: Date,
      required: true
    },
    note: String
  }],
  currentStreak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  icon: {
    type: String,
    default: '🎯'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    default: 'daily'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate streak when saving
habitSchema.methods.calculateStreak = function() {
  if (this.completedDates.length === 0) {
    this.currentStreak = 0;
    return;
  }

  const sortedDates = this.completedDates
    .map(item => new Date(item.date))
    .sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    date.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (date.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  this.currentStreak = streak;
  if (streak > this.bestStreak) {
    this.bestStreak = streak;
  }
};

// Check if habit is completed today
habitSchema.methods.isCompletedToday = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.completedDates.some(item => {
    const date = new Date(item.date);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  });
};

module.exports = mongoose.model('Habit', habitSchema);