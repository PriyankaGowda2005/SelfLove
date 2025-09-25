// frontend/src/components/JournalCard.js
import React from 'react';
import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

const JournalCard = ({ journal, onEdit, onDelete }) => {
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      very_sad: '😢',
      sad: '😕',
      neutral: '😐',
      happy: '😊',
      very_happy: '😄'
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          {journal.title}
        </h3>
        
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center space-x-1 text-2xl">
            {getMoodEmoji(journal.mood)}
          </div>
          
          <button
            onClick={() => onEdit(journal)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(journal)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 text-gray-600 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {journal.content.length > 150 ? `${journal.content.substring(0, 150)}...` : journal.content}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(journal.createdAt), 'MMM dd, yyyy')}</span>
          </div>
          
          {journal.weather && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
              {journal.weather}
            </span>
          )}
        </div>

        {journal.tags && journal.tags.length > 0 && (
          <div className="flex items-center space-x-1">
            <Tag className="w-4 h-4" />
            <span>{journal.tags.length} tag{journal.tags.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {journal.tags && journal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {journal.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
              #{tag}
            </span>
          ))}
          {journal.tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{journal.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JournalCard;