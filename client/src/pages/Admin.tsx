import React, { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { getFaceEmoji } from '@/lib/utils';
import { Shield, KeyRound, Trash2, Plus, Palette, Upload, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function Admin() {
  const { role, coreId, coreCreds, updateCoreCred, addCoreCred, deleteCoreCred, setIslandMessage, bgUrl, setBgUrl, themeColor, setThemeColor, fontFamily, setFontFamily, tabShape, setTabShape, tabStyles, setTabStyle, bannerMsg, setBanner, setAdminPass, logs, maintenanceMode, maintenanceMsg, setMaintenance, permissionsGranted, setPermissionsGranted, adminLevel, userGallery, deleteUserImage } = useAppStore();
  const [, setLoc] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newName, setNewName] = useState('');
  const [tab, setTab] = useState<'settings' | 'users' | 'logs'>('users');

  if (role !== 'admin' && role !== 'core') {
    setLoc('/');
    return null;
  }

  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  const isSuperAdmin = role === 'admin' && adminLevel === 'super';
  
  const canEditBanner = isMaster || power === 'classic';
  const canManageIDs = isSuperAdmin;

  const visibleCreds = isSuperAdmin ? Object.values(coreCreds) : Object.values(coreCreds).filter(c => c.id === coreId);

  const posts = [
    "President", "Vice President", "Secretary", "Coordinator", "Sports Lead", 
    "Core Head", "Equipment Head", "Graphic Head", "Reels & VFX Head", 
    "Treasurer Head", "Volunteer Head", "Documentation Head", "Logistics Head", "Member"
  ];
  const levels = ["Master Core", "Classic Core", "Basic Core"];

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

  const mapPowerToLevel = (power: string) => {
    if (power === 'master') return 'Master Core';
    if (power === 'classic') return 'Classic Core';
    return 'Basic Core';
  };

  const mapLevelToPower = (level: string) => {
    if (level === 'Master Core') return 'master';
    if (level === 'Classic Core') return 'classic';
    return 'basic';
  };

  const handleGenerateID = () => {
    if(!newName.trim()) return;
    // format as name.surname matching image "rishi.bhut" if there are spaces
    const parts = newName.trim().split(' ');
    let id = parts[0].toLowerCase();
    if(parts.length > 1) {
      id += '.' + parts[1].toLowerCase();
    } else {
      id += '.' + Math.floor(Math.random()*100);
    }
    const pass = "CORE2026";
    addCoreCred(id, pass, 'basic', newName.trim(), 'Member');
    setNewName('');
    setIslandMessage(`ID Generated: ${id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-20">
      
      <div className={`p-6 rounded-[28px] border relative overflow-hidden ${
        isMaster ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
          <Shield size={100} />
        </div>
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <Shield className={isMaster ? "text-red-500" : "text-blue-500"} size={28} />
          <h2 className={`text-2xl font-extrabold tracking-wide ${isMaster ? "text-red-600" : "text-blue-600"}`}>
            Control Panel
          </h2>
        </div>
        <p className="text-sm text-slate-600 relative z-10 font-medium">
          {isMaster ? 'You have Master Control access. You can add/delete IDs, grant power levels, and customize themes.' : `You have ${power} Core access. You can manage your own credentials.`}
        </p>
      </div>

      {role === 'admin' && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-[28px] p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-3 mb-2 text-slate-900">
              <div className="p-2 bg-red-100 rounded-xl">
                <KeyRound size={20} className="text-red-600" /> 
              </div>
              Admin Security
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const p = prompt("Enter new Normal Admin Password:");
                  if(p) setAdminPass(p);
                }}
                className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-colors border border-slate-200"
              >
                Change Normal Password
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold flex items-center gap-3 mb-2 text-slate-900">
              🚧 Maintenance Mode
            </h3>
            <p className="text-sm text-slate-500 mb-4">Toggle maintenance mode for all users except admins.</p>
            
            <div className="space-y-4 p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <textarea 
                value={maintenanceMsg}
                onChange={e => setMaintenance(maintenanceMode, e.target.value)}
                className="w-full bg-white border border-amber-200 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-amber-900"
                rows={2}
                placeholder="Maintenance message..."
              />
              <button 
                onClick={() => setMaintenance(!maintenanceMode, maintenanceMsg)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-colors border w-full md:w-auto ${maintenanceMode ? 'bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300' : 'bg-white hover:bg-amber-50 text-amber-600 border-amber-200'}`}
              >
                {maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
              </button>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold flex items-center gap-3 mb-2 text-slate-900">
                User Gallery Data
              </h3>
              <p className="text-sm text-slate-500 mb-4">View and manage photos shared by users. Only visible to Super Admin.</p>
              
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                {userGallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {userGallery.map((img) => (
                      <div key={img.id} className="relative group">
                        <img src={img.dataUrl} className="w-full h-32 object-cover rounded-lg border border-slate-200" alt="User upload" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-between p-2">
                           <p className="text-[10px] text-white font-mono">{img.uploaderRole} {img.uploaderId ? `[${img.uploaderId}]` : ''}</p>
                           <button onClick={() => deleteUserImage(img.id)} className="self-end p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md">
                             <Trash2 size={12} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic text-center py-4">No images uploaded by users yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isMaster && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-[28px] p-6">
            <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button 
                onClick={() => setTab('settings')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${tab === 'settings' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'}`}
              >
                <Palette size={14} /> Portal Settings
              </button>
              <button 
                onClick={() => setTab('users')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${tab === 'users' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'}`}
              >
                <Shield size={14} /> Core Members
              </button>
              {isMaster && (
                <button 
                  onClick={() => setTab('logs')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${tab === 'logs' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'}`}
                >
                  <MessageSquare size={14} /> System Logs
                </button>
              )}
            </div>
            
            {tab === 'settings' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">Theme Color</label>
                  <div className="flex gap-2 mb-4 flex-wrap">
                  {['#2563eb', '#10b981', '#fca311', '#ef4444', '#ec4899', '#6b5cff', '#8b5cf6', '#d946ef', '#14b8a6', '#f59e0b', '#0f172a'].map(color => (
                    <button 
                      key={color} 
                      onClick={() => setThemeColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${themeColor === color ? 'border-slate-800 scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0 p-0" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">Font Family</label>
                <select 
                  value={fontFamily} 
                  onChange={e => setFontFamily(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#2563eb] outline-none transition-colors text-slate-900 appearance-none"
                >
                  <option value="Inter, sans-serif">Inter (Clean Sans)</option>
                  <option value="Outfit, sans-serif">Outfit (Modern Sans)</option>
                  <option value="'Space Grotesk', sans-serif">Space Grotesk (Tech Sans)</option>
                  <option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
                  <option value="'JetBrains Mono', monospace">JetBrains Mono (Code/Tech)</option>
                  <option value="'Comic Sans MS', serif">Comic Sans (Playful)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">Tab Shape</label>
                <select 
                  value={tabShape} 
                  onChange={e => setTabShape(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#2563eb] outline-none transition-colors text-slate-900 appearance-none"
                >
                  <option value="pill">Pill (Default)</option>
                  <option value="rounded">Rounded Box</option>
                  <option value="square">Square</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">Individual Tab Styles</label>
                <div className="space-y-3">
                  {['home', 'events', 'join', 'admin'].map(t => (
                    <div key={t} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold uppercase w-14 text-slate-700">{t}</span>
                      <input 
                        type="color" 
                        value={tabStyles?.[t]?.color || '#6b5cff'} 
                        onChange={e => setTabStyle(t, { color: e.target.value })} 
                        className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0 p-0 shrink-0" 
                      />
                      <input 
                        type="range" 
                        min="0.8" max="1.5" step="0.1" 
                        value={tabStyles?.[t]?.size || 1}
                        onChange={e => setTabStyle(t, { size: parseFloat(e.target.value) })}
                        className="flex-1 accent-[#2563eb]"
                      />
                      <span className="text-[10px] text-slate-500 font-mono font-bold w-6">{tabStyles?.[t]?.size || 1}x</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">Background Source</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={bgUrl.startsWith('data:') ? 'Local Image' : bgUrl}
                    onChange={e => setBgUrl(e.target.value)}
                    placeholder="https://..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#2563eb] outline-none transition-colors text-slate-900"
                  />
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-100 hover:bg-[#2563eb] hover:text-white text-slate-500 rounded-xl transition-colors border border-slate-200">
                    <Upload size={18} />
                  </button>
                </div>
              </div>
                <button onClick={() => setIslandMessage('Theme applied!')} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors mt-6 shadow-sm">
                  Apply Theme
                </button>
              </div>
            )}
            
            {tab === 'logs' && isMaster && (
              <div className="animate-in fade-in h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-[#2563eb]">{log.user}</span>
                        <span className="text-[10px] text-slate-400">{log.date}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{log.action}</span>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-center text-slate-400 text-sm py-8 font-medium">No logs available</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {canEditBanner && (
          <div className="bg-[#0b102a] border border-[#2563eb]/30 rounded-[28px] p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <MessageSquare size={120} className="text-[#2563eb]" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold flex items-center gap-3 mb-2 text-white tracking-wide">
                Announcement Banner
              </h3>
              <p className="text-[#2563eb] text-sm font-bold tracking-wider uppercase mb-8">Broadcast message to all users</p>
              
              <div className="space-y-6">
                <div>
                  <textarea 
                    value={bannerMsg}
                    onChange={e => setBanner(e.target.value, true)}
                    placeholder="Enter announcement message..." 
                    rows={3}
                    className="w-full bg-[#12163f] border border-[#2563eb]/20 rounded-2xl px-5 py-4 text-white focus:border-[#2563eb] outline-none transition-all placeholder:text-white/30 shadow-sm resize-none font-medium"
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setBanner(bannerMsg, true)} className="flex-[2] py-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl font-bold transition-all shadow-sm active:scale-95 text-lg">
                    Update & Show Banner
                  </button>
                  <button onClick={() => setBanner(bannerMsg, false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl font-bold transition-all border border-white/10 active:scale-95">
                    Hide Banner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {(tab === 'users' || !isMaster) && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-[28px] p-4 md:p-8 overflow-hidden animate-in fade-in">
          
          {canManageIDs && (
            <div className="mb-8 bg-slate-50 p-4 md:p-6 rounded-[24px] border border-slate-200">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">ADD NEW CORE MEMBER</h4>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1 w-full">
                <input 
                  type="text" 
                  placeholder="Full Name (e.g. John Doe)" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-slate-900 text-sm focus:border-[#2563eb] outline-none transition-colors"
                />
                <p className="text-[10px] text-slate-500 mt-2 italic">* ID will be auto-generated as: name.surname</p>
              </div>
              <button 
                onClick={handleGenerateID}
                className="w-full md:w-auto px-6 py-4 bg-[#10b981] hover:bg-[#0da06f] text-white rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm whitespace-nowrap shadow-sm"
              >
                <Plus size={16} /> GENERATE ID
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-4 p-5 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50">
            <div className="col-span-5">NAME & ID</div>
            <div className="col-span-5">ROLE & POST</div>
            <div className="col-span-2 text-right">ACTIONS</div>
          </div>

          <div className="divide-y divide-slate-100 h-[300px] overflow-y-auto custom-scrollbar">
            {visibleCreds.map(cred => (
              <div key={cred.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-5 items-start md:items-center hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0">
                <div className="col-span-5 flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2">
                    <input 
                      disabled={!canManageIDs}
                      type="text"
                      value={cred.name || cred.id}
                      onChange={(e) => updateCoreCred(cred.id, { name: e.target.value })}
                      className="font-bold text-[15px] text-slate-900 leading-tight bg-transparent border-none outline-none focus:border-b focus:border-[#2563eb]/50 w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      disabled={!canManageIDs}
                      type="text"
                      value={cred.id}
                      onChange={(e) => updateCoreCred(cred.id, { id: e.target.value })}
                      className="text-[13px] text-slate-500 mt-0.5 bg-transparent border-none outline-none focus:border-b focus:border-[#2563eb]/50 w-full"
                    />
                  </div>
                  {(isMaster || cred.id === coreId) && (
                     <p className="text-[10px] text-slate-400 mt-1 font-mono hover:text-[#2563eb] transition-colors">PWD: {cred.pass}</p>
                  )}
                </div>
                
                <div className="col-span-5 flex flex-col gap-2 w-full mt-2 md:mt-0">
                  <div className="relative inline-block w-fit">
                    <select 
                      disabled={!canManageIDs}
                      value={mapPowerToLevel(cred.power)}
                      onChange={(e) => updateCoreCred(cred.id, { power: mapLevelToPower(e.target.value) as any })}
                      className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-700 appearance-none outline-none focus:border-[#2563eb] disabled:opacity-70 pr-8 shadow-sm cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                      {levels.map(l => <option key={l} value={l} className="bg-white text-slate-900">{l}</option>)}
                    </select>
                    {canManageIDs && <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">▼</div>}
                  </div>
                  <div className="relative inline-block w-fit mt-1">
                    <select 
                      disabled={!canManageIDs}
                      value={cred.post || "Member"}
                      onChange={(e) => updateCoreCred(cred.id, { post: e.target.value })}
                      className="bg-transparent border-none text-[#2563eb] text-[13px] font-medium appearance-none outline-none cursor-pointer pr-6 hover:text-[#1d4ed8] transition-colors"
                    >
                      {posts.map(p => <option key={p} value={p} className="bg-white text-slate-900">{p}</option>)}
                    </select>
                    {canManageIDs && <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#2563eb] text-[10px]">▼</div>}
                  </div>
                </div>

                <div className="col-span-2 flex justify-end items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                  {(canManageIDs || cred.id === coreId) && (
                     <button 
                     onClick={() => {
                       const newPass = prompt("New Password:", cred.pass);
                       if(newPass) updateCoreCred(cred.id, { pass: newPass });
                     }}
                     className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-bold transition-colors border border-slate-200"
                   >
                     Pass
                   </button>
                  )}
                  {canManageIDs && (
                    <button 
                      onClick={() => {
                        if(confirm(`Permanently delete ${cred.id}?`)) deleteCoreCred(cred.id);
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </motion.div>
  );
}