import React, { useState } from 'react';
import { Card } from './ui';
import { TIMETABLE, SUBJECT_COLORS } from '../data';
import { Calendar } from 'lucide-react';

const TimetableView = ({ darkMode }) => {
    const [selectedClass, setSelectedClass] = useState('9th Rose');

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Weekly Timetable</h2>
                    <p className="text-slate-500 text-sm">Class schedule management</p>
                </div>
                <div className="flex gap-3">
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className={`px-4 py-2.5 rounded-xl border text-sm font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                        <option>9th Rose</option>
                        <option>9th Jasmine</option>
                        <option>10th Jasmine</option>
                    </select>
                </div>
            </div>

            <Card darkMode={darkMode} className="overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid gap-2" style={{ gridTemplateColumns: `120px repeat(${TIMETABLE.days.length}, 1fr)` }}>
                        {/* Header */}
                        <div className="p-3"></div>
                        {TIMETABLE.days.map(day => (
                            <div key={day} className={`p-3 rounded-xl text-center font-bold text-sm ${darkMode ? 'bg-slate-700 text-white' : 'bg-indigo-50 text-indigo-700'}`}>{day}</div>
                        ))}

                        {/* Rows */}
                        {TIMETABLE.periods.map((period, pi) => (
                            <React.Fragment key={pi}>
                                <div className={`p-3 rounded-xl flex flex-col justify-center ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                    <p className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{period.label}</p>
                                    <p className="text-[10px] text-slate-400">{period.time}</p>
                                </div>
                                {TIMETABLE.days.map(day => {
                                    const subj = TIMETABLE.schedule[day][pi];
                                    const isBreak = subj === '☕';
                                    const colors = SUBJECT_COLORS[subj] || 'bg-slate-100 text-slate-500';
                                    return (
                                        <div key={day} className={`p-3 rounded-xl text-center flex items-center justify-center font-bold text-sm border transition-all hover:scale-105 cursor-pointer ${isBreak ? 'bg-orange-50 text-orange-400 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300' : darkMode ? 'bg-slate-700/30 border-slate-700 text-slate-200' : `${colors}`}`}>
                                            {subj}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                    {Object.entries(SUBJECT_COLORS).filter(([k]) => k !== '☕').map(([subj, cls]) => (
                        <div key={subj} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${cls}`}>{subj}</div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default TimetableView;
