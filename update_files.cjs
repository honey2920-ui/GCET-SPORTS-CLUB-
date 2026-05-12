const fs = require('fs');

// 1. Update Admin.tsx
let adminContent = fs.readFileSync('client/src/pages/Admin.tsx', 'utf-8');

adminContent = adminContent.replace(
  `  const handleGenerateID = () => {`,
  `  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({
    'Voice Chat': true,
    'Video Calls': true,
    'AI Moderation': true,
    'Auto Translation': true,
    'Advanced Analytics': true,
    'Smart Attendance AI': true,
    'Temporary Disappearing Messages': true,
  });

  const toggleFeature = (feature: string, state: boolean) => {
    setEnabledFeatures(prev => ({ ...prev, [feature]: state }));
  };

  const handleGenerateID = () => {`
);

adminContent = adminContent.replace(
  /\{ \['Voice Chat', 'Video Calls', 'AI Moderation', 'Auto Translation', 'Advanced Analytics', 'Smart Attendance AI', 'Temporary Disappearing Messages'\].map\(\(feature\) => \([\s\S]*?\}\)/,
  `{['Voice Chat', 'Video Calls', 'AI Moderation', 'Auto Translation', 'Advanced Analytics', 'Smart Attendance AI', 'Temporary Disappearing Messages'].map((feature) => (
                  <div key={feature} className="flex items-center justify-between bg-slate-800 border border-slate-700 p-4 rounded-xl">
                    <span className="text-white font-bold">{feature}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleFeature(feature, true)}
                        className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors \${enabledFeatures[feature] ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}\`}>
                        Enable
                      </button>
                      <button 
                        onClick={() => toggleFeature(feature, false)}
                        className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors \${!enabledFeatures[feature] ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}\`}>
                        Disable
                      </button>
                    </div>
                  </div>
                ))}`
);

// Fix banner msg in Admin
adminContent = adminContent.replace(
  `                  <label className="text-xs font-bold text-[#2563eb] uppercase mb-1 block">Task Name</label>
                  <input 
                    type="text"
                    value={bannerMsg}
                    onChange={e => setBanner(e.target.value, true)}
                    placeholder="E.g. Football Selection" 
                    className="w-full bg-[#12163f] border border-[#2563eb]/20 rounded-xl px-4 py-3 text-white focus:border-[#2563eb] outline-none transition-all placeholder:text-white/30 shadow-sm font-medium mb-3"
                  />
                  <label className="text-xs font-bold text-[#2563eb] uppercase mb-1 block">Upcoming Date / Status</label>
                  <input 
                    type="text"
                    onChange={e => setBanner(\`\${bannerMsg} | \${e.target.value}\`, true)}
                    placeholder="E.g. Coming Soon or 15th May" 
                    className="w-full bg-[#12163f] border border-[#2563eb]/20 rounded-xl px-4 py-3 text-white focus:border-[#2563eb] outline-none transition-all placeholder:text-white/30 shadow-sm font-medium"
                  />`,
  `                  <label className="text-xs font-bold text-[#2563eb] uppercase mb-1 block">Banner Message</label>
                  <input 
                    type="text"
                    value={bannerMsg}
                    onChange={e => setBanner(e.target.value, true)}
                    placeholder="E.g. Football Selection is Live!" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-[#2563eb] outline-none transition-all placeholder:text-slate-500 shadow-sm font-medium mb-3"
                  />`
);

fs.writeFileSync('client/src/pages/Admin.tsx', adminContent);

// 2. Update Layout.tsx
let layoutContent = fs.readFileSync('client/src/components/Layout.tsx', 'utf-8');
layoutContent = layoutContent.replace(
  /\{bannerVisible && bannerMsg && \([\s\S]*?\}\)/,
  `{bannerVisible && bannerMsg && (
        <div className="fixed top-0 left-0 w-full z-50 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-900 border-b border-slate-700 py-2.5 px-4 shadow-sm flex justify-center items-center gap-3">
            <div className="flex items-center gap-2 bg-[#2563eb]/10 px-2 py-0.5 rounded text-[#2563eb] text-[10px] font-bold uppercase tracking-widest border border-[#2563eb]/20 shrink-0">
               <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
               UPDATE
            </div>
            <span className="text-slate-200 text-sm font-medium tracking-wide truncate max-w-4xl">{bannerMsg}</span>
          </div>
        </div>
      )}`
);
fs.writeFileSync('client/src/components/Layout.tsx', layoutContent);

// 3. Update Home.tsx
let homeContent = fs.readFileSync('client/src/pages/Home.tsx', 'utf-8');
homeContent = homeContent.replace(
  /\{bannerVisible && \([\s\S]*?\}\)/,
  `{bannerVisible && (
        <div className="bg-slate-800 border border-slate-700 p-4 md:p-5 rounded-[20px] shadow-sm relative overflow-hidden flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-[#2563eb]/10 flex items-center justify-center border border-[#2563eb]/20 shrink-0">
                <span className="text-[#2563eb] text-xl">📢</span>
             </div>
             <div>
                <p className="text-[10px] font-bold text-[#2563eb] uppercase tracking-widest mb-0.5">Important Update</p>
                <p className="text-white font-medium">{bannerMsg}</p>
             </div>
          </div>
        </div>
      )}`
);
fs.writeFileSync('client/src/pages/Home.tsx', homeContent);

// 4. Update Messages.tsx
const messagesContent = `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Search, Send, User, Image as ImageIcon, Video, ArrowLeft, MoreVertical, Smile } from 'lucide-react';

export default function Messages() {
  const { role, coreId, adminLevel } = useAppStore();
  const [activeTab, setActiveTab] = useState<'student' | 'core'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState<{text: string, sender: 'me'|'them', time: string, isGif?: boolean, isImg?: boolean, isVid?: boolean}[]>([
    { text: "Hey there!", sender: 'them', time: '10:00 AM' },
    { text: "Hello! How can I help you today?", sender: 'me', time: '10:05 AM' }
  ]);

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

  const dummyContacts = [
    { id: '1', name: 'Alex Johnson', role: 'student', preview: 'See you tomorrow!', time: '2m ago' },
    { id: '2', name: 'Maria Garcia', role: 'student', preview: 'Thanks for the info.', time: '1h ago' },
    { id: '3', name: 'James Smith', role: 'core', preview: 'I will handle the equipment.', time: 'Yesterday' },
    { id: '4', name: 'Linda Williams', role: 'core', preview: 'Meeting at 5 PM.', time: 'Yesterday' },
  ];

  const filteredContacts = dummyContacts.filter(c => c.role === activeTab && c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSend = (text = msgInput, isGif = false, isImg = false, isVid = false) => {
    if (!text.trim() && !isGif && !isImg && !isVid) return;
    setMessages([...messages, { text, sender: 'me', time: 'Just now', isGif, isImg, isVid }]);
    setMsgInput('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24 h-full flex flex-col">
      
      {!selectedContact && (
        <div className="bg-[#12163f] p-6 rounded-[28px] border border-[#2563eb]/20 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
            <Send size={100} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wide text-white mb-2 relative z-10 flex items-center gap-3">
            <Send size={24} className="text-[#2563eb]" />
            Private Messages
          </h2>
          <p className="text-[#b0b0cc] text-sm relative z-10">
            Secure communication channel.
            {isSuperAdmin && <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] uppercase font-bold tracking-widest border border-red-500/30">Super Admin Access</span>}
          </p>
        </div>
      )}

      <div className="bg-[#1e293b] border border-slate-700 rounded-[28px] overflow-hidden shadow-sm flex flex-col flex-1 min-h-[500px]">
        
        {!selectedContact ? (
          <>
            {isCoreOrAdmin && (
              <div className="flex p-2 gap-2 bg-slate-800 border-b border-slate-700 shrink-0">
                <button
                  onClick={() => setActiveTab('student')}
                  className={\`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all \${
                    activeTab === 'student' ? 'bg-slate-700 shadow-sm text-white border border-slate-600' : 'text-slate-400 hover:bg-slate-700/50'
                  }\`}
                >
                  Student Chat
                </button>
                <button
                  onClick={() => setActiveTab('core')}
                  className={\`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all \${
                    activeTab === 'core' ? 'bg-[#2563eb] shadow-sm text-white' : 'text-slate-400 hover:bg-slate-700/50'
                  }\`}
                >
                  Core Team Chat
                </button>
              </div>
            )}

            <div className="p-4 border-b border-slate-700 bg-[#1e293b] shrink-0">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={activeTab === 'student' ? "Search by Name, Roll No..." : "Search Core IDs..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[#2563eb] outline-none transition-colors placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f172a]/50 min-h-[350px]">
              {filteredContacts.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                    <User size={24} className="text-slate-500" />
                  </div>
                  <h3 className="text-slate-200 font-bold mb-1">No contacts found</h3>
                  <p className="text-slate-500 text-sm">Try a different search term.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/50">
                  {filteredContacts.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedContact(c)}
                      className="p-4 flex items-center gap-4 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex flex-col items-center justify-center font-bold text-white shadow-inner">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-slate-200 truncate">{c.name}</h4>
                          <span className="text-[10px] text-slate-500">{c.time}</span>
                        </div>
                        <p className="text-sm text-slate-400 truncate">{c.preview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full bg-[#0f172a] min-h-[500px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedContact(null)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#3b82f6] flex items-center justify-center font-bold text-white shadow-sm">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 leading-tight">{selectedContact.name}</h4>
                  <span className="text-[10px] text-green-400 font-bold tracking-widest uppercase">Online</span>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={\`flex flex-col \${m.sender === 'me' ? 'items-end' : 'items-start'}\`}>
                  <div className={\`max-w-[80%] rounded-2xl p-3 \${m.sender === 'me' ? 'bg-[#2563eb] text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'}\`}>
                    {m.isGif && <div className="text-2xl mb-1">🎭 [GIF sent]</div>}
                    {m.isImg && <div className="text-2xl mb-1">📸 [Photo sent]</div>}
                    {m.isVid && <div className="text-2xl mb-1">🎥 [Video sent]</div>}
                    {m.text && <p className="text-sm">{m.text}</p>}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 mx-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-slate-800 border-t border-slate-700 flex items-center gap-2 shrink-0">
              <button 
                onClick={() => handleSend('🖼️ Photo', false, true, false)}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors" title="Send Photo">
                <ImageIcon size={20} />
              </button>
              <button 
                onClick={() => handleSend('🎞️ Video', false, false, true)}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors hidden sm:block" title="Send Video">
                <Video size={20} />
              </button>
              <button 
                onClick={() => handleSend('😜 GIF', true, false, false)}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors" title="Send GIF">
                <Smile size={20} />
              </button>
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-full pl-4 pr-4 py-3 text-sm text-white focus:border-[#2563eb] outline-none transition-colors placeholder:text-slate-500"
                />
              </div>
              
              <button 
                onClick={() => handleSend()}
                className={\`p-3 rounded-full transition-colors flex items-center justify-center \${msgInput.trim() ? 'bg-[#2563eb] text-white shadow-sm' : 'bg-slate-700 text-slate-400'}\`}
              >
                <Send size={18} className={msgInput.trim() ? 'ml-0.5' : ''} />
              </button>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
\`;
fs.writeFileSync('client/src/pages/Messages.tsx', messagesContent);
console.log('Update Complete!');
