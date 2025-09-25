// frontend/src/components/GamificationBadges.js
import React from 'react';
import { Trophy, Award, Star, Target, Zap, Calendar } from 'lucide-react';

const BadgeIcon = ({ badgeName }) => {
  const iconMap = {
    'First Steps': Target,
    '1 Week Warrior': Zap,
    '1 Month Master': Calendar,
    '100 Day Hero': Trophy,
    'Task Master': Award,
    'Journal Writer': Star,
    '1K Collector': Trophy,
    '5K Collector': Trophy
  };
  
  const IconComponent = iconMap[badgeName] || Trophy;
  return <IconComponent className="w-6 h-6" />;
};

export const BadgeDisplay = ({ badge, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
      {badge.icon || <BadgeIcon badgeName={badge.name} />}
    </div>
  );
};

export const BadgesList = ({ badges, title = "Your Badges" }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No badges earned yet</p>
        <p className="text-sm">Complete habits and tasks to earn badges!</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="text-center">
            <BadgeDisplay badge={badge} size="lg" />
            <h4 className="font-medium mt-2 text-sm">{badge.name}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {badge.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecentBadges = ({ badges }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Recent:
      </span>
      {badges.slice(0, 3).map((badge, index) => (
        <div key={index} className="flex items-center space-x-2">
          <BadgeDisplay badge={badge} size="sm" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {badge.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default { BadgeDisplay, BadgesList, RecentBadges };