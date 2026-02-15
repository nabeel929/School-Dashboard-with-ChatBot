import React from 'react';
import { Card, StatusBadge } from './ui';
import { DollarSign, CreditCard, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinanceView = ({ darkMode, transactions }) => {
    const monthlyData = [
        { month: 'Sep', income: 380000, expense: 120000 },
        { month: 'Oct', income: 420000, expense: 150000 },
        { month: 'Nov', income: 400000, expense: 130000 },
        { month: 'Dec', income: 450000, expense: 140000 },
        { month: 'Jan', income: 470000, expense: 160000 },
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                {[
                    { label: 'Total Collections', val: 'PKR 4.2M', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+18%' },
                    { label: 'Pending Dues', val: 'PKR 150K', icon: CreditCard, color: 'text-rose-500', bg: 'bg-rose-50', trend: '3 students' },
                    { label: 'Net Revenue', val: 'PKR 4.05M', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50', trend: 'On Target' },
                ].map((s, i) => (
                    <Card key={i} darkMode={darkMode} className="relative overflow-hidden group hover:-translate-y-1 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-bold uppercase">{s.label}</p>
                                <h3 className={`text-3xl font-extrabold mt-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{s.val}</h3>
                                <span className={`text-xs font-bold mt-2 inline-block px-2.5 py-1 rounded-lg ${darkMode ? 'bg-slate-700' : s.bg} ${s.color}`}>{s.trend}</span>
                            </div>
                            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-slate-700' : s.bg} ${s.color}`}><s.icon size={24} /></div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card darkMode={darkMode}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Monthly Revenue</h3>
                </div>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e2e8f0'} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            <Bar dataKey="income" fill="#4f46e5" radius={[8, 8, 0, 0]} name="Income" />
                            <Bar dataKey="expense" fill="#f43f5e" radius={[8, 8, 0, 0]} name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card darkMode={darkMode}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Recent Transactions</h3>
                    <button className="flex items-center gap-2 text-indigo-600 text-sm font-bold hover:underline"><Download size={14} /> Export</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className={`text-xs uppercase text-slate-500 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <tr><th className="p-4">ID</th><th className="p-4">Student</th><th className="p-4">Type</th><th className="p-4">Method</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr>
                        </thead>
                        <tbody className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                            {transactions.map(t => (
                                <tr key={t.id} className={`border-b ${darkMode ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'} transition`}>
                                    <td className="p-4 font-mono text-xs text-slate-400">{t.id}</td>
                                    <td className="p-4 font-bold">{t.student}</td>
                                    <td className="p-4">{t.type}</td>
                                    <td className="p-4 text-slate-400">{t.method}</td>
                                    <td className="p-4 font-bold">PKR {t.amount.toLocaleString()}</td>
                                    <td className="p-4"><StatusBadge status={t.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default FinanceView;
