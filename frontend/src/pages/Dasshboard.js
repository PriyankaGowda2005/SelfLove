// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Target, CheckSquare, BookOpen, TrendingUp, Calendar, Flame, Trophy, Plus } from 'lucide-react';
import { HabitCompletionChart, WeeklyProgressChart } from '../components/AnalyticsCharts';
import { BadgesList, RecentBadges } from '../components/GamificationBadges';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to your dashboard!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start by creating some habits, tasks, or journal entries to see your progress here.
          </p>
        </div>
      </div>
    );
  }

  const { overview, today, streaks, weekly, recentBadges } = dashboardData;

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => {
    const colorClasses = {
      primary: 'bg-primary-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    return (
      <div className="card">
        <div className="flex items-center">
          <div className={`${colorClasses[color]} p-3 rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your progress overview
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">{user?.points || 0} points</span>
          </div>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Target}
          title="Today's Habits"
          value={`${today.habitsCompleted}/${today.totalHabits}`}
          subtitle={`${today.habitCompletionRate}% completion`}
          color="primary"
        />
        <StatCard
          icon={CheckSquare}
          title="Tasks Completed"
          value={today.tasksCompleted}
          subtitle="Today"
          color="success"
        />
        <StatCard
          icon={Flame}
          title="Active Streaks"
          value={streaks.activeStreaks}
          subtitle={`${streaks.totalActiveStreakDays} total days`}
          color="warning"
        />
        <StatCard
          icon={Calendar}
          title="Longest Streak"
          value={streaks.longestStreak}
          subtitle="Days"
          color="info"
        />
      </div>

      {/* Weekly Progress & Recent Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              This Week's Progress
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">{weekly.habitsCompleted}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Habits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{weekly.tasksCompleted}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{weekly.journalEntries}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Journal Entries</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Achievements
          </h3>
          {recentBadges && recentBadges.length > 0 ? (
            <RecentBadges badges={recentBadges} />
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Complete more activities to earn badges!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Target}
          title="Total Habits"
          value={overview.totalHabits}
          subtitle="Created"
        />
        <StatCard
          icon={CheckSquare}
          title="Total Tasks"
          value={overview.totalTasks}
          subtitle="Created"
        />
        <StatCard
          icon={BookOpen}
          title="Journal Entries"
          value={overview.totalJournals}
          subtitle="Written"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/habits"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-primary-500" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">Add Habit</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Track daily activities</div>
            </div>
          </a>
          
          <a
            href="/tasks"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-green-500" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">Add Task</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Create to-do items</div>
            </div>
          </a>
          
          <a
            href="/journal"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors group"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-yellow-500" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">Write Entry</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Record your thoughts</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;