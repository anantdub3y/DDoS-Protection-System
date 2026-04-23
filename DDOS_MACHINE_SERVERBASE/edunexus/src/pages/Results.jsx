import useClickTracker from '../hooks/useClickTracker'
import React, { useState } from 'react'
import { results, student } from '../data/mockData'
import { Award, TrendingUp } from 'lucide-react'

const gradeColor = {
  'A+': 'bg-emerald-100 text-emerald-700',
  'A': 'bg-blue-100 text-blue-700',
  'B+': 'bg-violet-100 text-violet-700',
  'B': 'bg-amber-100 text-amber-700',
  'C': 'bg-orange-100 text-orange-700',
}

export default function Results() {
  useClickTracker("Results")
  const [selected, setSelected] = useState(0)
  const current = results[selected]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="font-display text-3xl font-bold text-slate-800">Academic Results</h1>
        <p className="text-slate-500 mt-1">CGPA: {student.cgpa} · {student.branch}</p>
      </div>

      {/* CGPA Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 mb-8 flex items-center justify-between text-white animate-fadeInUp">
        <div>
          <p className="text-primary-200 text-sm">Cumulative Grade Point Average</p>
          <p className="font-display text-5xl font-bold mt-1">{student.cgpa}</p>
          <p className="text-primary-200 text-sm mt-1">Based on {results.length} completed semesters</p>
        </div>
        <div className="flex flex-col gap-2">
          {results.map(r => (
            <div key={r.semester} className="flex items-center gap-3">
              <p className="text-primary-200 text-xs w-24">{r.semester}</p>
              <div className="h-2 w-32 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{width:`${(r.sgpa/10)*100}%`}} />
              </div>
              <p className="text-white font-bold text-sm">{r.sgpa}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Semester Tabs */}
      <div className="flex gap-2 mb-6 animate-fadeInUp">
        {results.map((r, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selected === i ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'}`}>
            {r.semester}
          </button>
        ))}
      </div>

      {/* Result Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-fadeInUp shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">{current.semester}</p>
            <p className="text-sm text-slate-400">{current.subjects.length} subjects</p>
          </div>
          <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl">
            <Award size={16} className="text-primary-600" />
            <span className="font-bold text-primary-700">SGPA {current.sgpa}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {['Code', 'Subject', 'Internal (30)', 'External (70)', 'Total (100)', 'Grade'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {current.subjects.map((s, i) => (
                <tr key={s.code} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono text-slate-500">{s.code}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">{s.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{s.internal}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{s.external}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">{s.total}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${gradeColor[s.grade] || 'bg-slate-100'}`}>
                      {s.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Total: <span className="font-bold text-slate-700">
              {current.subjects.reduce((a,s) => a+s.total, 0)}
            </span> / {current.subjects.length * 100} · 
            Percentage: <span className="font-bold text-slate-700">
              {((current.subjects.reduce((a,s)=>a+s.total,0))/(current.subjects.length*100)*100).toFixed(1)}%
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
