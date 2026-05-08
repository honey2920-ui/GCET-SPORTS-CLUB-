import React, { useState } from 'react';
import { useAppStore, Role } from '@/lib/store';
import { motion } from 'framer-motion';

export function LoginModal() {
  const { role, login, coreCreds, adminPass } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  if (role) return null;

  const handleLogin = () => {
    if (selectedRole === 'student') {
      login('student');
    } else if (selectedRole === 'admin') {
      if (pass === '23515911') { 
        login('admin', undefined, 'super');
      } else if (pass === adminPass || pass === 'GCET2351') {
        login('admin', undefined, 'normal');
      } else {
        alert("Invalid admin password");
      }
    } else if (selectedRole === 'core') {
      const cred = coreCreds[id];
      if (cred && cred.pass === pass) {
        login('core', id);
      } else {
        alert("Invalid core credentials");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-[9999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-[400px] p-8 rounded-[32px] text-center border border-slate-200 shadow-2xl relative"
      >
        <div className="w-24 h-24 mx-auto border-4 border-[#2563eb] rounded-full mb-6 flex items-center justify-center bg-white shadow-[0_0_30px_rgba(37,99,235,0.3)]">
          <span className="text-4xl">⚽</span>
        </div>
        <h1 className="text-[#2563eb] text-2xl font-bold mb-8 tracking-wider">GCET SPORTS CLUB</h1>
        
        <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-2xl border border-slate-200 relative z-10">
          {(['student', 'core', 'admin'] as Role[]).map(r => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all relative z-20 ${
                selectedRole === r ? 'bg-[#2563eb] text-white shadow-lg' : 'bg-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {r?.toUpperCase()}
            </button>
          ))}
        </div>

        {selectedRole === 'core' && (
          <input
            type="text"
            placeholder="Enter Core ID"
            value={id}
            onChange={e => setId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 mb-4 outline-none focus:border-[#2563eb] transition-colors"
          />
        )}
        
        {(selectedRole === 'core' || selectedRole === 'admin') && (
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 mb-8 outline-none focus:border-[#2563eb] transition-colors"
          />
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
        >
          SIGN IN
        </button>
      </motion.div>
    </div>
  );
}