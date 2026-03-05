import React, { useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Shield, KeyRound, Trash2, Plus, AlertCircle, Edit3, Image as ImageIcon, MessageSquare, Palette, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function Admin() {
  const { role, coreId, coreCreds, updateCoreCred, updateCoreId, addCoreCred, deleteCoreCred, setIslandMessage, bgUrl, setBgUrl, bannerMsg, setBanner } = useAppStore();
  const [, setLoc] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (role !== 'admin' && role !== 'core') {
    setLoc('/');
    return null;
  }

  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  
  // Classic can edit Announcement Banner
  const canEditBanner = isMaster || power === 'classic';
  // Standard can manage credentials if they are Admin or Master Core
  const canManageIDs = role === 'admin'; // Only Admin can fully manage IDs as per prompt "EDIT OR MODEFI BY ADMIN ONLY"

  // Core can ONLY see their own ID if they aren't master
  const visibleCreds = isMaster ? Object.values(coreCreds) : Object.values(coreCreds).filter(c => c.id === coreId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setBgUrl(result);
        setIslandMessage('Background updated from gallery');
      };
      reader.readAsDataURL(file);
    }
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
          {isMaster ? 'You have Master Control access. You can add/delete IDs, grant power levels, and customize themes.' : `You have ${power} Core access. You can manage your own credentials.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isMaster && (
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6b5cff]/20 rounded-xl">
                <Palette size={20} className="text-[#6b5cff]" /> 
              </div>
              Style Studio
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2 block">Background Source</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={bgUrl.startsWith('data:') ? 'Local Image' : bgUrl}
                    onChange={e => setBgUrl(e.target.value)}
                    placeholder="https://..." 
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#6b5cff] outline-none transition-colors"
                  />
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/5 hover:bg-[#6b5cff] rounded-xl transition-colors border border-white/10">
                    <Upload size={18} />
                  </button>
                </div>
              </div>
              <button onClick={() => setIslandMessage('Theme applied!')} className="w-full py-3 bg-white/10 hover:bg-[#6b5cff] rounded-xl text-sm font-bold transition-colors">
                Apply Theme
              </button>
            </div>
          </div>
        )}

        {canEditBanner && (
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
                  onChange={e => setBanner(e.target.value, true)}
                  placeholder="Welcome to..." 
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#10b981] outline-none transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setBanner(bannerMsg, true)} className="flex-1 py-3 bg-[#10b981]/20 hover:bg-[#10b981] text-[#10b981] hover:text-white rounded-xl text-sm font-bold transition-colors border border-[#10b981]/30">
                  Update & Show
                </button>
                <button onClick={() => setBanner(bannerMsg, false)} className="flex-1 py-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-sm font-bold transition-colors border border-red-500/30">
                  Hide Banner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-[#fca311]/20 rounded-xl">
              <KeyRound size={20} className="text-[#fca311]" /> 
            </div>
            {isMaster ? 'Core Access Management' : 'My Account Credentials'}
          </h3>
          {canManageIDs && (
            <button 
              onClick={() => {
                const id = prompt("Assign new Core ID:");
                if(!id) return;
                const pass = prompt("Set Password:");
                if(!pass) return;
                const pwr = prompt("Power Level (master/basic/classic):", "basic");
                addCoreCred(id, pass, (pwr as any) || 'basic');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors text-sm"
            >
              <Plus size={16} /> Issue ID
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {visibleCreds.map(cred => (
            <div key={cred.id} className="flex items-center justify-between bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  cred.power === 'master' ? 'bg-red-500/20 text-red-400' : 
                  cred.power === 'basic' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/50'
                }`}>
                  {cred.id.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-lg flex items-center gap-3">
                    {cred.id}
                    <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold uppercase tracking-wider border ${
                      cred.power === 'master' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 
                      cred.power === 'basic' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 
                      'bg-white/5 text-white/30 border-white/10'
                    }`}>
                      {cred.power} Lvl
                    </span>
                  </p>
                  {(isMaster || cred.id === coreId) && <p className="text-xs text-white/40 font-mono mt-1 tracking-widest">PWD: <span className="text-white/80">{cred.pass}</span></p>}
                </div>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {canManageIDs && (
                  <>
                    <button 
                      onClick={() => {
                        const newId = prompt("New Core ID:", cred.id);
                        if (newId && newId !== cred.id) updateCoreId(cred.id, newId);
                      }}
                      className="p-2 bg-white/5 hover:bg-[#fca311] rounded-xl text-white/70 hover:text-white transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        const newPass = prompt("New Password:", cred.pass);
                        if(newPass) updateCoreCred(cred.id, { pass: newPass });
                      }}
                      className="px-4 py-2 bg-[#6b5cff]/20 hover:bg-[#6b5cff]/40 text-[#6b5cff] hover:text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        if(confirm("Permanently delete this Core ID?")) deleteCoreCred(cred.id);
                      }}
                      className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-colors border border-red-500/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                {!canManageIDs && cred.id === coreId && (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}