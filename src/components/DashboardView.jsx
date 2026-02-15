import React, { useState } from 'react';
import { Card } from './ui';
import { REAL_STUDENTS, THEME } from '../data';
import { Users, Award, DollarSign, Briefcase, Star, Sparkles, Mic, ChevronRight, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardView = ({ darkMode, stats }) => {
    const [bannerVisible, setBannerVisible] = useState(true);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* ═══ Welcome Banner ═══ */}
            {bannerVisible && (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 md:p-8 shadow-2xl shadow-indigo-200/40 dark:shadow-indigo-900/30">
                    {/* Animated Background Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full -mb-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
                    <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/10 rounded-full animate-bounce-subtle"></div>

                    <button
                        onClick={() => setBannerVisible(false)}
                        className="absolute top-3 right-3 text-white/50 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-white/10 transition-all"
                    >✕</button>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-[11px] font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                                    <Sparkles size={12} /> AI-Powered Dashboard
                                </div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2">
                                Welcome to Country Model School
                            </h2>
                            <p className="text-indigo-100 text-sm md:text-base leading-relaxed max-w-xl">
                                Your AI assistant is ready with real-time data for <strong>{REAL_STUDENTS.length} students</strong> across <strong>4 classes</strong>.
                                Use <strong>voice commands</strong> or type to get instant insights.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                                <p className="text-3xl font-black text-white">{stats.total}</p>
                                <p className="text-indigo-200 text-[10px] font-bold uppercase">Students</p>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                                <p className="text-3xl font-black text-white">{stats.avg}%</p>
                                <p className="text-indigo-200 text-[10px] font-bold uppercase">Avg Score</p>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                                <p className="text-3xl font-black text-white">4</p>
                                <p className="text-indigo-200 text-[10px] font-bold uppercase">Classes</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ AI Voice Assistant Banner ═══ */}
            <div className={`rounded-2xl p-4 flex items-center gap-4 border transition-all hover:shadow-lg cursor-pointer group ${darkMode ? 'bg-gradient-to-r from-slate-800 to-slate-800/80 border-slate-700 hover:border-indigo-500/50' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 hover:border-indigo-300'
                }`}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-300/30 group-hover:scale-110 transition-transform">
                    <Mic size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <Zap size={14} className="text-amber-500" /> CMS Voice Assistant
                    </h4>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Click the chat bubble at the bottom-right and tap the <strong>🎤 mic</strong> to ask anything by voice — student results, class stats, teacher reviews & more!
                    </p>
                </div>
                <ChevronRight size={18} className={`shrink-0 group-hover:translate-x-1 transition-transform ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>

            {/* ═══ KPI Cards ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
                {[
                    { label: "Total Students", val: stats.total, icon: Users, color: "text-blue-500", trend: "+12%", bg: "bg-blue-50" },
                    { label: "Avg Result", val: `${stats.avg}%`, icon: Award, color: "text-purple-500", trend: "Excellent", bg: "bg-purple-50" },
                    { label: "Fee Collected", val: "PKR 4.2M", icon: DollarSign, color: "text-emerald-500", trend: "Target Hit", bg: "bg-emerald-50" },
                    { label: "Faculty", val: "24", icon: Briefcase, color: "text-amber-500", trend: "All Active", bg: "bg-amber-50" },
                ].map((kpi, i) => (
                    <Card key={i} darkMode={darkMode} className="relative overflow-hidden group cursor-pointer hover:-translate-y-1">
                        <div className="flex justify-between items-start z-10 relative">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{kpi.label}</p>
                                <h3 className={`text-3xl font-extrabold mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{kpi.val}</h3>
                                <span className={`text-xs font-bold mt-2 inline-block px-2.5 py-1 rounded-lg ${darkMode ? 'bg-slate-700' : kpi.bg} ${kpi.color}`}>{kpi.trend}</span>
                            </div>
                            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-slate-700/50' : kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                                <kpi.icon size={24} />
                            </div>
                        </div>
                        <div className={`absolute -right-6 -bottom-6 opacity-[0.04] transform group-hover:scale-110 transition-transform duration-500 ${kpi.color}`}>
                            <kpi.icon size={100} />
                        </div>
                    </Card>
                ))}
            </div>

            {/* ═══ Charts & Top Student ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card darkMode={darkMode} className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Academic Performance (Round 5)</h3>
                        <select className={`p-2 rounded-xl text-sm border outline-none font-medium ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}>
                            <option>All Sections</option>
                            <option>9th Rose</option>
                            <option>9th Jasmine</option>
                            <option>10th Jasmine</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REAL_STUDENTS.map(s => ({ name: s.name.split(' ')[0], Score: s.marks }))}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} />
                                <Area type="monotone" dataKey="Score" stroke="#4f46e5" strokeWidth={3} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className={`rounded-3xl p-1 bg-gradient-to-b ${THEME.primary}`}>
                    <div className={`h-full rounded-[22px] p-6 flex flex-col items-center text-center ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-full border-4 border-amber-400 p-1">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl">👩‍🎓</div>
                            </div>
                            <div className="absolute bottom-0 right-0 bg-amber-400 text-white p-1.5 rounded-full border-4 border-white dark:border-slate-900"><Star size={14} fill="white" /></div>
                        </div>
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Qisa Fatima</h3>
                        <p className="text-sm text-slate-500 mb-1">🏆 Position Holder</p>
                        <p className="text-xs text-indigo-600 font-bold mb-4">9th Rose • 91.79%</p>
                        <div className={`w-full rounded-2xl p-4 mb-4 ${darkMode ? 'bg-slate-800' : 'bg-indigo-50/70'}`}>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-3">Top Subjects</p>
                            {[{ name: 'Maths', score: 95, color: 'bg-indigo-500' }, { name: 'Urdu', score: 94, color: 'bg-emerald-500' }].map(s => (
                                <div key={s.name} className="mb-2">
                                    <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-1"><span>{s.name}</span><span>{s.score}%</span></div>
                                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"><div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${s.score}%` }}></div></div>
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-slate-400">Round 5 Evaluation • Dec 2025</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
