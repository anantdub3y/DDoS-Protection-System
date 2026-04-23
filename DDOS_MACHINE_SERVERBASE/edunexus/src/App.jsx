import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Timetable from './pages/Timetable'
import Results from './pages/Results'
import Announcements from './pages/Announcements'
import Fees from './pages/Fees'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const auth = localStorage.getItem('edunexus_auth')
  return auth ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/timetable" element={<PrivateRoute><Layout><Timetable /></Layout></PrivateRoute>} />
        <Route path="/results" element={<PrivateRoute><Layout><Results /></Layout></PrivateRoute>} />
        <Route path="/announcements" element={<PrivateRoute><Layout><Announcements /></Layout></PrivateRoute>} />
        <Route path="/fees" element={<PrivateRoute><Layout><Fees /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
