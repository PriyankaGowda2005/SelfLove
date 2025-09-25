import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && !user) {
      api.get('/auth/me')
        .then(res => {
          if (res.data.success) setUser(res.data.user)
        })
        .catch(() => logout())
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res.data.success) {
        localStorage.setItem('token', res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { username, email, password })
      if (res.data.success) {
        localStorage.setItem('token', res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
      }
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (prefs) => {
    const res = await api.put('/auth/preferences', prefs)
    if (res.data.success) setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  const awardPoints = (points, newBadges = []) => {
    if (!points && (!newBadges || newBadges.length === 0)) return
    setUser(prev => {
      if (!prev) return prev
      return {
        ...prev,
        points: (prev.points || 0) + (points || 0),
        badges: newBadges && newBadges.length > 0 ? [...(prev.badges || []), ...newBadges] : prev.badges
      }
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updatePreferences, awardPoints }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


