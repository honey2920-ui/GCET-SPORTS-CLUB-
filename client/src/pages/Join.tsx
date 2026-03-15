import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Plus, Trash2, Wallet, TrendingDown, Package, ShoppingCart, ExternalLink, Upload, Download, CreditCard } from 'lucide-react';

export default function Join() {
  const { role, coreCreds, coreId, expenses, addExpense, deleteExpense, equipment, addEquipment, deleteEquipment } = useAppStore();
  const [activeTab, setActiveTab] = useState<'registration' | 'attendance' | 'budget' | 'equipment'>('registration');

  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  
  // BASIC, CLASSIC, MASTER, and ADMIN can edit Registration, Attendance
  const canEditReg = isMaster || power === 'basic' || power === 'classic';
  // ONLY CLASSIC, MASTER, and ADMIN can edit Budget, Equipment
  const canEditBudget = isMaster || power === 'classic';
  const isStaff = role === 'admin' || role === 'core';

  const excelLink = "https://onedrive.live.com/view.aspx?resid=9876543210!123";

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-20">
      {isStaff && (
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto scrollbar-hide no-print">
          <TabButton label="Registration" active={activeTab === 'registration'} onClick={() => setActiveTab('registration')} />
          <TabButton label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          <TabButton label="Budget" active={activeTab === 'budget'} onClick={() => setActiveTab('budget')} />
          <TabButton label="Equipment" active={activeTab === 'equipment'} onClick={() => setActiveTab('equipment')} />
        </div>
      )}

      {activeTab === 'registration' && <FormView title="Registration Form" actionLabel="Submit Registration" canEdit={canEditReg} showUpload={true} isRegistration={true} />}
      
      {isStaff && (
        <>
          {activeTab === 'attendance' && <FormView title="Attendance Form" actionLabel="Mark Attendance" canEdit={canEditReg} showUpload={false} isRegistration={false} />}
          {activeTab === 'budget' && <BudgetView expenses={expenses} addExpense={addExpense} deleteExpense={deleteExpense} canEdit={canEditBudget} excelLink={excelLink} />}
          {activeTab === 'equipment' && <EquipmentView equipment={equipment} addEquipment={addEquipment} deleteEquipment={deleteEquipment} canEdit={canEditBudget} excelLink={excelLink} />}
        </>
      )}
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
        active ? 'bg-gradient-to-r from-[#6b5cff] to-[#8073ff] text-white shadow-lg' : 'text-white/40 hover:text-white/80'
      }`}
    >
      {label}
    </button>
  );
}

function FormView({ title, actionLabel, canEdit, showUpload, isRegistration }: any) {
  const { setIslandMessage, formPublished, setFormPublished, events, addRegistration, registrations, deleteRegistration } = useAppStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [engType, setEngType] = useState('');
  const [year, setYear] = useState('');
  const [event, setEvent] = useState('');
  const [sem, setSem] = useState('');
  
  const handleSubmit = () => {
    if (!name || !rollNo || !event) {
      alert("Name, Roll Number and Event are required");
      return;
    }
    
    if (isRegistration) {
      addRegistration({ name, email, rollNo, mobile, engType, year, event, sem, photo: previewUrl });
      setName(''); setEmail(''); setRollNo(''); setMobile(''); setEngType(''); setYear(''); setEvent(''); setSem(''); setPreviewUrl(null);
    } else {
      setIslandMessage(`${title} data saved`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const printIDCards = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center px-1 no-print">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {canEdit && (
          <button 
            onClick={() => setFormPublished(!formPublished)} 
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${formPublished ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#10b981] hover:bg-[#0da06f] text-white'}`}
          >
            {formPublished ? 'Unpublish' : 'Publish'}
          </button>
        )}
      </div>

      <div className="no-print">
      {!formPublished ? (
        <div className="bg-[#1e1e3f]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-12 text-center shadow-2xl">
          <div className="text-6xl mb-6">⏳</div>
          <h3 className="text-2xl font-bold text-white mb-2">We will be right soon</h3>
          <p className="text-white/50">with a new event</p>
        </div>
      ) : (
        <div className="bg-[#1e1e3f]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 space-y-6 shadow-2xl">
          {showUpload && (
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-3xl bg-black/30 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#6b5cff]/50 hover:bg-black/40 transition-all overflow-hidden relative group"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="text-white/20 group-hover:text-[#6b5cff] transition-colors" size={32} />
                    <span className="text-[10px] font-bold text-white/20 mt-2 uppercase tracking-widest">Upload Photo</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="text-white" size={24} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Passport size photo required</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Full Name" value={name} onChange={(e: any) => setName(e.target.value)} />
            <Input placeholder="Email ID" value={email} onChange={(e: any) => setEmail(e.target.value)} />
            <Input placeholder="Roll Number" value={rollNo} onChange={(e: any) => setRollNo(e.target.value)} />
            <Input placeholder="Mobile Number" value={mobile} onChange={(e: any) => setMobile(e.target.value)} />
            <Select options={["B.Tech", "Diploma"]} placeholder="Engineering Type" value={engType} onChange={(e: any) => setEngType(e.target.value)} />
            <Select options={["1", "2", "3", "4"]} placeholder="Year" value={year} onChange={(e: any) => setYear(e.target.value)} />
            <Select options={events.map(e => e.name)} placeholder="Select Event" value={event} onChange={(e: any) => setEvent(e.target.value)} />
            <Select options={["1", "2", "3", "4", "5", "6", "7", "8"]} placeholder="Select Semester" value={sem} onChange={(e: any) => setSem(e.target.value)} />
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full bg-[#6b5cff] hover:bg-[#8073ff] text-white py-4 rounded-2xl font-bold text-lg transition-all mt-4 shadow-lg active:scale-95"
          >
            {actionLabel}
          </button>
        </div>
      )}
      </div>

      {isRegistration && canEdit && (
        <div className="mt-12 space-y-6">
          <div className="flex justify-between items-center px-1 no-print">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <CreditCard className="text-[#fca311]" /> Registrations & ID Cards
            </h3>
            {registrations.length > 0 && (
              <button 
                onClick={printIDCards}
                className="flex items-center gap-2 bg-[#6b5cff] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#8073ff] transition-all shadow-lg active:scale-95"
              >
                <Download size={16} /> Download All ID Cards as PDF
              </button>
            )}
          </div>
          
          {registrations.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl py-12 text-center text-white/40 font-medium no-print">
              No registrations yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registrations.map(r => (
                <div key={r.id} className="id-card-print bg-white/5 border border-white/20 p-6 rounded-[24px] relative group overflow-hidden">
                  {/* ID Card Design */}
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="text-6xl">⚽</span>
                  </div>
                  
                  <div className="flex gap-5 relative z-10">
                    <div className="w-24 h-32 rounded-xl bg-black/40 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {r.photo ? (
                        <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl text-white/20">👤</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-extrabold text-xl mb-1 text-[#6b5cff] uppercase tracking-wide id-card-text">{r.name}</h4>
                      <p className="text-xs font-bold text-[#fca311] mb-3 tracking-widest uppercase id-card-text">{r.event}</p>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <div>
                          <span className="text-white/40 uppercase tracking-wider text-[9px] block id-card-label">Roll No</span>
                          <span className="font-mono font-bold id-card-text">{r.rollNo}</span>
                        </div>
                        <div>
                          <span className="text-white/40 uppercase tracking-wider text-[9px] block id-card-label">Mobile</span>
                          <span className="font-mono font-bold id-card-text">{r.mobile}</span>
                        </div>
                        <div>
                          <span className="text-white/40 uppercase tracking-wider text-[9px] block id-card-label">Year/Sem</span>
                          <span className="font-bold id-card-text">{r.year} Yr / {r.sem} Sem</span>
                        </div>
                        <div>
                          <span className="text-white/40 uppercase tracking-wider text-[9px] block id-card-label">Type</span>
                          <span className="font-bold id-card-text">{r.engType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-white/30 id-card-label">ID: {r.id.toUpperCase()}</span>
                    <span className="text-[10px] font-bold text-white/50 tracking-widest id-card-label">GCET SPORTS CLUB</span>
                  </div>

                  <button 
                    onClick={() => deleteRegistration(r.id)}
                    className="no-print absolute top-4 right-4 p-2 bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function BudgetView({ expenses, addExpense, deleteExpense, canEdit, excelLink }: any) {
  const totalAllotted = expenses.filter(e => e.type === 'allotted').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAdd = (type: 'allotted' | 'expense') => {
    const item = prompt(`Enter ${type} item name:`);
    if (!item) return;
    const amount = parseFloat(prompt("Enter amount:") || "0");
    if (isNaN(amount)) return;
    addExpense({ type, item, amount, date: new Date().toLocaleDateString() });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold tracking-tight">Budget Management</h2>
        <a href={excelLink} target="_blank" rel="noopener noreferrer" className="text-green-400 p-2 hover:bg-green-400/10 rounded-xl transition-colors">
          <FileSpreadsheet size={24} />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BudgetStat label="Total Allotted" amount={totalAllotted} color="text-green-400" />
        <BudgetStat label="Total Expense" amount={totalExpense} color="text-red-400" />
      </div>

      {canEdit && (
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
          <h4 className="font-bold mb-6 text-white/70 uppercase tracking-widest text-sm">Add Entry</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAdd('allotted')} className="flex items-center justify-center gap-2 bg-[#10b981]/10 text-[#10b981] py-4 rounded-2xl font-bold border border-[#10b981]/20 hover:bg-[#10b981]/20 transition-all active:scale-95">
              <Plus size={20} /> Add Allotted
            </button>
            <button onClick={() => handleAdd('expense')} className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-4 rounded-2xl font-bold border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95">
              <Plus size={20} /> Add Expense
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-bold text-white/50 tracking-widest uppercase text-sm px-1">Recent Entries</h4>
        {expenses.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl py-8 text-center text-white/20 font-medium backdrop-blur-sm">No entries yet.</div>
        ) : (
          expenses.map(e => (
            <div key={e.id} className="bg-black/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-[#6b5cff]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${e.type === 'allotted' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {e.type === 'allotted' ? <Wallet size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="font-bold">{e.item}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">{e.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className={`font-bold text-lg ${e.type === 'allotted' ? 'text-green-400' : 'text-red-400'}`}>
                  {e.type === 'allotted' ? '+' : '-'} ₹{e.amount}
                </p>
                {canEdit && (
                  <button onClick={() => deleteExpense(e.id)} className="text-white/20 hover:text-red-400 transition-colors p-2 active:scale-90">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function EquipmentView({ equipment, addEquipment, deleteEquipment, canEdit, excelLink }: any) {
  const handleAdd = (type: 'available' | 'wanted') => {
    const name = prompt(`Enter ${type} item name:`);
    if (!name) return;
    const qty = parseInt(prompt("Enter quantity:") || "0");
    if (isNaN(qty)) return;
    addEquipment({ type, name, qty });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold tracking-tight">Equipment List</h2>
        <a href={excelLink} target="_blank" rel="noopener noreferrer" className="text-green-400 p-2 hover:bg-green-400/10 rounded-xl transition-colors">
          <FileSpreadsheet size={24} />
        </a>
      </div>

      <EquipmentSection 
        title="Available Items" 
        items={equipment.filter((e: any) => e.type === 'available')} 
        icon={<Package size={20} className="text-green-400" />}
        onAdd={() => handleAdd('available')}
        onDelete={deleteEquipment}
        canEdit={canEdit}
        dotColor="bg-green-400"
      />

      <EquipmentSection 
        title="Wanted List" 
        items={equipment.filter((e: any) => e.type === 'wanted')} 
        icon={<ShoppingCart size={20} className="text-[#fca311]" />}
        onAdd={() => handleAdd('wanted')}
        onDelete={deleteEquipment}
        canEdit={canEdit}
        dotColor="bg-[#fca311]"
      />
    </motion.div>
  );
}

function EquipmentSection({ title, items, onAdd, onDelete, canEdit, dotColor }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h4 className="font-bold flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`}></span>
          {title}
        </h4>
        {canEdit && (
          <button onClick={onAdd} className="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-green-500/20 transition-all active:scale-95">
            + Add {title.split(' ')[0]}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item: any) => (
          <div key={item.id} className={`bg-gradient-to-br from-black/60 to-black/40 border border-white/10 p-5 rounded-[24px] flex items-center justify-between group transition-all backdrop-blur-md shadow-lg ${
            dotColor === 'bg-green-400' ? 'hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]' : 'hover:border-[#fca311]/50 hover:shadow-[0_0_20px_rgba(252,163,17,0.15)]'
          }`}>
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5 ${
                dotColor === 'bg-green-400' ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/10' : 'bg-gradient-to-br from-[#fca311]/20 to-orange-500/10'
              } group-hover:scale-110 transition-transform duration-300`}>
                {getEmoji(item.name)}
              </div>
              <div>
                <p className="font-bold text-lg text-white mb-1">{item.name}</p>
                <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  dotColor === 'bg-green-400' ? 'bg-green-500/10 text-green-400' : 'bg-[#fca311]/10 text-[#fca311]'
                }`}>
                  Qty: {item.qty}
                </div>
              </div>
            </div>
            {canEdit && (
              <button 
                onClick={() => onDelete(item.id)} 
                className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all active:scale-90 opacity-0 group-hover:opacity-100 border border-red-500/20"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetStat({ label, amount, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl shadow-xl">
      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-3">{label}</p>
      <h3 className={`text-4xl font-extrabold ${color} tracking-tighter`}>₹{amount.toLocaleString()}</h3>
    </div>
  );
}

function Input({ placeholder, value, onChange }: any) {
  return <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#6b5cff] outline-none transition-colors placeholder:text-white/20" />;
}

function Select({ options, placeholder, value, onChange }: any) {
  return (
    <select value={value} onChange={onChange} className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#6b5cff] outline-none appearance-none transition-colors">
      <option value="" className="bg-[#1e1e3f]">{placeholder}</option>
      {options.map((o: any) => <option key={o} value={o} className="bg-[#1e1e3f]">{o}</option>)}
    </select>
  );
}

function getEmoji(name: string) {
  const n = name.toLowerCase();
  // Sports
  if (n.includes('football') || n.includes('soccer')) return '⚽';
  if (n.includes('bat') || n.includes('cricket')) return '🏏';
  if (n.includes('basketball')) return '🏀';
  if (n.includes('volleyball')) return '🏐';
  if (n.includes('tennis')) return '🎾';
  if (n.includes('shuttle') || n.includes('badminton')) return '🏸';
  if (n.includes('baseball')) return '⚾';
  if (n.includes('softball')) return '🥎';
  if (n.includes('rugby')) return '🏉';
  if (n.includes('frisbee')) return '🥏';
  if (n.includes('billiards') || n.includes('pool')) return '🎱';
  if (n.includes('yoyo')) return '🪀';
  if (n.includes('ping pong') || n.includes('table tennis')) return '🏓';
  if (n.includes('ice hockey')) return '🏒';
  if (n.includes('field hockey')) return '🏑';
  if (n.includes('lacrosse')) return '🥍';
  if (n.includes('goal') || n.includes('net')) return '🥅';
  if (n.includes('golf')) return '⛳';
  if (n.includes('archery') || n.includes('bow')) return '🏹';
  if (n.includes('fishing')) return '🎣';
  if (n.includes('boxing')) return '🥊';
  if (n.includes('martial arts') || n.includes('karate') || n.includes('judo')) return '🥋';
  if (n.includes('running') || n.includes('track') || n.includes('jersey')) return '🎽';
  if (n.includes('skate')) return '🛹';
  if (n.includes('sled')) return '🛷';
  if (n.includes('skat')) return '⛸';
  if (n.includes('ski')) return '🎿';
  if (n.includes('snowboard')) return '🏂';
  if (n.includes('weight') || n.includes('gym')) return '🏋';
  if (n.includes('wrestl')) return '🤼';
  if (n.includes('gymnast')) return '🤸';
  if (n.includes('fenc')) return '🤺';
  if (n.includes('yoga')) return '🧘';
  if (n.includes('surf')) return '🏄';
  if (n.includes('swim')) return '🏊';
  if (n.includes('water polo')) return '🤽';
  if (n.includes('rowing') || n.includes('boat')) return '🚣';
  if (n.includes('climb')) return '🧗';
  if (n.includes('bike') || n.includes('cycle')) return '🚴';
  
  // Generic
  if (n.includes('cone')) return '🔺';
  if (n.includes('whistle')) return '😙';
  if (n.includes('stopwatch')) return '⏱';
  if (n.includes('bottle') || n.includes('water')) return '🚰';
  if (n.includes('bag')) return '🎒';
  if (n.includes('shoe')) return '👟';
  if (n.includes('pump')) return '⛽';
  if (n.includes('kit') || n.includes('med')) return '🧰';

  return '🏆'; 
}