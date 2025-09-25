// backend/models/Journal.js
const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Journal title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Journal content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: ['very_happy', 'happy', 'neutral', 'sad', 'very_sad'],
    default: 'neutral'
  },
  moodScore: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  weather: {
    type: String
  },
  location: {
    type: String
  }
}, {
  timestamps: true
});

// Index for text search
journalSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Journal', journalSchema);