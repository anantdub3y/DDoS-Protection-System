import useClickTracker from '../hooks/useClickTracker'
import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Calendar, BookOpen, Megaphone, CreditCard, Award, Clock, AlertTriangle } from 'lucide-react'
import { student, subjects, announcements, fees } from '../data/mockData'

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <div className={`bg-white rounded-2xl p-6 border border-slate-100 card-hover animate-fadeInUp`}
    style={{ animationDelay: `${delay}ms` }}>
    <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-4`}>
      <Icon size={20} className="text-white" />
    </div>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
)

export default function Dashboard() {
  useClickTracker("Dashboard")
  const pendingAmount = fees.pending.reduce((a, f) => a + f.amount, 0)
  const lowAttendance = subjects.filter(s => s.attendance < 80)
  const overallAttendance = Math.round(subjects.reduce((a, s) => a + s.attendance, 0) / subjects.length)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8 animate-fadeInUp">
        <h1 className="font-display text-3xl font-bold text-slate-800">
          Welcome back, {student.name.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">{student.branch} · {student.semester} · {student.college}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="CGPA" value={student.cgpa} sub="Current CGPA" color="bg-primary-600" delay={0} />
        <StatCard icon={Calendar} label="Attendance" value={`${overallAttendance}%`} sub="Overall this semester" color="bg-emerald-500" delay={80} />
        <StatCard icon={BookOpen} label="Subjects" value={subjects.length} sub="This semester" color="bg-violet-500" delay={160} />
        <StatCard icon={CreditCard} label="Fee Due" value={`₹${(pendingAmount/1000).toFixed(0)}K`} sub="2 pending payments" color="bg-amber-500" delay={240} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Subject Attendance */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 card-hover animate-fadeInUp" style={{animationDelay:'100ms'}}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800">Subject Attendance</h2>
            <Link to="/timetable" className="text-xs text-primary-600 hover:underline">View Timetable →</Link>
          </div>
          <div className="space-y-3">
            {subjects.map(s => (
              <div key={s.code}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">{s.name}</span>
                  <span className={`font-semibold ${s.attendance < 75 ? 'text-red-500' : s.attendance < 80 ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {s.attendance}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${s.attendance < 75 ? 'bg-red-400' : s.attendance < 80 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                    style={{ width: `${s.attendance}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          
          {/* Student Info card */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white animate-fadeInUp" style={{animationDelay:'200ms'}}>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold mb-3">
              {student.avatar}
            </div>
            <p className="font-bold text-lg leading-tight">{student.name}</p>
            <p className="text-primary-200 text-sm">{student.rollNo}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-primary-200 text-xs">Year</p>
                <p className="text-white font-semibold text-sm">{student.year}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-primary-200 text-xs">Section</p>
                <p className="text-white font-semibold text-sm">Section {student.section}</p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {lowAttendance.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 animate-fadeInUp" style={{animationDelay:'300ms'}}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-600" />
                <p className="font-semibold text-amber-700 text-sm">Attendance Alert</p>
              </div>
              {lowAttendance.map(s => (
                <div key={s.code} className="flex justify-between text-xs py-1 border-b border-amber-100 last:border-0">
                  <span className="text-amber-700">{s.name.split(' ').slice(0,2).join(' ')}</span>
                  <span className="font-bold text-amber-700">{s.attendance}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Latest Announcement */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 card-hover animate-fadeInUp" style={{animationDelay:'350ms'}}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-slate-800 text-sm">Latest Notice</p>
              <Link to="/announcements" className="text-xs text-primary-600 hover:underline">All →</Link>
            </div>
            {announcements.slice(0,2).map(a => (
              <div key={a.id} className="mb-3 last:mb-0">
                <div className="flex items-start gap-2">
                  {a.urgent && <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                  <p className="text-sm text-slate-700 font-medium leading-snug">{a.title}</p>
                </div>
                <p className="text-xs text-slate-400 mt-1 ml-3.5">{a.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
