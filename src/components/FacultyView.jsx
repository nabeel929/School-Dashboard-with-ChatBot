import React from 'react';
import { Card, StatusBadge } from './ui';
import { Star, MoreVertical, Mail, Calendar } from 'lucide-react';

const FacultyView = ({ darkMode, faculty }) => (
    <div className="space-y-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
            <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Faculty Directory</h2>
                <p className="text-slate-500 text-sm">Manage teachers & staff profiles</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
            {faculty.map(f => (
                <Card key={f.id} darkMode={darkMode} className="group hover:-translate-y-2 cursor-pointer">
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">{f.img}</div>
                            <div>
                                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>{f.name}</h3>
                                <p className="text-sm text-slate-500">{f.role} • {f.subject}</p>
                            </div>
                        </div>
                        <StatusBadge status={f.status} />
                    </div>
                    <div className={`grid grid-cols-2 gap-3 mb-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                            <p className="text-xs text-slate-500 mb-1">Classes</p>
                            <p className="font-bold text-sm">{f.classes}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                            <p className="text-xs text-slate-500 mb-1">Rating</p>
                            <p className="font-bold text-sm flex items-center gap-1"><Star size={12} className="text-amber-500" fill="currentColor" />{f.rating}%</p>
                        </div>
                    </div>
                    <p className={`text-xs mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{f.email}</p>
                    <div className="flex gap-2">
                        <button className="flex-1 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition text-sm flex items-center justify-center gap-2"><Calendar size={14} />Schedule</button>
                        <button className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md shadow-indigo-200 dark:shadow-none text-sm flex items-center justify-center gap-2"><Mail size={14} />Message</button>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);

export default FacultyView;
