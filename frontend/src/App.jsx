import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dasshboard'
import HabitTracker from './pages/HabitTracker'
import TaskList from './pages/TaskList'
import Journal from './pages/Journal'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

// App Routes Component - No Authentication Required
const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <main className="relative">
        <Routes>
          {/* All Routes Accessible */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">❤️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">SelfLove Tracker</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your journey to personal growth and self-improvement starts here.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Built with React</span>
            <span>•</span>
            <span>Styled with Tailwind</span>
            <span>•</span>
            <span>Powered by Node.js</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            &copy; 2024 SelfLove Tracker. Made with ❤️ for personal growth.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  )
}


