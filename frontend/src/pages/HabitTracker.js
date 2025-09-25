// frontend/src/pages/HabitTracker.js
import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, Filter } from 'lucide-react';
import HabitCard from '../components/HabitCard';
import { HabitFormModal } from '../components/FormModal';
import { HabitCompletionChart } from '../components/AnalyticsCharts';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/habits');
      if (response.data.success) {
        setHabits(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/habits?days=30');
      if (response.data.success) {
        setAnalyticsData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch analytics');
    }
  };

  const handleCreateHabit = async (habitData) => {
    try {
      const response = await api.post('/habits', habitData);
      if (response.data.success) {
        toast.success('Habit created successfully!');
        fetchHabits();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create habit');
    }
  };

  const handleUpdateHabit = async (habitData) => {
    try {
      const response = await api.put(`/habits/${editingHabit._id}`, habitData);
      if (response.data.success) {
        toast.success('Habit updated successfully!');
        fetchHabits();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update habit');
    }
  };

  const handleDeleteHabit = async (habit) => {
    if (window.confirm(`Are you sure you want to delete "${habit.title}"?`)) {
      try {
        await api.delete(`/habits/${habit._id}`);
        toast.success('Habit deleted successfully!');
        fetchHabits();
      } catch (error) {
        toast.error('Failed to delete habit');
      }
    }
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHabit(null);
  };

  const toggleAnalytics = () => {
    if (!showAnalytics) {
      fetchAnalytics();
    }
    setShowAnalytics(!showAnalytics);
  };

  const completedToday = habits.filter(habit => habit.completedToday).length;
  const completionRate = habits.length > 0 ? (completedToday / habits.length * 100).toFixed(1) : 0;

  if (loading) {
    return <LoadingSpinner text="Loading your habits..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Habit Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Build consistent habits for lasting change
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={toggleAnalytics}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{showAnalytics ? 'Hide' : 'Show'} Analytics</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-500 mb-2">
            {completedToday}/{habits.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Habits completed today</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-500 mb-2">
            {completionRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completion rate</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-500 mb-2">
            {habits.reduce((sum, habit) => sum + habit.currentStreak, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total active streak days</div>
        </div>
      </div>

      {/* Analytics */}
      {showAnalytics && analyticsData && (
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            30-Day Progress
          </h3>
          <HabitCompletionChart data={analyticsData.dailyStats} />
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No habits yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first habit to start building positive routines
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onUpdate={fetchHabits}
              onEdit={openEditModal}
              onDelete={handleDeleteHabit}
            />
          ))
        )}
      </div>

      {/* Habit Form Modal */}
      <HabitFormModal
        isOpen={showModal}
        onClose={closeModal}
        habit={editingHabit}
        onSave={editingHabit ? handleUpdateHabit : handleCreateHabit}
      />
    </div>
  );
};

export default HabitTracker;
