// backend/utils/points.js
const User = require('../models/User');

const POINT_VALUES = {
  habit_complete: 20,
  task_complete: 10,
  journal_entry: 15,
  streak_bonus: 5
};

const BADGES = {
  first_habit: { name: 'First Steps', description: 'Complete your first habit', icon: '👟' },
  habit_streak_7: { name: '1 Week Warrior', description: '7 day habit streak', icon: '🔥' },
  habit_streak_30: { name: '1 Month Master', description: '30 day habit streak', icon: '💪' },
  habit_streak_100: { name: '100 Day Hero', description: '100 day habit streak', icon: '🏆' },
  task_master: { name: 'Task Master', description: 'Complete 50 tasks', icon: '✅' },
  journal_writer: { name: 'Journal Writer', description: 'Write 30 journal entries', icon: '📝' },
  point_collector_1000: { name: '1K Collector', description: 'Earn 1000 points', icon: '💎' },
  point_collector_5000: { name: '5K Collector', description: 'Earn 5000 points', icon: '🌟' }
};

const awardPoints = async (user, action, customPoints = null) => {
  try {
    const points = customPoints || POINT_VALUES[action] || 0;
    user.points += points;
    await user.save();
    return points;
  } catch (error) {
    console.error('Award points error:', error);
    return 0;
  }
};

const checkBadges = async (user, type, value) => {
  try {
    const newBadges = [];
    
    switch (type) {
      case 'habit_streak':
        if (value === 1 && !user.badges.find(b => b.name === 'First Steps')) {
          newBadges.push(BADGES.first_habit);
        }
        if (value === 7 && !user.badges.find(b => b.name === '1 Week Warrior')) {
          newBadges.push(BADGES.habit_streak_7);
        }
        if (value === 30 && !user.badges.find(b => b.name === '1 Month Master')) {
          newBadges.push(BADGES.habit_streak_30);
        }
        if (value === 100 && !user.badges.find(b => b.name === '100 Day Hero')) {
          newBadges.push(BADGES.habit_streak_100);
        }
        break;
        
      case 'task_count':
        if (value === 50 && !user.badges.find(b => b.name === 'Task Master')) {
          newBadges.push(BADGES.task_master);
        }
        break;
        
      case 'journal_count':
        if (value === 30 && !user.badges.find(b => b.name === 'Journal Writer')) {
          newBadges.push(BADGES.journal_writer);
        }
        break;
        
      case 'points':
        if (user.points >= 1000 && !user.badges.find(b => b.name === '1K Collector')) {
          newBadges.push(BADGES.point_collector_1000);
        }
        if (user.points >= 5000 && !user.badges.find(b => b.name === '5K Collector')) {
          newBadges.push(BADGES.point_collector_5000);
        }
        break;
    }

    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
      await user.save();
      return newBadges;
    }
    
    return [];
  } catch (error) {
    console.error('Check badges error:', error);
    return [];
  }
};

module.exports = {
  awardPoints,
  checkBadges,
  POINT_VALUES,
  BADGES
};