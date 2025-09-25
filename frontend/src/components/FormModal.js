// frontend/src/components/FormModal.js
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import MoodTracker from './MoodTracker';
import toast from 'react-hot-toast';

export const HabitFormModal = ({ isOpen, onClose, habit, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#3B82F6',
    icon: '🎯',
    frequency: 'daily'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit) {
      setFormData({
        title: habit.title || '',
        description: habit.description || '',
        color: habit.color || '#3B82F6',
        icon: habit.icon || '🎯',
        frequency: habit.frequency || 'daily'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        color: '#3B82F6',
        icon: '🎯',
        frequency: 'daily'
      });
    }
  }, [habit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a habit title');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Error handled in parent component
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', 
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
    '#EC4899', '#F43F5E'
  ];

  const icons = ['🎯', '💪', '📚', '🏃‍♂️', '🧘‍♀️', '💧', '🍎', '😴', '✍️', '🎵'];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={habit ? 'Edit Habit' : 'Create New Habit'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
            placeholder="e.g., Morning Exercise"
            required
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input resize-none"
            rows="3"
            placeholder="Optional description..."
          />
        </div>

        <div>
          <label className="label">Icon</label>
          <div className="flex flex-wrap gap-2">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                  formData.icon === icon 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  formData.color === color ? 'border-gray-800 dark:border-gray-200 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="label">Frequency</label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            className="input"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : habit ? 'Update Habit' : 'Create Habit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const TaskFormModal = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'general',
    tags: [],
    points: 10
  });

  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority || 'medium',
        category: task.category || 'general',
        tags: task.tags || [],
        points: task.points || 10
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: 'general',
        tags: [],
        points: 10
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        ...formData,
        dueDate: formData.dueDate || null
      });
      onClose();
    } catch (error) {
      // Error handled in parent component
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={task ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
            placeholder="e.g., Complete project proposal"
            required
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input resize-none"
            rows="3"
            placeholder="Optional description..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
              placeholder="e.g., work, personal, health"
            />
          </div>

          <div>
            <label className="label">Points</label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
              className="input"
              min="1"
              max="100"
            />
          </div>
        </div>

        <div>
          <label className="label">Tags</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="input flex-1"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const JournalFormModal = ({ isOpen, onClose, journal, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    moodScore: 3,
    tags: [],
    weather: '',
    location: '',
    isPrivate: true
  });

  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (journal) {
      setFormData({
        title: journal.title || '',
        content: journal.content || '',
        mood: journal.mood || 'neutral',
        moodScore: journal.moodScore || 3,
        tags: journal.tags || [],
        weather: journal.weather || '',
        location: journal.location || '',
        isPrivate: journal.isPrivate !== false
      });
    } else {
      setFormData({
        title: '',
        content: '',
        mood: 'neutral',
        moodScore: 3,
        tags: [],
        weather: '',
        location: '',
        isPrivate: true
      });
    }
  }, [journal, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Error handled in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleMoodChange = (mood, score) => {
    setFormData({ ...formData, mood, moodScore: score });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={journal ? 'Edit Journal Entry' : 'New Journal Entry'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
            placeholder="e.g., Great day at work"
            required
          />
        </div>

        <div>
          <label className="label">Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="input resize-none"
            rows="8"
            placeholder="Write about your day, thoughts, feelings..."
            required
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.content.length}/10000
          </div>
        </div>

        <div>
          <label className="label">How are you feeling?</label>
          <MoodTracker 
            mood={formData.mood} 
            onMoodChange={handleMoodChange}
            size="lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Weather</label>
            <input
              type="text"
              value={formData.weather}
              onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
              className="input"
              placeholder="e.g., sunny, rainy, cloudy"
            />
          </div>

          <div>
            <label className="label">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input"
              placeholder="e.g., home, office, park"
            />
          </div>
        </div>

        <div>
          <label className="label">Tags</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="input flex-1"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPrivate"
            checked={formData.isPrivate}
            onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label htmlFor="isPrivate" className="text-sm text-gray-700 dark:text-gray-300">
            Keep this entry private
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : journal ? 'Update Entry' : 'Create Entry'}
          </button>
        </div>
      </form>
    </Modal>
  );
};