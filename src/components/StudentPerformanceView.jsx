import React, { useState } from 'react';
import { Card } from './ui';
import { ROUND_PERFORMANCE, CLASS_ROUND_PERFORMANCE, REAL_STUDENTS, getGrade } from '../data';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Award, Target, BarChart3, Users } from 'lucide-react';

const StudentPerformanceView = ({ darkMode }) => {
    const [selectedStudent, setSelectedStudent] = useState(1);
    const [selectedClass, setSelectedClass] = useState('All');

    const student = ROUND_PERFORMANCE.students[selectedStudent];
    const studentInfo = REAL_STUDENTS.find(s => s.id === selectedStudent);

    // Round trend data for selected student
    const trendData = ROUND_PERFORMANCE.rounds.map((round, i) => ({
        round,
        score: student.scores[i],
        attendance: student.attendance[i],
    }));

    // Improvement calculation
    const lastIdx = student.scores.length - 1;
    const improvement = (student.scores[lastIdx] - student.scores[0]).toFixed(1);
    const improvementPercent = student.scores[0] !== 0 ? ((improvement / student.scores[0]) * 100).toFixed(1) : '0.0';

    // Class ranking per round
    const classStudents = Object.entries(ROUND_PERFORMANCE.students).filter(([, s]) =>
        selectedClass === 'All' || s.class === selectedClass
    );

    // Build class ranking data
    const rankingData = ROUND_PERFORMANCE.rounds.map((round, ri) => {
        const sorted = [...classStudents].sort((a, b) => b[1].scores[ri] - a[1].scores[ri]);
        return sorted.map(([id, s], rank) => ({ id: Number(id), name: s.name, score: s.scores[ri], rank: rank + 1 }));
    });

    // Subject breakdown radar
    const subjectData = studentInfo ? Object.entries(studentInfo.subjects).map(([subject, marks]) => ({
        subject, marks, fullMark: 100
    })) : [];

    // At-risk students (declining or below 60)
    const atRiskStudents = Object.entries(ROUND_PERFORMANCE.students).filter(([, s]) => {
        const li = s.scores.length - 1;
        return s.scores[li] < 60 || (li > 0 && s.scores[li] < s.scores[li - 1]);
    }).filter(([, s]) => selectedClass === 'All' || s.class === selectedClass).map(([id, s]) => {
        const li = s.scores.length - 1;
        return {
            id: Number(id), name: s.name, class: s.class,
            latest: s.scores[li], trend: li > 0 ? (s.scores[li] - s.scores[li - 1]).toFixed(1) : '0.0',
            overall: (s.scores[li] - s.scores[0]).toFixed(1)
        };
    });

    const g = studentInfo ? getGrade(studentInfo.marks) : { grade: '—', color: 'text-slate-500' };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Student Performance Analytics</h2>
                    <p className="text-slate-500 text-sm">Round-wise academic progress tracking</p>
                </div>
                <div className="flex gap-3">
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className={`px-4 py-2.5 rounded-xl border text-sm font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                        <option value="All">All Classes</option>
                        <option>9th Rose</option>
                        <option>9th Jasmine</option>
                        <option>10th Rose</option>
                        <option>10th Jasmine</option>
                    </select>
                    <select value={selectedStudent} onChange={e => setSelectedStudent(Number(e.target.value))} className={`px-4 py-2.5 rounded-xl border text-sm font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                        {REAL_STUDENTS.filter(s => selectedClass === 'All' || s.class === selectedClass).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Student KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
                {[
                    { label: 'Current Score', value: `${student.scores[lastIdx]}%`, icon: Target, color: 'from-indigo-500 to-blue-500', sub: `Grade: ${g.grade}` },
                    { label: 'Improvement', value: `${Number(improvement) >= 0 ? '+' : ''}${improvement}%`, icon: Number(improvement) >= 0 ? TrendingUp : TrendingDown, color: 'from-emerald-500 to-teal-500', sub: `${improvementPercent}% growth` },
                    { label: 'Attendance', value: `${student.attendance[lastIdx]}%`, icon: Users, color: 'from-amber-500 to-orange-500', sub: `Latest round` },
                    { label: 'Class Rank', value: `#${rankingData[lastIdx]?.find(r => r.id === selectedStudent)?.rank || '–'}`, icon: Award, color: 'from-purple-500 to-pink-500', sub: `of ${classStudents.length} students` },
                ].map((kpi, i) => (
                    <Card key={i} darkMode={darkMode}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.color} shadow-lg`}><kpi.icon size={18} className="text-white" /></div>
                            <p className="text-xs text-slate-500 font-bold uppercase">{kpi.label}</p>
                        </div>
                        <p className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{kpi.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
                    </Card>
                ))}
            </div>

            {/* Round Progress Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card darkMode={darkMode}>
                    <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>📈 Round-wise Score Trend</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                            <XAxis dataKey="round" tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                            <YAxis domain={[40, 100]} tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                            <Tooltip contentStyle={{ background: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fill="url(#scoreGrad)" dot={{ r: 5, fill: '#6366f1' }} />
                            <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} fill="none" strokeDasharray="5 5" dot={{ r: 3, fill: '#10b981' }} />
                            <Legend />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Subject Breakdown Radar */}
                <Card darkMode={darkMode}>
                    <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>🎯 Subject Breakdown</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={subjectData}>
                            <PolarGrid stroke={darkMode ? '#334155' : '#e2e8f0'} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 700 }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 10 }} />
                            <Radar name="Marks" dataKey="marks" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Class-wise Round Comparison */}
            <Card darkMode={darkMode}>
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>🏫 Class-wise Round Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={CLASS_ROUND_PERFORMANCE} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="round" tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <Tooltip contentStyle={{ background: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                        <Legend />
                        <Bar dataKey="9th Rose" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="9th Jasmine" fill="#10b981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="10th Rose" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="10th Jasmine" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* At-Risk Students */}
            {atRiskStudents.length > 0 && (
                <Card darkMode={darkMode}>
                    <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span> At-Risk Students
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead><tr className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                                <th className="pb-3 font-bold">Student</th><th className="pb-3 font-bold">Class</th><th className="pb-3 font-bold">Latest</th><th className="pb-3 font-bold">Last Change</th><th className="pb-3 font-bold">Overall</th>
                            </tr></thead>
                            <tbody>
                                {atRiskStudents.map(s => (
                                    <tr key={s.id} className={`border-b ${darkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                                        <td className={`py-3 font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{s.name}</td>
                                        <td className="py-3 text-slate-500">{s.class}</td>
                                        <td className="py-3"><span className={`px-2 py-1 rounded-lg text-xs font-bold ${s.latest < 60 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{s.latest}%</span></td>
                                        <td className={`py-3 font-bold ${Number(s.trend) < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{Number(s.trend) >= 0 ? '+' : ''}{s.trend}%</td>
                                        <td className={`py-3 font-bold ${Number(s.overall) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{Number(s.overall) >= 0 ? '+' : ''}{s.overall}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Full Leaderboard */}
            <Card darkMode={darkMode}>
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>🏆 Current Leaderboard (Round 5)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead><tr className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                            <th className="pb-3 font-bold">#</th><th className="pb-3 font-bold">Student</th><th className="pb-3 font-bold">Class</th>
                            {ROUND_PERFORMANCE.rounds.map(r => <th key={r} className="pb-3 font-bold text-center">{r}</th>)}
                            <th className="pb-3 font-bold text-center">Growth</th>
                        </tr></thead>
                        <tbody>
                            {[...classStudents]
                                .sort((a, b) => b[1].scores[b[1].scores.length - 1] - a[1].scores[a[1].scores.length - 1])
                                .slice(0, 30)
                                .map(([id, s], i) => {
                                    const growth = (s.scores[s.scores.length - 1] - s.scores[0]).toFixed(1);
                                    return (
                                        <tr key={id} className={`border-b cursor-pointer transition hover:bg-indigo-50 dark:hover:bg-slate-700/50 ${darkMode ? 'border-slate-700' : 'border-slate-50'}`} onClick={() => setSelectedStudent(Number(id))}>
                                            <td className="py-3">
                                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="text-slate-400 font-bold">{i + 1}</span>}
                                            </td>
                                            <td className={`py-3 font-bold ${Number(id) === selectedStudent ? 'text-indigo-600' : darkMode ? 'text-white' : 'text-slate-800'}`}>{s.name}</td>
                                            <td className="py-3 text-slate-500">{s.class}</td>
                                            {s.scores.map((sc, si) => (
                                                <td key={si} className="py-3 text-center">
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${sc >= 80 ? 'bg-emerald-100 text-emerald-700' : sc >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{sc}</span>
                                                </td>
                                            ))}
                                            <td className={`py-3 text-center font-bold ${Number(growth) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{Number(growth) >= 0 ? '+' : ''}{growth}%</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default StudentPerformanceView;
