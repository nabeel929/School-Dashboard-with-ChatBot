import React, { useState } from 'react';
import { Card, StatusBadge } from './ui';
import { getGrade } from '../data';
import { Search, Download, Printer, Star, X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const StudentsView = ({ darkMode, students, searchQuery, setSearchQuery, allStudents }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [classFilter, setClassFilter] = useState('All');

    const classes = ['All', ...new Set(allStudents.map(s => s.class))];
    const filtered = students.filter(s => classFilter === 'All' || s.class === classFilter);

    return (
        <>
            <Card darkMode={darkMode} className="h-full flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Student Directory</h2>
                        <p className="text-slate-500 text-sm">Manage results, report cards & records</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className={`flex items-center px-4 py-2.5 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                            <Search size={18} className="text-slate-400 mr-2" />
                            <input placeholder="Search students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`bg-transparent outline-none text-sm w-48 ${darkMode ? 'text-white placeholder:text-slate-500' : ''}`} />
                        </div>
                        <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className={`px-4 py-2.5 rounded-xl border text-sm font-medium outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}>
                            {classes.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <CSVLink data={allStudents} filename="CMS_Results.csv" className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Download size={16} /> Export
                        </CSVLink>
                    </div>
                </div>
                <div className="overflow-x-auto flex-1 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead className={`text-xs uppercase text-slate-500 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                            <tr>
                                <th className="p-4 pl-6">Student</th>
                                <th className="p-4">Class</th>
                                <th className="p-4">Percentage</th>
                                <th className="p-4">Grade</th>
                                <th className="p-4">Fee</th>
                                <th className="p-4">Attendance</th>
                                <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {filtered.map(s => {
                                const g = getGrade(s.marks);
                                return (
                                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition border-b border-slate-100 dark:border-slate-800">
                                        <td className="p-4 pl-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">{s.name.charAt(0)}</div>
                                            <div>
                                                <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{s.name}</p>
                                                <p className="text-xs text-slate-400">{s.roll}</p>
                                            </div>
                                        </td>
                                        <td className="p-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{s.class}</span></td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-indigo-600">{s.marks}%</span>
                                                {s.status === 'Position Holder' && <Star size={14} className="text-amber-500" fill="currentColor" />}
                                            </div>
                                        </td>
                                        <td className="p-4"><span className={`font-extrabold text-lg ${g.color}`}>{g.grade}</span></td>
                                        <td className="p-4"><StatusBadge status={s.fee} /></td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${s.attendance >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${s.attendance}%` }}></div></div>
                                                <span className="text-xs">{s.attendance}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <button onClick={() => setSelectedStudent(s)} className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-lg flex items-center gap-2 ml-auto transition font-bold text-xs border border-indigo-100 dark:border-indigo-800">
                                                <Printer size={14} /> Report
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'} flex justify-between items-center text-sm text-slate-500`}>
                    <span>Showing {filtered.length} of {allStudents.length} students</span>
                    <span className="text-xs">Country Model School • Round 5</span>
                </div>
            </Card>

            {selectedStudent && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
                    <Card darkMode={darkMode} className="print-area w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setSelectedStudent(null)} className="no-print absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition"><X /></button>
                        <div className="flex justify-between items-start border-b border-dashed border-slate-200 dark:border-slate-700 pb-6 mb-6">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">C</div>
                                <div>
                                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Country Model School</h2>
                                    <p className="text-slate-500 text-sm">Official Result Sheet • Dec 2025</p>
                                    <p className="text-xs text-indigo-600 font-bold mt-1 uppercase tracking-wider">Round 5 Evaluation</p>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-400 uppercase">Student</p>
                                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{selectedStudent.name}</h3>
                                <p className="text-sm text-slate-500">{selectedStudent.roll} • {selectedStudent.class}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-4">Subject Performance</h4>
                                <div className="space-y-3">
                                    {Object.entries(selectedStudent.subjects).map(([sub, mark]) => (
                                        <div key={sub}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{sub}</span>
                                                <span className="font-bold text-indigo-600">{mark}/100</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-700 ${mark >= 90 ? 'bg-emerald-500' : mark >= 80 ? 'bg-indigo-500' : mark >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${mark}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-6">
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 self-start">Performance Analysis</h4>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={Object.entries(selectedStudent.subjects).map(([sub, mark]) => ({ subject: sub, A: mark, full: 100 }))}>
                                            <PolarGrid stroke={darkMode ? '#475569' : '#e2e8f0'} />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name={selectedStudent.name} dataKey="A" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.3} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex gap-4 w-full mt-4">
                                    <div className={`flex-1 text-center p-3 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
                                        <p className="text-xs text-slate-400">Total %</p>
                                        <p className="font-extrabold text-indigo-600 text-xl">{selectedStudent.marks}%</p>
                                    </div>
                                    <div className={`flex-1 text-center p-3 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
                                        <p className="text-xs text-slate-400">Grade</p>
                                        <p className={`font-extrabold text-xl ${getGrade(selectedStudent.marks).color}`}>{getGrade(selectedStudent.marks).grade}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="no-print flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button onClick={() => setSelectedStudent(null)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Close</button>
                            <button onClick={() => window.print()} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2">
                                <Printer size={18} /> Print Report
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default StudentsView;
