// frontend/src/components/TaskCard.js
import React, { useState } from 'react';
import { Check, Edit2, Trash2, Clock, AlertCircle, Calendar } from 'lucide-react';
import { format, isAfter, isToday } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const { awardPoints } = useAuth();

  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      const response = await api.put(`/tasks/${task._id}`, {
        ...task,
        completed: !task.completed
      });

      if (response.data.success) {
        onUpdate();
        if (!task.completed) {
          awardPoints(response.data.pointsAwarded, response.data.newBadges);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  const isOverdue = task.dueDate && !task.completed && isAfter(new Date(), new Date(task.dueDate));
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <div className={`card hover:shadow-md transition-shadow duration-200 ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={handleToggleComplete}
              disabled={loading}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }`}
            >
              {task.completed && <Check className="w-3 h-3" />}
            </button>
            
            <h3 className={`text-lg font-semibold ${
              task.completed 
                ? 'text-gray-500 dark:text-gray-400 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>

            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {task.description}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {task.category && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                {task.category}
              </span>
            )}

            {task.dueDate && (
              <div className={`flex items-center space-x-1 ${
                isOverdue ? 'text-red-500' : isDueToday ? 'text-yellow-500' : ''
              }`}>
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                {isOverdue && <AlertCircle className="w-4 h-4" />}
              </div>
            )}

            {task.points && (
              <div className="flex items-center space-x-1">
                <span className="text-yellow-600">+{task.points} pts</span>
              </div>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onUpdate(task)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(task)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 text-gray-600 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;