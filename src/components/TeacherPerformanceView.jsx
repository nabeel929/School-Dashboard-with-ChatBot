import React, { useState } from 'react';
import { Card } from './ui';
import { TEACHER_PERFORMANCE } from '../data';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award, BookOpen, Users, TrendingUp, Star, CheckCircle } from 'lucide-react';

const TeacherPerformanceView = ({ darkMode }) => {
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const avgPassRate = Math.round(TEACHER_PERFORMANCE.reduce((a, t) => a + t.passRate, 0) / TEACHER_PERFORMANCE.length);
    const avgSatisfaction = Math.round(TEACHER_PERFORMANCE.reduce((a, t) => a + t.studentSatisfaction, 0) / TEACHER_PERFORMANCE.length);
    const avgClassScore = (TEACHER_PERFORMANCE.reduce((a, t) => a + t.avgClassScore, 0) / TEACHER_PERFORMANCE.length).toFixed(1);
    const totalAssignments = TEACHER_PERFORMANCE.reduce((a, t) => a + t.assignmentsGraded, 0);

    // Comparison data for bar chart
    const comparisonData = TEACHER_PERFORMANCE.map(t => ({
        name: t.name.split(' ')[1] || t.name.split('.')[1]?.trim() || t.name,
        'Pass Rate': t.passRate,
        'Satisfaction': t.studentSatisfaction,
        'Avg Score': t.avgClassScore,
    }));

    // Monthly labels
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

    // Selected teacher detail
    const teacher = selectedTeacher ? TEACHER_PERFORMANCE.find(t => t.id === selectedTeacher) : null;

    const teacherTrend = teacher ? teacher.monthlyTrend.map((v, i) => ({ month: months[i], score: v })) : [];

    // Class averages for radar
    const allClasses = ['9th Rose', '9th Jasmine', '10th Rose', '10th Jasmine'];
    const teacherRadar = teacher ? allClasses.map(cls => ({
        class: cls, avg: teacher.classAvg[cls] || 0, fullMark: 100
    })) : [];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Teacher Performance Analytics</h2>
                <p className="text-slate-500 text-sm">Faculty effectiveness & evaluation metrics</p>
            </div>

            {/* Faculty KPI Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
                {[
                    { label: 'Avg Pass Rate', value: `${avgPassRate}%`, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
                    { label: 'Student Satisfaction', value: `${avgSatisfaction}%`, icon: Star, color: 'from-amber-500 to-orange-500' },
                    { label: 'Avg Class Score', value: avgClassScore, icon: TrendingUp, color: 'from-indigo-500 to-blue-500' },
                    { label: 'Assignments Graded', value: totalAssignments, icon: BookOpen, color: 'from-purple-500 to-pink-500' },
                ].map((kpi, i) => (
                    <Card key={i} darkMode={darkMode}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.color} shadow-lg`}><kpi.icon size={18} className="text-white" /></div>
                            <p className="text-xs text-slate-500 font-bold uppercase">{kpi.label}</p>
                        </div>
                        <p className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{kpi.value}</p>
                    </Card>
                ))}
            </div>

            {/* Teacher Comparison Chart */}
            <Card darkMode={darkMode}>
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>📊 Faculty Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData} barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="name" tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 700 }} />
                        <YAxis domain={[60, 100]} tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <Tooltip contentStyle={{ background: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                        <Bar dataKey="Pass Rate" fill="#10b981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Satisfaction" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Avg Score" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Teacher Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
                {TEACHER_PERFORMANCE.map(t => (
                    <Card key={t.id} darkMode={darkMode} onClick={() => setSelectedTeacher(t.id === selectedTeacher ? null : t.id)} className={`cursor-pointer group hover:-translate-y-1 transition-all ${selectedTeacher === t.id ? 'ring-2 ring-indigo-500 ring-offset-2' + (darkMode ? ' ring-offset-slate-900' : '') : ''}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">{t.img}</div>
                            <div>
                                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.name}</h3>
                                <p className="text-sm text-slate-500">{t.subject} • {t.yearsExperience}yr exp</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className={`text-center p-2.5 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Pass</p>
                                <p className={`font-extrabold ${t.passRate >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{t.passRate}%</p>
                            </div>
                            <div className={`text-center p-2.5 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Sat.</p>
                                <p className={`font-extrabold ${t.studentSatisfaction >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{t.studentSatisfaction}%</p>
                            </div>
                            <div className={`text-center p-2.5 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Avg</p>
                                <p className={`font-extrabold ${t.avgClassScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{t.avgClassScore}</p>
                            </div>
                        </div>

                        {/* Assignment completion bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500 font-bold">Assignments Graded</span>
                                <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.assignmentsGraded}/{t.totalAssignments}</span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${(t.assignmentsGraded / t.totalAssignments) * 100}%` }}></div>
                            </div>
                        </div>

                        {/* Strengths */}
                        <div className="flex flex-wrap gap-1.5">
                            {t.strengths.map(s => (
                                <span key={s} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${darkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>{s}</span>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Selected Teacher Detail */}
            {teacher && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card darkMode={darkMode}>
                        <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>📈 {teacher.name}'s Monthly Trend</h3>
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={teacherTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="month" tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                                <YAxis domain={[60, 100]} tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                                <Tooltip contentStyle={{ background: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card darkMode={darkMode}>
                        <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>🎯 Class-wise Performance</h3>
                        <ResponsiveContainer width="100%" height={260}>
                            <RadarChart data={teacherRadar}>
                                <PolarGrid stroke={darkMode ? '#334155' : '#e2e8f0'} />
                                <PolarAngleAxis dataKey="class" tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 700 }} />
                                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 10 }} />
                                <Radar name="Class Avg" dataKey="avg" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TeacherPerformanceView;
