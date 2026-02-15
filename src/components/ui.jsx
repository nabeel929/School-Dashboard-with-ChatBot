import React from 'react';
import { THEME } from '../data';

export const Card = ({ children, className = "", darkMode, onClick }) => (
    <div onClick={onClick} className={`rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl ${darkMode ? THEME.cardDark : THEME.cardLight} ${className}`}>
        {children}
    </div>
);

export const StatusBadge = ({ status }) => {
    const styles = {
        "Position Holder": "bg-purple-100 text-purple-700 border-purple-200",
        "Top Scorer": "bg-amber-100 text-amber-700 border-amber-200",
        "Active": "bg-emerald-50 text-emerald-600 border-emerald-200",
        "Warning": "bg-rose-50 text-rose-600 border-rose-200",
        "On Leave": "bg-orange-50 text-orange-600 border-orange-200",
        "Paid": "bg-blue-50 text-blue-600 border-blue-200",
        "Pending": "bg-orange-50 text-orange-600 border-orange-200",
        "Overdue": "bg-red-50 text-red-600 border-red-200",
        "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200",
        "High": "bg-rose-50 text-rose-600 border-rose-200",
        "Medium": "bg-amber-50 text-amber-600 border-amber-200",
        "Low": "bg-blue-50 text-blue-600 border-blue-200",
    };
    return <span className={`px-3 py-1 rounded-full text-[11px] uppercase font-bold border ${styles[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>{status}</span>;
};

export const EmptyState = ({ icon: Icon, title, subtitle, darkMode }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className={`p-6 rounded-3xl mb-6 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <Icon size={48} className="text-slate-400" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
        <p className="text-slate-500 text-sm max-w-sm">{subtitle}</p>
    </div>
);
