import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import ReviewCreatePage from './components/ReviewCreatePage'
import ReviewViewPage from './components/ReviewViewPage'

import RecapPage from './components/RecapPage'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
          <Route path="/recap" element={user ? <Navigate to="/recap/2025" /> : <Navigate to="/login" />} />
          <Route path="/recap/:year" element={user ? <RecapPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/review/write/:eventId" element={user ? <ReviewCreatePage /> : <Navigate to="/login" />} />
          <Route path="/review/view/:eventId" element={user ? <ReviewViewPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
