// frontend/src/components/Footer.js
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span>for personal growth</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;