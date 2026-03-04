import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Shield, KeyRound, Trash2, Plus, AlertCircle, Edit3, Image as ImageIcon, MessageSquare, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function Admin() {
  const { role, coreId, coreCreds, updateCoreCred, updateCoreId, addCoreCred, deleteCoreCred, setIslandMessage } = useAppStore();
  const [, setLoc] = useLocation();

  const [bgUrl, setBgUrl] = useState('');
  const [bannerMsg, setBannerMsg] = useState('');

  useEffect(() => {
    setBgUrl(localStorage.getItem('g_bg') || '');
    setBannerMsg(localStorage.getItem('g_msg') || '');
  }, []);

  if (role !== 'admin' && role !== 'core') {
    setLoc('/');
    return null;
  }

  const isMaster = role === 'admin' || (role === 'core' && coreId && coreCreds[coreId]?.power === 'admin_level');

  const saveTheme = () => {
    localStorage.setItem('g_bg', bgUrl);
    setIslandMessage('Theme updated. Please refresh.');
  };

  const saveBanner = () => {
    localStorage.setItem('g_msg', bannerMsg);
    localStorage.setItem('g_msg_s', 'Y');
    setIslandMessage('Banner active. Please refresh.');
  };

  const hideBanner = () => {
    localStorage.setItem('g_msg_s', 'N');
    setIslandMessage('Banner hidden. Please refresh.');
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      
      <div className={`p-6 rounded-[28px] border relative overflow-hidden ${
        isMaster ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30' : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30'
      }`}>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Shield size={100} />
        </div>
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <Shield className={isMaster ? "text-red-400" : "text-blue-400"} size={28} />
          <h2 className={`text-2xl font-extrabold tracking-wide ${isMaster ? "text-red-400" : "text-blue-400"}`}>
            Control Panel
          </h2>
        </div>
        <p className="text-sm text-white/70 relative z-10 font-medium">
          {isMaster ? 'You have Master Control access. You can add/delete IDs, grant admin powers, and customize themes.' : 'You have standard Core access. You can manage contents and edit your own password.'}
        </p>
      </div>

      {isMaster && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6b5cff]/20 rounded-xl">
                <Palette size={20} className="text-[#6b5cff]" /> 
              </div>
              Style Studio
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2 block">Background Image URL</label>
                <input 
                  type="text" 
                  value={bgUrl}
                  onChange={e => setBgUrl(e.target.value)}
                  placeholder="https://..." 
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#6b5cff] outline-none transition-colors"
                />
              </div>
              <button onClick={saveTheme} className="w-full py-3 bg-white/10 hover:bg-[#6b5cff] rounded-xl text-sm font-bold transition-colors">
                Save Theme
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#10b981]/20 rounded-xl">
                <MessageSquare size={20} className="text-[#10b981]" /> 
              </div>
              Announcement Banner
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2 block">Banner Message</label>
                <input 
                  type="text" 
                  value={bannerMsg}
                  onChange={e => setBannerMsg(e.target.value)}
                  placeholder="Welcome to..." 
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#10b981] outline-none transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={saveBanner} className="flex-1 py-3 bg-[#10b981]/20 hover:bg-[#10b981] text-[#10b981] hover:text-white rounded-xl text-sm font-bold transition-colors border border-[#10b981]/30">
                  Update & Show
                </button>
                <button onClick={hideBanner} className="flex-1 py-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-sm font-bold transition-colors border border-red-500/30">
                  Hide Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-[#fca311]/20 rounded-xl">
              <KeyRound size={20} className="text-[#fca311]" /> 
            </div>
            Core Access Management
          </h3>
          {isMaster && (
            <button 
              onClick={() => {
                const id = prompt("Assign new Core ID:");
                if(!id) return;
                const pass = prompt("Set Password:");
                if(!pass) return;
                const isAd = confirm("Grant Admin Level Power? (OK for Yes, Cancel for No)");
                addCoreCred(id, pass, isAd ? 'admin_level' : 'normal');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors text-sm"
            >
              <Plus size={16} /> Issue ID
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {Object.values(coreCreds).map(cred => (
            <div key={cred.id} className="flex items-center justify-between bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  cred.power === 'admin_level' ? 'bg-red-500/20 text-red-400' : 'bg-[#6b5cff]/20 text-[#6b5cff]'
                }`}>
                  {cred.id.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-lg flex items-center gap-3">
                    {cred.id}
                    {cred.power === 'admin_level' && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 text-red-400 text-[10px] rounded-lg font-bold tracking-wider uppercase border border-red-500/20">
                        <AlertCircle size={10} /> Master Lvl
                      </span>
                    )}
                  </p>
                  {isMaster && <p className="text-xs text-white/40 font-mono mt-1 tracking-widest">PWD: <span className="text-white/80">{cred.pass}</span></p>}
                </div>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {isMaster && (
                  <button 
                    onClick={() => {
                      const newId = prompt("New Core ID:", cred.id);
                      if (newId && newId !== cred.id) updateCoreId(cred.id, newId);
                    }}
                    className="p-2 bg-white/5 hover:bg-[#fca311] rounded-xl text-white/70 hover:text-white transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                )}
                {(isMaster || (role === 'core' && coreId === cred.id)) && (
                  <button 
                    onClick={() => {
                      const newPass = prompt("New Password:", cred.pass);
                      if(newPass) updateCoreCred(cred.id, { pass: newPass });
                    }}
                    className="px-4 py-2 bg-[#6b5cff]/20 hover:bg-[#6b5cff]/40 text-[#6b5cff] hover:text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Change Pass
                  </button>
                )}
                {isMaster && role === 'admin' && (
                  <button 
                    onClick={() => {
                      if(confirm("Permanently delete this Core ID?")) deleteCoreCred(cred.id);
                    }}
                    className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-colors border border-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}