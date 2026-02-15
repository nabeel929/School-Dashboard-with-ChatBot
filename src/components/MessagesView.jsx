import React, { useState } from 'react';
import { Card } from './ui';
import { MessageSquare, Send, MoreVertical, X } from 'lucide-react';

const MessagesView = ({ darkMode, messages }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [msgInput, setMsgInput] = useState('');
    const [chatMessages, setChatMessages] = useState({});

    const sendMessage = () => {
        if (!msgInput.trim() || !selectedChat) return;
        const key = selectedChat.id;
        setChatMessages(prev => ({ ...prev, [key]: [...(prev[key] || []), { from: 'me', text: msgInput, time: 'Just now' }] }));
        setMsgInput('');
    };

    return (
        <div className="animate-fade-in-up">
            <div className="mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Messages</h2>
                <p className="text-slate-500 text-sm">Internal communication hub</p>
            </div>
            <Card darkMode={darkMode} className="h-[600px] flex overflow-hidden !p-0">
                {/* Contacts */}
                <div className={`w-full md:w-80 border-r ${darkMode ? 'border-slate-700' : 'border-slate-100'} flex flex-col shrink-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    <div className={`p-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                        <input placeholder="Search chats..." className={`w-full p-2.5 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {messages.map(m => (
                            <div key={m.id} onClick={() => setSelectedChat(m)} className={`p-4 border-b cursor-pointer transition ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-50 hover:bg-indigo-50'} ${selectedChat?.id === m.id ? (darkMode ? 'bg-slate-700' : 'bg-indigo-50') : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-lg shrink-0">{m.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>{m.user}</h4>
                                            <span className="text-[10px] text-slate-500 shrink-0 ml-2">{m.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{m.msg}</p>
                                    </div>
                                    {m.unread > 0 && <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold shrink-0">{m.unread}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    {selectedChat ? (
                        <>
                            <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                                <div className="flex items-center gap-3">
                                    <button className="md:hidden mr-1" onClick={() => setSelectedChat(null)}><X size={20} className="text-slate-400" /></button>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-sm">{selectedChat.avatar}</div>
                                    <div>
                                        <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{selectedChat.user}</h3>
                                        <p className="text-[10px] text-emerald-500 font-bold">Online</p>
                                    </div>
                                </div>
                                <MoreVertical size={20} className="text-slate-400 cursor-pointer" />
                            </div>
                            <div className={`flex-1 p-6 overflow-y-auto space-y-4 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'}`}>
                                <div className="flex justify-start">
                                    <div className={`p-3 rounded-2xl rounded-tl-none max-w-xs text-sm ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-700'} shadow-sm`}>
                                        {selectedChat.msg}
                                        <p className="text-[10px] text-slate-400 mt-1">{selectedChat.time}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-xs text-sm shadow-md">
                                        Thanks for reaching out. I'll check and get back to you shortly.
                                        <p className="text-[10px] text-indigo-200 mt-1">10:35 AM</p>
                                    </div>
                                </div>
                                {(chatMessages[selectedChat.id] || []).map((msg, i) => (
                                    <div key={i} className="flex justify-end">
                                        <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-xs text-sm shadow-md">
                                            {msg.text}
                                            <p className="text-[10px] text-indigo-200 mt-1">{msg.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={`p-4 border-t flex gap-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                                <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className={`flex-1 p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : 'bg-white border-slate-200'}`} />
                                <button onClick={sendMessage} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg"><Send size={18} /></button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className={`p-6 rounded-3xl mb-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}><MessageSquare size={48} className="opacity-30" /></div>
                            <p className="font-bold">Select a conversation</p>
                            <p className="text-sm text-slate-400">Choose a chat to start messaging</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default MessagesView;
