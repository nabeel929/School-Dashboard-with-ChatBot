import React from 'react';
import { Card, StatusBadge } from './ui';
import { FileText, ChevronRight, Plus } from 'lucide-react';

const AcademicsView = ({ darkMode, assignments }) => (
    <div className="space-y-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
            <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Homework & Assignments</h2>
                <p className="text-slate-500 text-sm">Track submissions and deadlines</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg text-sm"><Plus size={18} /> Create Assignment</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
            {[
                { label: 'Total Assignments', val: assignments.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Due This Week', val: assignments.filter(a => a.priority === 'High').length, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Avg Submission Rate', val: `${Math.round(assignments.reduce((acc, a) => acc + (a.submissions / a.total) * 100, 0) / assignments.length)}%`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((s, i) => (
                <Card key={i} darkMode={darkMode} className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : s.bg} ${s.color}`}><FileText size={24} /></div>
                    <div>
                        <p className="text-slate-500 text-xs font-medium">{s.label}</p>
                        <h3 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{s.val}</h3>
                    </div>
                </Card>
            ))}
        </div>

        <div className="space-y-4">
            {assignments.map(h => {
                const pct = Math.round((h.submissions / h.total) * 100);
                return (
                    <Card key={h.id} darkMode={darkMode} className="hover:-translate-y-0.5 cursor-pointer">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className={`p-3 rounded-xl ${h.priority === 'High' ? 'bg-rose-100 text-rose-600' : h.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{h.title}</h4>
                                    <p className="text-xs text-slate-500">{h.course} • {h.class}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{h.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Due Date</p>
                                    <p className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{h.due}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-slate-500 mb-1">Submissions</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <div className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold">{h.submissions}/{h.total}</span>
                                    </div>
                                </div>
                                <StatusBadge status={h.priority} />
                                <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}><ChevronRight size={20} className="text-slate-400" /></button>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    </div>
);

export default AcademicsView;
