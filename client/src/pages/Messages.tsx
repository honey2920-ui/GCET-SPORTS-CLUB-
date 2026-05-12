import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Search, Send, ShieldAlert, User } from 'lucide-react';

export default function Messages() {
  const { role, coreId, adminLevel } = useAppStore();
  const [activeTab, setActiveTab] = useState<'student' | 'core'>('student');
  const [searchQuery, setSearchQuery] = useState('');

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-200 mb-2">Login Required</h2>
        <p className="text-slate-400 max-w-sm">You need to log in to access the messaging system.</p>
      </div>
    );
  }

  const isSuperAdmin = role === 'admin' && adminLevel === 'super';
  const isCoreOrAdmin = role === 'core' || role === 'admin';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
      
      <div className="bg-[#12163f] p-6 rounded-[28px] border border-[#2563eb]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
          <Send size={100} className="text-white" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-wide text-white mb-2 relative z-10 flex items-center gap-3">
          <Send size={24} className="text-[#2563eb]" />
          Private Messages
        </h2>
        <p className="text-[#b0b0cc] text-sm relative z-10">
          Secure communication channel.
          {isSuperAdmin && <span className="ml-2 px-2 py-0.5 bg-red-500/100/20 text-red-400 rounded text-[10px] uppercase font-bold tracking-widest border border-red-500/30">Super Admin Access</span>}
        </p>
      </div>

      <div className="bg-[#1e293b] border border-slate-700 rounded-[28px] overflow-hidden shadow-sm flex flex-col h-[60vh] min-h-[500px]">
        {isCoreOrAdmin && (
          <div className="flex p-2 gap-2 bg-slate-800 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'student' ? 'bg-slate-700 shadow-sm text-white border border-slate-600' : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              Student Chat
            </button>
            <button
              onClick={() => setActiveTab('core')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'core' ? 'bg-[#2563eb] shadow-sm text-white' : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              Core Team Chat
            </button>
          </div>
        )}

        <div className="p-4 border-b border-slate-700 bg-[#1e293b]">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={activeTab === 'student' ? "Search by Name, Roll No, Enrollment No..." : "Search Core IDs..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[#2563eb] outline-none transition-colors placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#0f172a]/50 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
            <Send size={24} className="text-slate-400" />
          </div>
          <h3 className="text-slate-200 font-bold mb-1">Select a contact to start chatting</h3>
          <p className="text-slate-400 text-sm max-w-[250px]">
            {activeTab === 'student' 
              ? "Search for a student using their roll number or name." 
              : "Search for core members to discuss internal matters."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}