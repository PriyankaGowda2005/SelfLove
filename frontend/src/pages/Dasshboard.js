import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Target, 
  CheckSquare, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Star,
  Heart,
  Zap,
  Clock,
  BarChart3,
  Users,
  Plus,
  Flame,
  Trophy
} from 'lucide-react'

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false)

  // Mock data for demonstration
  const mockData = {
    user: {
      name: "Alex Johnson",
      points: 1250,
      level: "Self-Love Champion",
      streak: 12
    },
    habits: [
      { id: 1, title: "Morning Meditation", icon: "🧘‍♀️", streak: 7, completed: true, color: "bg-purple-500" },
      { id: 2, title: "Daily Exercise", icon: "💪", streak: 5, completed: true, color: "bg-green-500" },
      { id: 3, title: "Read 30 mins", icon: "📚", streak: 3, completed: false, color: "bg-blue-500" },
      { id: 4, title: "Drink Water", icon: "💧", streak: 15, completed: true, color: "bg-cyan-500" }
    ],
    tasks: [
      { id: 1, title: "Complete project proposal", priority: "high", completed: false, dueDate: "Today" },
      { id: 2, title: "Call mom", priority: "medium", completed: true, dueDate: "Yesterday" },
      { id: 3, title: "Buy groceries", priority: "low", completed: false, dueDate: "Tomorrow" }
    ],
    recentJournals: [
      { id: 1, title: "Amazing day!", mood: "😊", date: "Today", preview: "Had a wonderful time with friends..." },
      { id: 2, title: "Feeling grateful", mood: "🙏", date: "Yesterday", preview: "Reflecting on all the good things..." }
    ],
    stats: {
      habitsCompleted: 3,
      totalHabits: 4,
      tasksCompleted: 1,
      totalTasks: 3,
      weeklyProgress: 85,
      monthlyGoal: 90
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-indigo-500/10"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">{mockData.user.name}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Your journey to self-improvement continues today
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{mockData.user.points}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{mockData.user.streak} days</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Habits Done</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{mockData.stats.habitsCompleted}/{mockData.stats.totalHabits}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{mockData.user.level}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Habits Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  <Target className="w-6 h-6 mr-2 text-purple-500" />
                  Today's Habits
                </h2>
                <Link to="/habits" className="text-purple-500 hover:text-purple-600 font-medium">
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockData.habits.map((habit) => (
                  <div key={habit.id} className={`${habit.color} rounded-xl p-4 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{habit.icon}</span>
                        {habit.completed && <CheckSquare className="w-5 h-5" />}
                      </div>
                      <h3 className="font-semibold mb-1">{habit.title}</h3>
                      <p className="text-sm opacity-90">{habit.streak} day streak</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  <CheckSquare className="w-6 h-6 mr-2 text-green-500" />
                  Today's Tasks
                </h2>
                <Link to="/tasks" className="text-green-500 hover:text-green-600 font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                {mockData.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{task.dueDate}</span>
                      {task.completed && <CheckSquare className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Recent Journals */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Journals
                </h2>
                <Link to="/journal" className="text-blue-500 hover:text-blue-600 font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {mockData.recentJournals.map((journal) => (
                  <div key={journal.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{journal.title}</h3>
                      <span className="text-2xl">{journal.mood}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{journal.preview}</p>
                    <p className="text-xs text-gray-500">{journal.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center mb-6">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                Weekly Progress
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Habits</span>
                    <span className="text-gray-800 dark:text-white font-medium">{mockData.stats.weeklyProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: `${mockData.stats.weeklyProgress}%`}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Goal</span>
                    <span className="text-gray-800 dark:text-white font-medium">{mockData.stats.monthlyGoal}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: `${mockData.stats.monthlyGoal}%`}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link to="/habits" className="flex items-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all">
                  <Target className="w-5 h-5 mr-3" />
                  Add New Habit
                </Link>
                
                <Link to="/tasks" className="flex items-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all">
                  <CheckSquare className="w-5 h-5 mr-3" />
                  Add New Task
                </Link>
                
                <Link to="/journal" className="flex items-center p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Write Journal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard