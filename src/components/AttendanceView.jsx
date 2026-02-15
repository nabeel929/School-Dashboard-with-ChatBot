import React, { useState } from 'react';
import { Card } from './ui';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { REAL_STUDENTS } from '../data';

const DAYS_IN_MONTH = Array.from({ length: 28 }, (_, i) => i + 1);
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const AttendanceView = ({ darkMode }) => {
    const [selectedClass, setSelectedClass] = useState('9th Rose');
    const classes = [...new Set(REAL_STUDENTS.map(s => s.class))];
    const classStudents = REAL_STUDENTS.filter(s => s.class === selectedClass);

    // Generate mock attendance for current month
    const getStatus = (studentId, day) => {
        const seed = (studentId * 31 + day * 7) % 10;
        if (day > 15) return seed > 1 ? 'present' : 'absent';
        return seed > 2 ? 'present' : seed > 1 ? 'late' : 'absent';
    };

    const totalPresent = classStudents.reduce((acc, s) => acc + DAYS_IN_MONTH.filter(d => getStatus(s.id, d) === 'present').length, 0);
    const totalDays = classStudents.length * DAYS_IN_MONTH.length;
    const overallRate = Math.round((totalPresent / totalDays) * 100);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Attendance Tracker</h2>
                    <p className="text-slate-500 text-sm">Daily presence monitoring — February 2026</p>
                </div>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className={`px-4 py-2.5 rounded-xl border text-sm font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                    {classes.map(c => <option key={c}>{c}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-children">
                {[
                    { label: 'Overall Rate', val: `${overallRate}%`, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Students', val: classStudents.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Late Arrivals', val: '4', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Absences Today', val: '1', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
                ].map((s, i) => (
                    <Card key={i} darkMode={darkMode} className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : s.bg} ${s.color}`}><s.icon size={22} /></div>
                        <div>
                            <p className="text-slate-500 text-xs">{s.label}</p>
                            <h3 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{s.val}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <Card darkMode={darkMode} className="overflow-x-auto">
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Monthly Attendance Grid</h3>
                <div className="min-w-[700px]">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `180px repeat(${DAYS_IN_MONTH.length}, 1fr)` }}>
                        <div className="text-xs font-bold text-slate-500 p-2">Student</div>
                        {DAYS_IN_MONTH.map(d => (
                            <div key={d} className="text-center text-[10px] font-bold text-slate-400 p-1">{d}</div>
                        ))}
                        {classStudents.map(s => (
                            <React.Fragment key={s.id}>
                                <div className={`text-sm font-bold p-2 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">{s.name.charAt(0)}</div>
                                    <span className="truncate">{s.name}</span>
                                </div>
                                {DAYS_IN_MONTH.map(d => {
                                    const st = getStatus(s.id, d);
                                    return (
                                        <div key={d} className="flex items-center justify-center p-1">
                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold cursor-pointer hover:scale-125 transition-transform ${st === 'present' ? 'bg-emerald-100 text-emerald-600' :
                                                    st === 'late' ? 'bg-amber-100 text-amber-600' :
                                                        'bg-rose-100 text-rose-600'
                                                }`}>
                                                {st === 'present' ? '✓' : st === 'late' ? 'L' : '✗'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="flex gap-6 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                    {[
                        { label: 'Present', color: 'bg-emerald-100 text-emerald-600' },
                        { label: 'Late', color: 'bg-amber-100 text-amber-600' },
                        { label: 'Absent', color: 'bg-rose-100 text-rose-600' },
                    ].map(l => (
                        <div key={l.label} className="flex items-center gap-2 text-xs text-slate-500">
                            <div className={`w-4 h-4 rounded ${l.color}`}></div>{l.label}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default AttendanceView;
