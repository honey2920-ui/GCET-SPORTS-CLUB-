import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { getFaceEmoji } from '@/lib/utils';
import { Edit2, Trash2, PlusCircle, LayoutDashboard, Users, UserCog, ArrowRight, Plus, ExternalLink, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { coreDepts } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'mentors' | 'core'>('overview');
  const [coreDept, setCoreDept] = useState(coreDepts[0]?.name || 'Core Head');

  const goToDept = (dept: string) => {
    setCoreDept(dept);
    setActiveTab('core');
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex bg-white p-1 rounded-xl md:rounded-2xl border border-slate-200 backdrop-blur-md relative overflow-x-auto scrollbar-hide shadow-sm">
        <TabButton icon={<LayoutDashboard size={14} className="md:w-4 md:h-4"/>} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton icon={<Users size={14} className="md:w-4 md:h-4"/>} label="Mentors" active={activeTab === 'mentors'} onClick={() => setActiveTab('mentors')} />
        <TabButton icon={<UserCog size={14} className="md:w-4 md:h-4"/>} label="Committee" active={activeTab === 'core'} onClick={() => setActiveTab('core')} />
      </div>

      {activeTab === 'overview' && <OverviewTab onGoToMentors={() => setActiveTab('mentors')} onGoToDept={goToDept} />}
      {activeTab === 'mentors' && <MentorsTab />}
      {activeTab === 'core' && <CoreTab dept={coreDept} setDept={setCoreDept} />}
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[100px] py-2.5 md:py-3 px-2 flex items-center justify-center gap-1.5 md:gap-2 rounded-lg md:rounded-xl text-[11px] md:text-sm font-bold transition-all duration-300 relative z-10 ${
        active ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {icon} <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function OverviewTab({ onGoToMentors, onGoToDept }: { onGoToMentors: () => void, onGoToDept: (dept: string) => void }) {
  const { role, coreId, coreCreds, holidays, addHoliday, updateHoliday, deleteHoliday, holidayPdf, setHolidayPdf, bannerMsg, bannerVisible, events, coreMembers, coreDepts, addCoreDept, updateCoreDept, deleteCoreDept } = useAppStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  // BASIC, CLASSIC, MASTER, and ADMIN can edit Dashboard (Holidays)
  const canEditHolidays = isMaster || power === 'basic' || power === 'classic';

  const handleAddHoliday = () => {
    const title = prompt("Holiday Title:");
    if (!title) return;
    const range = prompt("Date Range (e.g. DEC 25 - JAN 1):");
    addHoliday({ title, dateRange: range || '' });
  };

  const handleEditHoliday = (h: any) => {
    const title = prompt("New Title:", h.title);
    const range = prompt("New Range:", h.dateRange);
    updateHoliday(h.id, { title: title || h.title, dateRange: range || h.dateRange });
  };

  const handleAddDept = () => {
    const name = prompt("Department/Head Name:");
    if (!name) return;
    const icon = prompt("Emoji Icon:", "💼") || "💼";
    addCoreDept(name, icon);
  };

  const handleEditDept = (d: any, e: any) => {
    e.stopPropagation();
    const name = prompt("New Name:", d.name);
    if (!name) return;
    const icon = prompt("New Icon:", d.icon);
    updateCoreDept(d.id, name, icon || d.icon);
  };

  const handleDeleteDept = (d: any, e: any) => {
    e.stopPropagation();
    if (confirm(`Delete department ${d.name}?`)) {
      deleteCoreDept(d.id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      // For now, we'll store a mock URL and the filename
      const url = URL.createObjectURL(file);
      setHolidayPdf({
        url,
        name: file.name,
        uploadDate: new Date().toLocaleDateString()
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {bannerVisible && (
        <div className="bg-gradient-to-r from-[#10b981] via-[#0da06f] to-[#10b981] text-white p-4 rounded-2xl font-bold text-center animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-[#10b981]/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite]"></div>
          <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
            <span className="text-2xl animate-bounce">📢</span>
            <span className="tracking-wide">{bannerMsg}</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-[24px] text-center relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
            <span className="text-8xl">🏆</span>
          </div>
          <p className="text-xs text-slate-500 mb-2 font-bold tracking-widest uppercase relative z-10">Active Events</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#2563eb] relative z-10">{events.length}</h2>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-[24px] text-center relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
            <span className="text-8xl">👥</span>
          </div>
          <p className="text-xs text-slate-500 mb-2 font-bold tracking-widest uppercase relative z-10">Committee</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#2563eb] relative z-10">{coreMembers.length}</h2>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            Holidays & Break
          </h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {holidayPdf ? (
              <div className="flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/30 px-3 py-1.5 rounded-xl text-[#10b981] text-xs font-bold w-full md:w-auto overflow-hidden">
                <span className="truncate flex-1">{holidayPdf.name}</span>
                {canEditHolidays && (
                  <button onClick={() => {
                    if(confirm("Unlink PDF?")) setHolidayPdf(null);
                  }} className="p-1 hover:bg-[#10b981]/20 rounded-lg shrink-0">
                    <Trash2 size={12} />
                  </button>
                )}
                <a href={holidayPdf.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-[#10b981]/20 rounded-lg shrink-0">
                  <ExternalLink size={12} />
                </a>
              </div>
            ) : (
               <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold hidden md:block">No PDF Linked</span>
            )}
            
            {canEditHolidays && (
              <div className="flex gap-2 shrink-0">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf" 
                  onChange={handleFileUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className={`p-2 rounded-xl transition-colors text-slate-500 hover:text-slate-900 flex items-center gap-2 text-xs font-bold ${holidayPdf ? 'bg-slate-100 hover:bg-slate-200' : 'bg-[#2563eb]/10 text-[#2563eb] hover:bg-[#2563eb]/20 hover:text-[#1d4ed8]'}`} 
                  title={holidayPdf ? "Replace PDF" : "Upload PDF"}
                >
                  <Upload size={16} /> {holidayPdf ? '' : 'Upload'}
                </button>
                <button onClick={handleAddHoliday} className="p-2 bg-slate-100 rounded-xl hover:bg-[#2563eb] hover:text-white transition-colors text-slate-600">
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {holidays.map(h => (
            <div key={h.id} className="min-w-[180px] p-5 rounded-2xl bg-white border border-slate-200 shadow-sm shrink-0 relative group">
              <p className="text-[10px] font-bold text-[#2563eb] mb-2 tracking-wider uppercase">{h.dateRange}</p>
              <p className="font-bold text-lg leading-tight text-slate-900">{h.title}</p>
              {canEditHolidays && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditHoliday(h)} className="p-1 bg-slate-100 rounded-lg text-slate-400 hover:text-[#2563eb]">
                    <Edit2 size={10} />
                  </button>
                  <button onClick={() => deleteHoliday(h.id)} className="p-1 bg-slate-100 rounded-lg text-slate-400 hover:text-red-500">
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {holidays.length === 0 && <p className="text-slate-400 text-xs italic p-4">No upcoming holidays</p>}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
          <Users className="text-[#2563eb]" size={20} /> Directory
        </h3>
        
        <div 
          onClick={onGoToMentors}
          className="bg-white border border-slate-200 shadow-sm p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#2563eb]/50 transition-all mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl">👨‍🏫</div>
            <h4 className="font-bold text-lg text-slate-900">Our Mentors</h4>
          </div>
          <ArrowRight className="text-slate-400" size={20} />
        </div>

        <div className="flex justify-between items-center mb-4 mt-6">
          <h4 className="text-sm font-bold text-slate-400 tracking-widest uppercase">Core Committee</h4>
          {canEditHolidays && (
            <button onClick={handleAddDept} className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-[#2563eb] hover:text-white px-3 py-1.5 rounded-lg transition-colors font-bold text-slate-600">
              <Plus size={12} /> Add Dept
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {coreDepts.map(d => (
            <div 
              key={d.id}
              onClick={() => onGoToDept(d.name)}
              className="bg-white border border-slate-200 shadow-sm p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-[#2563eb]/50 transition-all group relative"
            >
              {canEditHolidays && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleEditDept(d, e)} className="p-1 bg-slate-100 rounded hover:bg-[#2563eb] hover:text-white text-slate-400 transition-colors">
                    <Edit2 size={10} />
                  </button>
                  <button onClick={(e) => handleDeleteDept(d, e)} className="p-1 bg-slate-100 rounded hover:bg-red-500 hover:text-white text-slate-400 transition-colors">
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
              <div className="text-2xl group-hover:scale-110 transition-transform">{d.icon || '💼'}</div>
              <span className="text-xs font-bold text-slate-700">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}

function MentorsTab() {
  const { role, coreCreds, coreId, mentors, addMentor, updateMentor, deleteMentor } = useAppStore();
  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  // CLASSIC, MASTER, and ADMIN can edit Mentors (Teachers)
  const canEdit = isMaster || power === 'classic';

  const handleAdd = () => {
    const name = prompt("Mentor Name:");
    if (!name) return;
    const designation = prompt("Designation:");
    const description = prompt("Description:");
    const dateAdded = new Date().toISOString().split('T')[0];
    addMentor({ name, designation: designation || '', description: description || '', dateAdded });
  };

  const handleEdit = (m: any) => {
    const newName = prompt("Edit Name:", m.name);
    if (!newName) return;
    const newDesignation = prompt("Edit Designation:", m.designation);
    const newDesc = prompt("Edit Description:", m.description || '');
    updateMentor(m.id, { name: newName, designation: newDesignation || m.designation, description: newDesc || m.description });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xl font-bold tracking-wide flex items-center gap-2 text-slate-900">
          Our Mentors
        </h2>
        {canEdit && (
          <button onClick={handleAdd} className="flex items-center gap-2 bg-[#10b981]/10 text-[#10b981] px-4 py-2 rounded-xl text-sm font-bold border border-[#10b981]/20 hover:bg-[#10b981]/20 transition-colors">
            <PlusCircle size={16} /> Add Mentor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.map(m => (
          <div key={m.id} className="bg-white border border-slate-200 rounded-[24px] p-6 relative group hover:border-[#2563eb]/30 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#2563eb]/10 text-[#2563eb] shrink-0 flex items-center justify-center text-3xl shadow-sm border border-[#2563eb]/20">
                {getFaceEmoji(m.name)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1 text-slate-900">{m.name}</h4>
                <p className="text-sm text-[#2563eb] font-bold mb-2 tracking-wide uppercase">{m.designation}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{m.description}</p>
                {m.dateAdded && <p className="text-[10px] font-mono text-slate-400 mt-4 uppercase tracking-widest">Added: {m.dateAdded}</p>}
              </div>
            </div>
            
            {canEdit && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(m)} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-[#2563eb] transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => {
                  if(confirm("Delete this mentor?")) deleteMentor(m.id);
                }} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CoreTab({ dept, setDept }: { dept: string, setDept: (d: string) => void }) {
  const { role, coreCreds, coreId, coreMembers, coreDepts, addCoreMember, updateCoreMember, deleteCoreMember, addCoreCred } = useAppStore();
  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  // CLASSIC, MASTER, and ADMIN can edit Core members
  const canEdit = isMaster || power === 'classic';
  const members = coreMembers.filter(m => m.department === dept);

  const handleAdd = () => {
    const name = prompt("Name:");
    if(!name) return;
    const branch = prompt("Branch:");
    const description = prompt("Description:");
    addCoreMember({ department: dept, name, branch: branch || '', description: description || '', dateAdded: new Date().toISOString().split('T')[0] });
    
    // Auto-generate Core ID
    const generatedId = name.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random()*100);
    const generatedPass = "CORE2026";
    addCoreCred(generatedId, generatedPass, 'basic', name, dept);
    alert(`Member added!\nAuto-generated Core ID: ${generatedId}\nPassword: ${generatedPass}`);
  };

  const handleEdit = (m: any) => {
    const n = prompt("New Name:", m.name);
    if (!n) return;
    const b = prompt("New Branch:", m.branch);
    const d = prompt("New Description:", m.description || '');
    updateCoreMember(m.id, { name: n, branch: b || m.branch, description: d || m.description });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 px-1">
        {coreDepts.map(d => (
          <button 
            key={d.id} 
            onClick={() => setDept(d.name)}
            className={`whitespace-nowrap px-5 py-3 rounded-[16px] text-sm font-bold transition-all duration-300 border ${
              dept === d.name 
              ? 'bg-[#2563eb]/10 text-[#2563eb] border-[#2563eb]/30 shadow-sm' 
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-[28px] p-6 min-h-[300px] shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 tracking-wide">{dept} <span className="text-[#2563eb]">Members</span></h3>
          {canEdit && (
            <button onClick={handleAdd} className="flex items-center gap-2 bg-[#10b981]/10 text-[#10b981] px-4 py-2 rounded-xl text-sm font-bold border border-[#10b981]/20 hover:bg-[#10b981]/20 transition-colors">
              <PlusCircle size={16} /> Add Member
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map(m => (
            <div key={m.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[20px] border border-slate-200 group hover:border-[#2563eb]/30 hover:bg-white hover:shadow-sm transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm text-[#2563eb]">
                  {getFaceEmoji(m.name)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{m.name}</h4>
                  <p className="text-[11px] font-bold text-[#2563eb] tracking-wider uppercase mb-1">{m.branch}</p>
                  {m.description && <p className="text-xs text-slate-500 line-clamp-2">{m.description}</p>}
                </div>
              </div>
              
              {canEdit && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(m)} className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-[#2563eb] transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => {
                    if(confirm("Delete member?")) deleteCoreMember(m.id);
                  }} className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}