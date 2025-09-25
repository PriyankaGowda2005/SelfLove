// frontend/src/components/MoodTracker.js
import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

const MoodTracker = ({ mood, onMoodChange, size = 'md' }) => {
  const moods = [
    { value: 'very_sad', emoji: '😢', label: 'Very Sad', score: 1, color: 'text-red-500' },
    { value: 'sad', emoji: '😕', label: 'Sad', score: 2, color: 'text-orange-500' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', score: 3, color: 'text-yellow-500' },
    { value: 'happy', emoji: '😊', label: 'Happy', score: 4, color: 'text-green-500' },
    { value: 'very_happy', emoji: '😄', label: 'Very Happy', score: 5, color: 'text-blue-500' },
  ];

  const sizeClasses = {
    sm: 'text-2xl p-2',
    md: 'text-3xl p-3',
    lg: 'text-4xl p-4'
  };

  return (
    <div className="flex justify-center space-x-2">
      {moods.map((moodOption) => (
        <button
          key={moodOption.value}
          onClick={() => onMoodChange && onMoodChange(moodOption.value, moodOption.score)}
          className={`${sizeClasses[size]} rounded-lg transition-all duration-200 hover:scale-110 ${
            mood === moodOption.value 
              ? 'bg-primary-100 dark:bg-primary-900 ring-2 ring-primary-500' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={moodOption.label}
        >
          <span className={mood === moodOption.value ? moodOption.color : 'grayscale'}>
            {moodOption.emoji}
          </span>
        </button>
      ))}
    </div>
  );
};

export const MoodStats = ({ moodData }) => {
  if (!moodData || moodData.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No mood data available
      </div>
    );
  }

  const moodLabels = {
    very_sad: '😢 Very Sad',
    sad: '😕 Sad',
    neutral: '😐 Neutral',
    happy: '😊 Happy',
    very_happy: '😄 Very Happy'
  };

  return (
    <div className="space-y-3">
      {moodData.map((mood) => (
        <div key={mood._id} className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {moodLabels[mood._id] || mood._id}
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(mood.count / Math.max(...moodData.map(m => m.count))) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
              {mood.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoodTracker;