import useClickTracker from '../hooks/useClickTracker'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Login() {
  useClickTracker("Login")
  const [rollNo, setRollNo] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 900))
    if (rollNo === '2200123CS' && password === 'edunexus123') {
      localStorage.setItem('edunexus_auth', 'true')
      navigate('/dashboard')
    } else {
      setError('Invalid Roll Number or Password. Try: 2200123CS / edunexus123')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-400 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fadeInUp">
        
        {/* Header Card */}
        <div className="bg-primary-600 rounded-2xl p-8 text-white mb-0 shadow-xl shadow-primary-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap size={26} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">EduNexus</h1>
              <p className="text-primary-200 text-sm">Institute of Technology</p>
            </div>
          </div>
          <p className="text-primary-100 text-sm">Student Academic Portal · Session 2025-26</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl -mt-4 relative">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Student Login</h2>
          <p className="text-slate-400 text-sm mb-6">Use your Roll Number and Portal Password</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>Invalid Roll Number or Password. Please try again.</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={e => setRollNo(e.target.value.toUpperCase())}
                placeholder="e.g. 2200123CS"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <button type="button" className="text-primary-600 hover:underline">Forgot Password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary-100 disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
              ) : 'Login to Portal'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            For technical support, contact <span className="text-primary-600">helpdesk@edunexus.ac.in</span>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          <a href="/" className="text-primary-500 hover:underline">← Back to College Website</a>
          &nbsp;·&nbsp; © 2026 EduNexus Institute of Technology
        </p>
      </div>
    </div>
  )
}
