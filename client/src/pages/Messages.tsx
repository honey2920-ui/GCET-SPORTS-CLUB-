import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Search, Send, ShieldAlert, User, Image as ImageIcon, Film, FileCode2, Paperclip, X, MessageSquare } from 'lucide-react';

export default function Messages() {
  const { role, coreId, adminLevel, messages, sendMessage, coreCreds, mentors, coreMembers, featureStates } = useAppStore();
  const [activeTab, setActiveTab] = useState<'student' | 'core'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<{ url: string, type: 'image' | 'video' | 'gif' } | null>(null);
  const [disappearingMode, setDisappearingMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  if (!role || (role === 'admin' && adminLevel !== 'super')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <ShieldAlert size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-3 tracking-wide">Access Denied</h2>
        <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
          The messaging system is restricted. Only <strong className="text-slate-200">Super Admins</strong>, <strong className="text-slate-200">Core Members</strong>, and <strong className="text-slate-200">Students</strong> can access this secure channel. Normal Admins do not have clearance.
        </p>
      </div>
    );
  }

  const isSuperAdmin = role === 'admin' && adminLevel === 'super';
  const isCoreOrAdmin = role === 'core' || role === 'admin';
  const currentUserIdentifier = role === 'admin' ? 'Admin' : (role === 'core' ? `Core [${coreId}]` : 'Student');

  const filteredMessages = messages.filter(m => m.targetTab === activeTab);

  const handleSend = () => {
    if (!inputText.trim() && !mediaPreview) return;
    
    sendMessage({
      senderId: role === 'core' ? (coreId || 'unknown') : role,
      senderName: currentUserIdentifier,
      senderRole: role,
      text: inputText,
      mediaUrl: mediaPreview?.url,
      mediaType: mediaPreview?.type,
      targetTab: activeTab
    });
    
    setInputText('');
    setMediaPreview(null);
    setShowAttachMenu(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'gif') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setMediaPreview({ url: result, type });
        setShowAttachMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMessageContent = (msg: any) => {
    return (
      <div className="flex flex-col gap-2">
        {msg.text && <p className="text-sm">{msg.text}</p>}
        {msg.mediaUrl && (
          <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-w-[240px]">
            {msg.mediaType === 'image' || msg.mediaType === 'gif' ? (
              <img src={msg.mediaUrl} alt="Attachment" className="w-full h-auto object-cover" />
            ) : msg.mediaType === 'video' ? (
              <video src={msg.mediaUrl} controls className="w-full h-auto" />
            ) : null}
          </div>
        )}
        {featureStates['Auto Translation'] && !msg.senderId.includes(coreId || '') && (
          <button className="text-[9px] text-[#2563eb] self-start mt-1 hover:underline font-bold uppercase tracking-wider">
            Translate Message
          </button>
        )}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
      
      <div className="bg-[#12163f] p-6 rounded-[28px] border border-[#2563eb]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
          <Send size={100} className="text-white" />
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-2xl font-extrabold tracking-wide text-white mb-2 flex items-center gap-3">
              <Send size={24} className="text-[#2563eb]" />
              Private Messages
            </h2>
            <p className="text-[#b0b0cc] text-sm">
              Secure communication channel.
              {isSuperAdmin && <span className="ml-2 px-2 py-0.5 bg-red-500/100/20 text-red-400 rounded text-[10px] uppercase font-bold tracking-widest border border-red-500/30">Super Admin Access</span>}
            </p>
          </div>
          <div className="flex gap-2">
            {featureStates['Voice Chat'] && (
              <button className="p-2.5 bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/30 rounded-xl transition-colors border border-[#2563eb]/30 shadow-sm" title="Voice Chat">
                <span className="text-lg">🎙️</span>
              </button>
            )}
            {featureStates['Video Calls'] && (
              <button className="p-2.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl transition-colors border border-emerald-500/30 shadow-sm" title="Video Call">
                <span className="text-lg">📹</span>
              </button>
            )}
          </div>
        </div>
        
        {featureStates['AI Moderation'] && (
          <div className="mt-4 relative z-10 flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 p-2 rounded-lg w-max">
            <ShieldAlert size={14} className="text-[#2563eb]" />
            <span className="text-[10px] font-bold text-[#2563eb] uppercase tracking-widest">AI Moderation Active</span>
          </div>
        )}
      </div>

      <div className="bg-[#1e293b] border border-slate-700 rounded-[28px] overflow-hidden shadow-sm flex flex-col h-[70vh] min-h-[550px]">
        {isCoreOrAdmin && (
          <div className="flex p-2 gap-2 bg-slate-800 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'student' ? 'bg-slate-700 shadow-sm text-white border border-slate-600' : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              General Chat
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

        <div className="flex-1 overflow-y-auto bg-[#0f172a]/50 p-4 space-y-4 custom-scrollbar">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
              <MessageSquare size={48} className="mb-4 text-slate-400" />
              <p className="text-sm font-medium text-slate-400">No messages yet.</p>
              <p className="text-xs text-slate-500 mt-1">Start the conversation!</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isMine = msg.senderId === (role === 'core' ? coreId : role);
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl p-3 ${isMine ? 'bg-[#2563eb] text-white rounded-br-sm' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm'}`}>
                    <div className="flex justify-between items-end gap-3 mb-1">
                      <span className={`text-[10px] font-bold ${isMine ? 'text-blue-200' : 'text-slate-400'}`}>
                        {msg.senderName} {msg.senderRole === 'admin' ? '👑' : ''}
                      </span>
                      <span className={`text-[9px] ${isMine ? 'text-blue-300' : 'text-slate-500'}`}>{msg.timestamp}</span>
                    </div>
                    {renderMessageContent(msg)}
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {mediaPreview && (
          <div className="p-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-black/50 overflow-hidden border border-slate-600 flex items-center justify-center">
                 {mediaPreview.type === 'image' || mediaPreview.type === 'gif' ? (
                   <img src={mediaPreview.url} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <Film size={20} className="text-slate-400" />
                 )}
              </div>
              <span className="text-xs text-slate-300 font-medium">Media attached</span>
            </div>
            <button onClick={() => setMediaPreview(null)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full transition-colors">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="p-3 border-t border-slate-700 bg-slate-900 relative">
          
          <AnimatePresence>
            {showAttachMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-[70px] left-4 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 flex flex-col gap-1 z-20"
              >
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors text-left">
                  <ImageIcon size={16} className="text-blue-400" /> Photo / GIF
                </button>
                <label className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors text-left cursor-pointer">
                  <Film size={16} className="text-purple-400" /> Video
                  <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'video')} />
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.gif" onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(e, file.type.includes('gif') ? 'gif' : 'image');
          }} />

          {featureStates['Temporary Disappearing Messages'] && (
            <div className="flex justify-end mb-2 relative z-10">
              <button 
                onClick={() => setDisappearingMode(!disappearingMode)}
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                  disappearingMode 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-300'
                }`}
              >
                {disappearingMode ? '🔥 Disappearing Mode: ON' : 'Disappearing Mode: OFF'}
              </button>
            </div>
          )}

          <div className="flex items-end gap-2 relative z-10">
            <button 
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`p-3 rounded-xl transition-colors border ${showAttachMenu ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              <Paperclip size={20} />
            </button>
            <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl focus-within:border-[#2563eb] transition-colors flex items-center min-h-[46px]">
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                className="w-full bg-transparent border-none text-white text-sm px-4 py-3 outline-none resize-none max-h-[120px] custom-scrollbar"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={!inputText.trim() && !mediaPreview}
              className="p-3 bg-[#2563eb] disabled:bg-[#2563eb]/50 disabled:cursor-not-allowed hover:bg-[#1d4ed8] text-white rounded-xl transition-colors shrink-0 shadow-sm"
            >
              <Send size={20} className={inputText.trim() || mediaPreview ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}