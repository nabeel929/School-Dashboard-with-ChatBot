import React, { useState, useMemo } from 'react';
import {
   LayoutDashboard, Users, BookOpen, Bell, Briefcase,
   DollarSign, MessageSquare, Calendar, Settings, LogOut,
   Menu, X, ClipboardList, TrendingUp, GraduationCap
} from 'lucide-react';
import { REAL_STUDENTS, REAL_FACULTY, TRANSACTIONS, ASSIGNMENTS, MESSAGES, THEME } from './data';
import './App.css';

import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import FacultyView from './components/FacultyView';
import FinanceView from './components/FinanceView';
import AcademicsView from './components/AcademicsView';
import AttendanceView from './components/AttendanceView';
import MessagesView from './components/MessagesView';
import TimetableView from './components/TimetableView';
import SettingsView from './components/SettingsView';
import StudentPerformanceView from './components/StudentPerformanceView';
import TeacherPerformanceView from './components/TeacherPerformanceView';
import ChatBot from './components/ChatBot';

const NAV_ITEMS = [
   { id: 'Dashboard', icon: LayoutDashboard },
   { id: 'Students', icon: Users },
   { id: 'Student Performance', icon: TrendingUp },
   { id: 'Faculty', icon: Briefcase },
   { id: 'Teacher Performance', icon: GraduationCap },
   { id: 'Finance', icon: DollarSign },
   { id: 'Academics', icon: BookOpen },
   { id: 'Attendance', icon: ClipboardList },
   { id: 'Messages', icon: MessageSquare },
   { id: 'Timetable', icon: Calendar },
   { id: 'Settings', icon: Settings },
];

const App = () => {
   const [activeTab, setActiveTab] = useState('Dashboard');
   const [darkMode, setDarkMode] = useState(false);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   // Login form state
   const [loginEmail, setLoginEmail] = useState('');
   const [loginPassword, setLoginPassword] = useState('');
   const [loginError, setLoginError] = useState('');

   const stats = useMemo(() => ({
      total: REAL_STUDENTS.length,
      avg: Math.round(REAL_STUDENTS.reduce((a, s) => a + s.marks, 0) / REAL_STUDENTS.length)
   }), []);

   const filteredStudents = REAL_STUDENTS.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const handleLogin = (e) => {
      e.preventDefault();
      if (!loginEmail || !loginPassword) {
         setLoginError('Please fill in all fields');
         return;
      }
      setLoginError('');
      setIsLoggedIn(true);
   };

   // --- LOGIN SCREEN ---
   if (!isLoggedIn) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden relative">
            <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] top-[-100px] left-[-100px] animate-pulse"></div>
            <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] bottom-[-100px] right-[-100px] animate-pulse"></div>
            <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[40px] w-full max-w-md text-center shadow-2xl animate-fade-in-up">
               <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-lg transform -rotate-6 hover:rotate-0 transition-all duration-500">
                  <span className="text-4xl font-bold text-white">C</span>
               </div>
               <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">CMS Admin</h1>
               <p className="text-slate-400 mb-8">Country Model School Portal</p>

               <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div>
                     <label className="text-xs uppercase font-bold text-slate-400 mb-1.5 block">Email Address</label>
                     <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@cms.edu.pk" className="w-full p-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
                  </div>
                  <div>
                     <label className="text-xs uppercase font-bold text-slate-400 mb-1.5 block">Password</label>
                     <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full p-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
                  </div>
                  {loginError && <p className="text-rose-400 text-sm text-center font-bold">{loginError}</p>}
                  <button type="submit" className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:bg-blue-50 hover:scale-[1.02] transition-all shadow-xl mt-2">Secure Login</button>
               </form>

               <p className="mt-8 text-xs text-slate-500 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Secured by 256-bit Encryption
               </p>
            </div>
         </div>
      );
   }

   // --- MAIN LAYOUT ---
   const renderContent = () => {
      switch (activeTab) {
         case 'Dashboard': return <DashboardView darkMode={darkMode} stats={stats} />;
         case 'Students': return <StudentsView darkMode={darkMode} students={filteredStudents} searchQuery={searchQuery} setSearchQuery={setSearchQuery} allStudents={REAL_STUDENTS} />;
         case 'Student Performance': return <StudentPerformanceView darkMode={darkMode} />;
         case 'Faculty': return <FacultyView darkMode={darkMode} faculty={REAL_FACULTY} />;
         case 'Teacher Performance': return <TeacherPerformanceView darkMode={darkMode} />;
         case 'Finance': return <FinanceView darkMode={darkMode} transactions={TRANSACTIONS} />;
         case 'Academics': return <AcademicsView darkMode={darkMode} assignments={ASSIGNMENTS} />;
         case 'Attendance': return <AttendanceView darkMode={darkMode} />;
         case 'Messages': return <MessagesView darkMode={darkMode} messages={MESSAGES} />;
         case 'Timetable': return <TimetableView darkMode={darkMode} />;
         case 'Settings': return <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} />;
         default: return <DashboardView darkMode={darkMode} stats={stats} />;
      }
   };

   return (
      <div className={`${darkMode ? 'dark' : ''}`}>
         <div className={`flex h-screen overflow-hidden font-sans selection:bg-indigo-200 ${darkMode ? THEME.darkBg : THEME.lightBg}`}>
            {/* Mobile Overlay */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
               <div className="h-20 flex items-center justify-between px-6">
                  <div className="flex items-center">
                     <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">C</div>
                     <span className={`ml-3 text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>CMS<span className="text-indigo-600">.</span></span>
                  </div>
                  <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
               </div>

               <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
                  {NAV_ITEMS.map(item => (
                     <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 font-bold' : `font-medium ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}`}>
                        <item.icon size={20} />
                        <span>{item.id}</span>
                        {item.id === 'Messages' && <span className="ml-auto w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">3</span>}
                     </button>
                  ))}
               </nav>

               <div className={`p-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                     <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">A</div>
                     <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>Admin</p>
                        <button onClick={() => setIsLoggedIn(false)} className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"><LogOut size={12} /> Logout</button>
                     </div>
                  </div>
               </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
               <header className={`h-16 px-6 lg:px-8 flex justify-between items-center z-30 shrink-0 backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-b border-slate-800' : 'bg-white/80 border-b border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                     <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={22} className={darkMode ? 'text-white' : 'text-slate-700'} /></button>
                     <div>
                        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{activeTab}</h2>
                        <p className="text-[11px] text-slate-500 hidden sm:block">Country Model School Admin Portal</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl transition ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>{darkMode ? '☀️' : '🌙'}</button>
                     <div className="relative cursor-pointer">
                        <Bell size={22} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                     </div>
                     <div className={`hidden md:flex items-center gap-3 pl-4 border-l ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className="text-right">
                           <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Admin</p>
                           <p className="text-[10px] text-slate-500">Super Admin</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm">A</div>
                     </div>
                  </div>
               </header>

               <main className={`flex-1 overflow-y-auto p-6 lg:p-8 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  {renderContent()}
               </main>
            </div>
         </div>
         <ChatBot darkMode={darkMode} />
      </div>
   );
};

export default App;