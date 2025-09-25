
// frontend/src/pages/TaskList.js
import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Calendar, CheckSquare } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { TaskFormModal } from '../components/FormModal';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    completed: 'all',
    category: 'all',
    search: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.completed !== 'all') params.append('completed', filters.completed);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/tasks?${params}`);
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/tasks/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      // Categories are not critical, fail silently
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      if (response.data.success) {
        toast.success('Task created successfully!');
        fetchTasks();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await api.put(`/tasks/${editingTask._id}`, taskData);
      if (response.data.success) {
        toast.success('Task updated successfully!');
        fetchTasks();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await api.delete(`/tasks/${task._id}`);
        toast.success('Task deleted successfully!');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  if (loading) {
    return <LoadingSpinner text="Loading your tasks..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Plan your day and get things done</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <input
              className="input pl-9"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          </div>
          <select className="input" value={filters.completed} onChange={e => setFilters(prev => ({ ...prev, completed: e.target.value }))}>
            <option value="all">All</option>
            <option value="true">Completed</option>
            <option value="false">Pending</option>
          </select>
          <select className="input" value={filters.category} onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}>
            <option value="all">All categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">No tasks found</div>
      ) : (
        <div className="space-y-3">
          {tasks.map(t => (
            <TaskCard key={t._id} task={t} onUpdate={fetchTasks} onDelete={handleDeleteTask} />
          ))}
        </div>
      )}

      {showModal && (
        <TaskFormModal
          isOpen={showModal}
          onClose={closeModal}
          task={editingTask}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
        />
      )}
    </div>
  );
};

export default TaskList;