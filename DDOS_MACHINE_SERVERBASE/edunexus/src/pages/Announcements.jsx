import useClickTracker from '../hooks/useClickTracker'
import React, { useState } from 'react'
import { announcements } from '../data/mockData'
import { Megaphone, AlertCircle, Calendar, Tag } from 'lucide-react'

const categoryColor = {
  'Exam': 'bg-red-100 text-red-600',
  'Event': 'bg-blue-100 text-blue-600',
  'Admin': 'bg-amber-100 text-amber-600',
  'Academic': 'bg-emerald-100 text-emerald-600',
}

const categories = ['All', 'Exam', 'Event', 'Admin', 'Academic']

export default function Announcements() {
  useClickTracker("Announcements")
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filtered = filter === 'All' ? announcements : announcements.filter(a => a.category === filter)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="font-display text-3xl font-bold text-slate-800">Announcements</h1>
        <p className="text-slate-500 mt-1">Official notices and updates from the institution</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6 animate-fadeInUp">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === c ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        {filtered.map((a, i) => (
          <div key={a.id}
            className={`bg-white rounded-2xl border ${a.urgent ? 'border-red-200' : 'border-slate-100'} overflow-hidden card-hover animate-fadeInUp cursor-pointer`}
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-xl ${a.urgent ? 'bg-red-100' : 'bg-slate-100'}`}>
                    {a.urgent ? <AlertCircle size={18} className="text-red-500" /> : <Megaphone size={18} className="text-slate-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {a.urgent && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">URGENT</span>
                      )}
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${categoryColor[a.category]}`}>{a.category}</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug">{a.title}</h3>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Calendar size={12} className="text-slate-400" />
                      <p className="text-xs text-slate-400">{a.date}</p>
                    </div>
                  </div>
                </div>
                <span className="text-slate-400 text-lg">{expanded === a.id ? '▲' : '▼'}</span>
              </div>

              {expanded === a.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-fadeIn">
                  <p className="text-sm text-slate-600 leading-relaxed">{a.body}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
