import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useClickTracker from '../hooks/useClickTracker'
import {
  GraduationCap, Menu, X, ArrowRight, BookOpen,
  FlaskConical, Cpu, Building2, Phone, Mail, MapPin,
  Globe, CreditCard, FileText, ClipboardList, Calendar,
  Download, Search, Bell, ChevronRight, Library,
  Bus, Stethoscope, Trophy, Briefcase
} from 'lucide-react'

const departments = [
  { name: "Computer Science & Engineering", code: "CSE", students: 480, icon: Cpu, color: "border-blue-100 bg-blue-50" },
  { name: "Electronics & Communication", code: "ECE", students: 360, icon: Globe, color: "border-purple-100 bg-purple-50" },
  { name: "Mechanical Engineering", code: "ME", students: 400, icon: Building2, color: "border-orange-100 bg-orange-50" },
  { name: "Information Technology", code: "IT", students: 360, icon: BookOpen, color: "border-emerald-100 bg-emerald-50" },
  { name: "Civil Engineering", code: "CE", students: 320, icon: Building2, color: "border-amber-100 bg-amber-50" },
  { name: "Biotechnology", code: "BT", students: 240, icon: FlaskConical, color: "border-pink-100 bg-pink-50" },
]

const news = [
  { title: "EduNexus ranked in Top 50 Engineering Colleges — NIRF 2026", date: "28 Mar 2026", tag: "Achievement", tagColor: "bg-emerald-100 text-emerald-700" },
  { title: "HackNexus 2026 — Intra-college hackathon registrations now open", date: "22 Mar 2026", tag: "Event", tagColor: "bg-blue-100 text-blue-700" },
  { title: "Industrial Visit to ISRO Lucknow Campus on 5th April 2026", date: "20 Mar 2026", tag: "Event", tagColor: "bg-blue-100 text-blue-700" },
  { title: "Guest Lecture: AI in Healthcare by Dr. Ramesh Iyer, AIIMS Delhi", date: "18 Mar 2026", tag: "Academic", tagColor: "bg-violet-100 text-violet-700" },
  { title: "Mid-Semester Examination Schedule released for all programmes", date: "15 Mar 2026", tag: "Exam", tagColor: "bg-red-100 text-red-700" },
  { title: "New Research Lab inaugurated under DST-SERB grant of ₹2.4 Cr", date: "10 Mar 2026", tag: "Research", tagColor: "bg-amber-100 text-amber-700" },
]

const stats = [
  { value: "5,200+", label: "Students Enrolled" },
  { value: "320+", label: "Faculty Members" },
  { value: "94%", label: "Placement Rate" },
  { value: "150+", label: "Industry Partners" },
]

const services = [
  { icon: CreditCard, title: "Fee Payment", desc: "Pay tuition, hostel, exam and miscellaneous fees online via UPI, net banking or card.", color: "bg-blue-50 text-blue-600", badge: "High Traffic" },
  { icon: FileText, title: "Result / Marksheet", desc: "View semester results, download official marksheets and grade cards instantly.", color: "bg-violet-50 text-violet-600", badge: "High Traffic" },
  { icon: ClipboardList, title: "Admit Card", desc: "Download hall tickets for end-semester, mid-semester and back examinations.", color: "bg-emerald-50 text-emerald-600", badge: "High Traffic" },
  { icon: Calendar, title: "Attendance", desc: "Check subject-wise attendance percentage and view detailed monthly records.", color: "bg-amber-50 text-amber-600", badge: "High Traffic" },
  { icon: Search, title: "Exam Registration", desc: "Register for upcoming university examinations and track registration status.", color: "bg-cyan-50 text-cyan-600", badge: "High Traffic" },
  { icon: Trophy, title: "Scholarships", desc: "Apply for merit and need-based scholarships and track application status.", color: "bg-yellow-50 text-yellow-600", badge: "High Traffic" },
  { icon: Download, title: "Documents & Certificates", desc: "Request bonafide, transcripts, migration and character certificates.", color: "bg-rose-50 text-rose-600", badge: null },
  { icon: Bell, title: "Notifications", desc: "Stay updated with exam alerts, fee reminders and academic announcements.", color: "bg-indigo-50 text-indigo-600", badge: null },
  { icon: Library, title: "Library Portal", desc: "Search catalogue, renew books, check due dates and reserve resources.", color: "bg-teal-50 text-teal-600", badge: null },
  { icon: Bus, title: "Transport", desc: "View bus routes, timings and apply for transport facility for the semester.", color: "bg-orange-50 text-orange-600", badge: null },
  { icon: Stethoscope, title: "Medical / Infirmary", desc: "Book appointments at campus health centre and access medical records.", color: "bg-green-50 text-green-600", badge: null },
  { icon: Briefcase, title: "Placement Cell", desc: "View upcoming drives, submit resume and track placement applications.", color: "bg-slate-100 text-slate-700", badge: null },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  useClickTracker('Home')

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-tight text-sm">EduNexus</p>
              <p className="text-xs text-slate-400 leading-tight">Institute of Technology</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-primary-600 transition-colors">Services</a>
            <a href="#departments" className="hover:text-primary-600 transition-colors">Departments</a>
            <a href="#news" className="hover:text-primary-600 transition-colors">News</a>
            <a href="#contact" className="hover:text-primary-600 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
              Student Login <ArrowRight size={15} />
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {['#services', '#departments', '#news', '#contact'].map(href => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 capitalize">
                {href.replace('#', '')}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              AICTE Approved · NAAC Accredited · Est. 2004
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-5">
              EduNexus Institute<br />of Technology
            </h1>
            <p className="text-primary-100 text-lg leading-relaxed mb-8">
              Shaping engineers and innovators for a technology-driven world. Access all academic services, results, fees and more from one unified portal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/login"
                className="flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                Access Student Portal <ArrowRight size={16} />
              </Link>
              <a href="#services"
                className="flex items-center gap-2 border border-white/30 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
                View All Services
              </a>
            </div>
          </div>
        </div>
        <div className="relative bg-primary-800/60 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-bold text-white">{s.value}</p>
                <p className="text-primary-200 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-3">
          <span className="shrink-0 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">NOTICE</span>
          <p className="text-amber-800 text-sm">Mid-semester exam fee payment deadline: <strong>20th April 2026</strong>. Clear dues before deadline to avoid late charges.</p>
          <Link to="/login" className="shrink-0 ml-auto text-amber-700 font-semibold text-sm hover:underline flex items-center gap-1">
            Pay Now <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Services */}
      <section id="services" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Student Services</span>
            <h2 className="font-display text-3xl font-bold text-slate-800 mt-2">Everything in One Place</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">All academic, administrative and campus services through the EduNexus portal. Login required for personalized access.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <Link to="/login" key={i}
                className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                    <s.icon size={20} />
                  </div>
                  {s.badge && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">{s.badge}</span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1.5 group-hover:text-primary-600 transition-colors">{s.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-primary-600 text-xs font-semibold">
                  Access Service <ChevronRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Academic Programmes</span>
            <h2 className="font-display text-3xl font-bold text-slate-800 mt-2">Our Departments</h2>
            <p className="text-slate-500 mt-3">6 undergraduate engineering programmes with AICTE approval</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((d, i) => (
              <div key={i} className={`rounded-2xl border p-6 flex items-center gap-4 hover:shadow-sm transition-all ${d.color}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm text-slate-600">
                  <d.icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm leading-snug">{d.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{d.students} students · {d.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Latest Updates</span>
              <h2 className="font-display text-3xl font-bold text-slate-800 mt-2">News & Announcements</h2>
            </div>
            <Link to="/login" className="hidden md:flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((n, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${n.tagColor}`}>{n.tag}</span>
                  <span className="text-xs text-slate-400">{n.date}</span>
                </div>
                <p className="text-slate-700 font-medium text-sm leading-snug">{n.title}</p>
                <button className="mt-3 text-primary-600 text-xs font-semibold hover:underline flex items-center gap-1">
                  Read more <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to access your portal?</h2>
          <p className="text-primary-200 mb-8">Login with your roll number to view results, pay fees, download documents and more.</p>
          <Link to="/login"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
            Login to Student Portal <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <p className="font-bold text-white">EduNexus Institute of Technology</p>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">AICTE approved autonomous institution committed to excellence in technical education and research since 2004.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Quick Links</p>
              <div className="space-y-2 text-sm text-slate-400">
                {['Admissions', 'Academics', 'Research', 'Placements', 'Alumni', 'NIRF Data'].map(l => (
                  <div key={l} className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                    <ChevronRight size={12} /> {l}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Contact Us</p>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="shrink-0 mt-0.5 text-primary-400" />
                  <p>NH-27, Knowledge Park, Lucknow–Kanpur Highway, Uttar Pradesh — 226028</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-primary-400" />
                  <p>+91-522-2345678</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-primary-400" />
                  <p>info@edunexus.ac.in</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 EduNexus Institute of Technology. All rights reserved.</p>
            <p>Privacy Policy · Terms of Use · RTI · Grievance Portal</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
