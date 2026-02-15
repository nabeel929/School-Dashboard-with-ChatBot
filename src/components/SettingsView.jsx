import React from 'react';
import { Card } from './ui';
import { Shield, Bell, User, Monitor, Lock, Mail, Globe } from 'lucide-react';

const SettingsView = ({ darkMode, setDarkMode }) => {
    const Toggle = ({ enabled, onToggle }) => (
        <button onClick={onToggle} className={`w-14 h-8 rounded-full p-1 transition-colors ${enabled ? 'bg-indigo-600' : darkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
        </button>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
            <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Settings</h2>
                <p className="text-slate-500 text-sm">System preferences & administration</p>
            </div>

            {/* Profile */}
            <Card darkMode={darkMode}>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-indigo-50'}`}><User size={20} className="text-indigo-600" /></div>
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Profile Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-1.5 block">Full Name</label>
                        <input defaultValue="Admin User" className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-1.5 block">Email</label>
                        <input defaultValue="admin@cms.edu.pk" className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-1.5 block">Phone</label>
                        <input defaultValue="+92 300 1234567" className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-1.5 block">Role</label>
                        <input defaultValue="Super Admin" disabled className={`w-full p-3 rounded-xl border bg-slate-100 ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-400' : 'border-slate-200 text-slate-400'}`} />
                    </div>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg text-sm">Update Profile</button>
            </Card>

            {/* Appearance */}
            <Card darkMode={darkMode}>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-purple-50'}`}><Monitor size={20} className="text-purple-600" /></div>
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Appearance</h3>
                </div>
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div><h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>Dark Mode</h4><p className="text-xs text-slate-500">Toggle dark/light theme</p></div>
                        <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div><h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>Compact Sidebar</h4><p className="text-xs text-slate-500">Use icon-only sidebar</p></div>
                        <Toggle enabled={false} onToggle={() => { }} />
                    </div>
                </div>
            </Card>

            {/* Notifications */}
            <Card darkMode={darkMode}>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-amber-50'}`}><Bell size={20} className="text-amber-600" /></div>
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Notifications</h3>
                </div>
                <div className="space-y-5">
                    {[
                        { label: 'Email Notifications', desc: 'Receive daily digest summaries', on: true },
                        { label: 'Fee Reminders', desc: 'Auto-send fee due alerts', on: true },
                        { label: 'Attendance Alerts', desc: 'Notify on absent students', on: false },
                    ].map(n => (
                        <div key={n.label} className="flex items-center justify-between">
                            <div><h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{n.label}</h4><p className="text-xs text-slate-500">{n.desc}</p></div>
                            <Toggle enabled={n.on} onToggle={() => { }} />
                        </div>
                    ))}
                </div>
            </Card>

            {/* System Info */}
            <Card darkMode={darkMode}>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-emerald-50'}`}><Shield size={20} className="text-emerald-600" /></div>
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>System Information</h3>
                </div>
                <div className={`space-y-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {[
                        { label: 'Application', val: 'CMS Admin Portal v2.0' },
                        { label: 'School', val: 'Country Model School' },
                        { label: 'Academic Year', val: '2025-2026' },
                        { label: 'Encryption', val: '256-bit AES' },
                        { label: 'Last Backup', val: 'Feb 15, 2026 • 08:00 AM' },
                    ].map(i => (
                        <div key={i.label} className={`flex justify-between py-2 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                            <span className="text-slate-500">{i.label}</span>
                            <span className="font-bold">{i.val}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default SettingsView;
