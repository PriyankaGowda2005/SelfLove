// frontend/src/components/HabitCard.js
import React, { useState } from 'react';
import { Check, Edit2, Trash2, Calendar, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const HabitCard = ({ habit, onUpdate, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const { awardPoints } = useAuth();

  const handleComplete = async () => {
    if (habit.completedToday) {
      // Uncomplete habit
      try {
        setLoading(true);
        await api.delete(`/habits/${habit._id}/complete`);
        onUpdate();
        toast.success('Habit unmarked for today');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to uncomplete habit');
      } finally {
        setLoading(false);
      }
    } else {
      // Complete habit
      try {
        setLoading(true);
        const response = await api.post(`/habits/${habit._id}/complete`);
        if (response.data.success) {
          onUpdate();
          awardPoints(response.data.pointsAwarded, response.data.newBadges);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to complete habit');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStreakColor = (streak) => {
    if (streak === 0) return 'text-gray-500';
    if (streak < 7) return 'text-orange-500';
    if (streak < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {habit.title}
            </h3>
            {habit.completedToday && (
              <Check className="w-5 h-5 text-green-500" />
            )}
          </div>
          
          {habit.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {habit.description}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Flame className={`w-4 h-4 ${getStreakColor(habit.currentStreak)}`} />
              <span>
                {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Best: {habit.bestStreak}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleComplete}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              habit.completedToday
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900 text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300'
            }`}
          >
            <Check className="w-5 h-5" />
          </button>

          <button
            onClick={() => onUpdate(habit)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(habit)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 text-gray-600 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard; 