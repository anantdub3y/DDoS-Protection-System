import useClickTracker from '../hooks/useClickTracker'
import React from 'react'
import { timetable, timeSlots, subjects } from '../data/mockData'

const subjectColors = {
  'DSA': 'bg-blue-100 text-blue-700 border-blue-200',
  'OS': 'bg-purple-100 text-purple-700 border-purple-200',
  'DBMS': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Networks': 'bg-orange-100 text-orange-700 border-orange-200',
  'ToC': 'bg-rose-100 text-rose-700 border-rose-200',
  'Stats': 'bg-amber-100 text-amber-700 border-amber-200',
  '—': 'bg-slate-50 text-slate-300 border-slate-100',
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const today = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()]

export default function Timetable() {
  useClickTracker("Timetable")
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="font-display text-3xl font-bold text-slate-800">Timetable</h1>
        <p className="text-slate-500 mt-1">4th Semester · Section B · A.Y. 2025-26</p>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-fadeInUp shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">Day</th>
                {timeSlots.map(t => (
                  <th key={t} className="px-3 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t} AM{parseInt(t)>=2?' PM':''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, i) => (
                <tr key={day} className={`border-b border-slate-50 last:border-0 ${day === today ? 'bg-primary-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${day === today ? 'text-primary-700' : 'text-slate-700'}`}>{day}</p>
                      {day === today && <span className="text-xs bg-primary-600 text-white px-1.5 py-0.5 rounded-full">Today</span>}
                    </div>
                  </td>
                  {timetable[day].map((subj, j) => (
                    <td key={j} className="px-2 py-3 text-center">
                      {subj !== '—' ? (
                        <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${subjectColors[subj] || 'bg-slate-100 text-slate-600'}`}>
                          {subj}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 animate-fadeInUp">
        <p className="text-sm font-semibold text-slate-600 mb-3">Subject Reference</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {subjects.map(s => (
            <div key={s.code} className="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
              <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${subjectColors[s.name.split(' ').map(w=>w[0]).filter((_,i)=>i<3).join('') ] || 'bg-slate-100'}`}>
                {s.code}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{s.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.faculty} · {s.credits} Credits</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
