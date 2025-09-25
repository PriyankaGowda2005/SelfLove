import React, { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import JournalCard from '../components/JournalCard'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'
import toast from 'react-hot-toast'

const Journal = () => {
  const [journals, setJournals] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [mood, setMood] = useState('all')

  useEffect(() => {
    fetchJournals()
  }, [search, mood])

  const fetchJournals = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (mood !== 'all') params.append('mood', mood)
      const res = await api.get(`/journals?${params.toString()}`)
      if (res.data.success) setJournals(res.data.data)
    } catch (e) {
      toast.error('Failed to fetch journals')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Journal</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Write and reflect every day</p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input className="input pl-9" placeholder="Search journals..." value={search} onChange={e => setSearch(e.target.value)} />
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          </div>
          <select className="input" value={mood} onChange={e => setMood(e.target.value)}>
            <option value="all">All moods</option>
            <option value="very_happy">Very Happy</option>
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
            <option value="very_sad">Very Sad</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your journal..." />
      ) : journals.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">No entries yet</div>
      ) : (
        <div className="space-y-4">
          {journals.map(j => (
            <JournalCard key={j._id} journal={j} onEdit={() => {}} onDelete={() => {}} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Journal


