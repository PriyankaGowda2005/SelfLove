// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: { type: Date, default: Date.now },
    description: String,
    icon: String
  }],
  preferences: {
    darkMode: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
    timezone: { type: String, default: 'UTC' }
  },
  stats: {
    totalHabitsCompleted: { type: Number, default: 0 },
    totalTasksCompleted: { type: Number, default: 0 },
    totalJournalEntries: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);