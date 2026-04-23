import useClickTracker from '../hooks/useClickTracker'
import React from 'react'
import { fees } from '../data/mockData'
import { CheckCircle, Clock, CreditCard, Download } from 'lucide-react'

export default function Fees() {
  useClickTracker("Fees")
  const totalPaid = fees.paid.reduce((a, f) => a + f.amount, 0)
  const totalPending = fees.pending.reduce((a, f) => a + f.amount, 0)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="font-display text-3xl font-bold text-slate-800">Fee Status</h1>
        <p className="text-slate-500 mt-1">Payment history and pending dues · A.Y. 2025-26</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 card-hover animate-fadeInUp">
          <CreditCard size={20} className="text-slate-400 mb-3" />
          <p className="text-2xl font-bold text-slate-800">₹{totalPaid.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Total Paid</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 card-hover animate-fadeInUp" style={{animationDelay:'80ms'}}>
          <Clock size={20} className="text-amber-500 mb-3" />
          <p className="text-2xl font-bold text-amber-700">₹{totalPending.toLocaleString()}</p>
          <p className="text-sm text-amber-600 mt-1">Pending Amount</p>
        </div>
        <div className="bg-primary-600 rounded-2xl p-6 card-hover animate-fadeInUp" style={{animationDelay:'160ms'}}>
          <CheckCircle size={20} className="text-primary-200 mb-3" />
          <p className="text-2xl font-bold text-white">{fees.paid.length}</p>
          <p className="text-sm text-primary-200 mt-1">Payments Made</p>
        </div>
      </div>

      {/* Pending Dues */}
      {fees.pending.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden mb-6 animate-fadeInUp shadow-sm">
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
            <p className="font-semibold text-amber-700">⚠️ Pending Dues</p>
          </div>
          <div className="divide-y divide-slate-100">
            {fees.pending.map((f, i) => (
              <div key={i} className="px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">{f.description}</p>
                  <p className="text-sm text-slate-400 mt-0.5">Due by {f.dueDate}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-amber-600 text-lg">₹{f.amount.toLocaleString()}</p>
                  <button className="bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors">
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-fadeInUp shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="font-semibold text-slate-800">Payment History</p>
        </div>
        <div className="divide-y divide-slate-50">
          {fees.paid.map((f, i) => (
            <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-700 text-sm">{f.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Paid on {f.date} · Receipt: {f.receipt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-emerald-600">₹{f.amount.toLocaleString()}</p>
                <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
