import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, BookOpen, Megaphone,
  CreditCard, LogOut, Menu, X, GraduationCap, Bell, User
} from 'lucide-react'
import { student } from '../data/mockData'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timetable', icon: Calendar, label: 'Timetable' },
  { to: '/results', icon: BookOpen, label: 'Results' },
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/fees', icon: CreditCard, label: 'Fee Status' },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('edunexus_auth')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-tight">EduNexus</p>
              <p className="text-xs text-slate-400">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-sm">
              {student.avatar}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-slate-700 text-sm truncate">{student.name}</p>
              <p className="text-xs text-slate-400">{student.rollNo}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`
              }>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <p className="text-slate-400 text-sm">{student.semester} • {student.branch}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-slate-100 relative">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
              {student.avatar}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  )
}
