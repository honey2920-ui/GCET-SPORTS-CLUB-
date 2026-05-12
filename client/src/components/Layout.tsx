import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '@/lib/store';
import { DynamicIsland } from './DynamicIsland';
import { LoginModal } from './LoginModal';
import { LogOut, Home, Trophy, UserPlus, ShieldAlert, MessageCircle } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [loc, setLoc] = useLocation();
  const { role, coreId, logout, bgUrl, themeColor, fontFamily, tabShape, tabStyles, maintenanceMode, maintenanceMsg, maintenanceGif, bannerVisible, bannerMsg, adminLevel } = useAppStore();

  useEffect(() => {
    const container = document.getElementById('falling-container');
    if (!container) return;
    const emojis = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🏸', '🏓', '🏏', '🏑', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🎽', '🎿', '🛷', '🥌', '🎯', '🎱', '🎳', '🪁'];
    
    let interval = setInterval(() => {
      const el = document.createElement('div');
      el.className = 'falling-item';
      el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${Math.random() * 100}vw`;
      el.style.animationDuration = `${Math.random() * 4 + 6}s`; // 6s to 10s fall duration
      el.style.fontSize = `${Math.random() * 16 + 16}px`; // 16px to 32px size
      container.appendChild(el);
      setTimeout(() => el.remove(), 10000);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const isStaff = role === 'admin' || role === 'core';

  if (maintenanceMode && role && role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0b102a] flex flex-col items-center justify-center p-6 text-center text-white">
        <img 
          src={maintenanceGif} 
          alt="Maintenance" 
          className="w-48 h-48 object-cover rounded-3xl mb-8 shadow-[0_0_40px_rgba(239,68,68,0.3)] border-4 border-red-500/50"
        />
        <h1 className="text-4xl font-black text-red-500 mb-4 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
          UNDER MAINTENANCE
        </h1>
        <p className="text-red-400 text-lg max-w-md leading-relaxed font-bold bg-red-500/100/10 p-4 rounded-xl border border-red-500/30">
          {maintenanceMsg}
        </p>
        <button onClick={logout} className="mt-8 bg-red-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-red-500/100 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:-translate-y-1">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-24 relative overflow-hidden print-bg-[#1e293b]"
      style={{
        fontFamily: fontFamily || 'Inter, sans-serif',
        ...(bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {})
      }}
    >
      {/* Dynamic Theme Color override */}
      <style>{`
        :root {
          --primary: ${themeColor || '#6b5cff'};
        }
        .text-\\[\\#6b5cff\\] { color: var(--primary) !important; }
        .bg-\\[\\#6b5cff\\] { background-color: var(--primary) !important; }
        .border-\\[\\#6b5cff\\] { border-color: var(--primary) !important; }
        .from-\\[\\#6b5cff\\] { --tw-gradient-from: var(--primary) !important; }
        .to-\\[\\#8073ff\\] { --tw-gradient-to: var(--primary) !important; }
        .hover\\:bg-\\[\\#8073ff\\]:hover { background-color: var(--primary) !important; opacity: 0.9; }
        .hover\\:bg-\\[\\#6b5cff\\]:hover { background-color: var(--primary) !important; }
        .hover\\:text-\\[\\#6b5cff\\]:hover { color: var(--primary) !important; }
        .hover\\:border-\\[\\#6b5cff\\]:hover { border-color: var(--primary) !important; }
        .focus\\:border-\\[\\#6b5cff\\]:focus { border-color: var(--primary) !important; }
        .shadow-\\[0_0_20px_rgba\\(107\\,92\\,255\\,0\\.4\\)\\] { box-shadow: 0 0 20px var(--primary) !important; opacity: 0.8; }
      `}</style>
      
      <div id="falling-container" className="fixed inset-0 pointer-events-none z-0 opacity-[0.25] print:hidden" />
      <div className="print:hidden"><DynamicIsland /></div>
      <div className="print:hidden"><LoginModal /></div>

      {bannerVisible && bannerMsg && (
        <div className="fixed top-0 left-0 w-full z-50 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-[#12163f]/95 backdrop-blur-md border-b border-[#2563eb]/30 p-3 shadow-[0_4px_20px_rgba(37,99,235,0.15)] flex justify-center items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="text-white text-sm font-bold tracking-wide flex-1 text-center truncate max-w-4xl">{bannerMsg}</span>
          </div>
        </div>
      )}

      <div className={`p-4 md:p-5 flex justify-between items-center relative z-10 w-full max-w-4xl mx-auto print:hidden ${bannerVisible && bannerMsg ? 'mt-12' : ''}`}>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-[#6b5cff] to-[#9f7aea] rounded-full flex items-center justify-center font-bold text-base md:text-lg shadow-[0_0_20px_rgba(107,92,255,0.4)] border-2 border-white/10 shrink-0">
            {role ? role.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="min-w-0">
            <p className="text-[9px] md:text-[10px] text-[#b0b0cc] uppercase tracking-wider font-semibold mb-0.5">Signed in as</p>
            <p className="font-bold text-sm md:text-base tracking-wide truncate">
              {role === 'admin' ? 'ADMIN MASTER' : role === 'core' ? `CORE [${coreId}]` : 'STUDENT GUEST'}
            </p>
          </div>
        </div>
        {role && (
          <button onClick={logout} className="bg-[#1e293b]/5 border border-white/10 p-2.5 md:p-3 rounded-xl md:rounded-2xl hover:bg-[#1e293b]/10 transition-colors text-white/70 hover:text-white shrink-0 ml-2">
            <LogOut size={18} className="md:w-5 md:h-5" />
          </button>
        )}
      </div>

      <main className="relative z-10 w-full max-w-4xl mx-auto p-4 md:px-6">
        {children}
      </main>

      {role && (
        <nav className="fixed bottom-0 left-0 w-full h-[84px] bg-[#12163f]/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center z-50 px-4 pb-safe print:hidden">
          <NavItem icon={<Home size={22} />} label="Home" active={loc === '/'} onClick={() => setLoc('/')} shape={tabShape} customStyle={tabStyles?.home} />
          {role !== 'admin' && (
            <NavItem icon={<MessageCircle size={22} />} label="Messages" active={loc === '/messages'} onClick={() => setLoc('/messages')} shape={tabShape} customStyle={tabStyles?.messages} />
          )}
          <NavItem icon={<Trophy size={22} />} label="Events" active={loc === '/events'} onClick={() => setLoc('/events')} shape={tabShape} customStyle={tabStyles?.events} />
          <NavItem icon={<UserPlus size={22} />} label="Join" active={loc === '/join'} onClick={() => setLoc('/join')} shape={tabShape} customStyle={tabStyles?.join} />
          {isStaff && (
            <NavItem icon={<ShieldAlert size={22} />} label="Admin" active={loc === '/admin'} onClick={() => setLoc('/admin')} shape={tabShape} customStyle={tabStyles?.admin} />
          )}
        </nav>
      )}
      
      <div className="relative z-10 text-center py-12 text-[10px] text-[#b0b0cc] opacity-40 font-mono tracking-widest leading-relaxed print:hidden">
        DEVELOPER: BALJINDER SINGH <br /> © 2026 GCET SPORTS CLUB<br />SUPPORT:gcetsportsequipment@gmail.com
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, shape, customStyle }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, shape: 'rounded' | 'pill' | 'square', customStyle?: { color: string, size: number } }) {
  const roundedClass = shape === 'pill' ? 'rounded-full' : shape === 'rounded' ? 'rounded-2xl' : 'rounded-md';
  const activeColor = customStyle?.color || '#6b5cff';
  const sizeMultiplier = customStyle?.size || 1;
  
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 px-4 py-2 ${roundedClass} ${
        active ? '-translate-y-2' : 'text-white/40 hover:text-white/70 hover:bg-[#1e293b]/5'
      }`}
      style={active ? { color: activeColor } : {}}
    >
      <div 
        className={`transition-all ${active ? 'drop-shadow-lg' : ''}`}
        style={active ? { transform: `scale(${1.1 * sizeMultiplier})` } : { transform: `scale(${sizeMultiplier})` }}
      >
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider transition-all" style={active ? { transform: `scale(${sizeMultiplier})` } : {}}>{label}</span>
    </div>
  );
}
