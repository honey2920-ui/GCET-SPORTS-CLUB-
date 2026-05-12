import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'student' | 'core' | 'admin' | null;
export type PowerLevel = 'classic' | 'basic' | 'master';

export interface Mentor {
  id: string;
  name: string;
  designation: string;
  description?: string;
  dateAdded?: string;
  img?: string;
}

export interface CoreMember {
  id: string;
  department: string;
  name: string;
  branch: string;
  description?: string;
  dateAdded?: string;
  img?: string;
}

export interface CoreDept {
  id: string;
  name: string;
  icon?: string;
}

export interface CoreCreds {
  id: string;
  pass: string;
  power: PowerLevel;
  name?: string;
  post?: string;
}

export interface Expense {
  id: string;
  type: 'allotted' | 'expense';
  item: string;
  amount: number;
  date: string;
}

export interface Equipment {
  id: string;
  name: string;
  qty: number;
  type: 'available' | 'wanted';
}

export interface Holiday {
  id: string;
  title: string;
  dateRange: string;
}

export interface HolidayPdf {
  url: string;
  name: string;
  uploadDate: string;
}

export interface Portal {
  id: string;
  title: string;
  icon: string;
  link: string;
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  description: string;
  img: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  mobile: string;
  engType: string;
  year: string;
  event: string;
  sem: string;
  photo: string | null;
  date: string;
  status?: 'present' | 'absent';
}

export interface SystemLog {
  id: string;
  user: string;
  action: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gif';
  timestamp: string;
  targetTab: 'student' | 'core';
}

export type UploadedImage = {
  id: string;
  uploaderRole: string;
  uploaderId?: string;
  dataUrl: string;
  timestamp: string;
};

interface AppState {
  role: Role;
  coreId: string | null;
  coreCreds: Record<string, CoreCreds>;
  mentors: Mentor[];
  coreMembers: CoreMember[];
  coreDepts: CoreDept[];
  holidays: Holiday[];
  holidayPdf: HolidayPdf | null;
  expenses: Expense[];
  equipment: Equipment[];
  portals: Portal[];
  events: EventItem[];
  registrations: Registration[];
  logs: SystemLog[];
  islandMessage: string | null;
  bgUrl: string;
  themeColor: string;
  fontFamily: string;
  bannerMsg: string;
  bannerVisible: boolean;
  bannerType: 'info' | 'warning' | 'success' | 'error';
  tabShape: 'rounded' | 'pill' | 'square';
  tabStyles: Record<string, { color: string, size: number }>;
  formPublished: boolean;
  attendanceFormPublished: boolean;
  adminPass: string;
  adminLevel: 'normal' | 'super' | null;
  maintenanceMode: boolean;
  maintenanceMsg: string;
  maintenanceGif: string;
  defaultCorePass: string;
  permissionsGranted: boolean;
  userGallery: UploadedImage[];
  messages: Message[];
  login: (role: Role, id?: string, level?: 'normal' | 'super') => void;
  logout: () => void;
  setIslandMessage: (msg: string | null) => void;
  setBgUrl: (url: string) => void;
  setThemeColor: (color: string) => void;
  setFontFamily: (font: string) => void;
  setTabShape: (shape: 'rounded' | 'pill' | 'square') => void;
  setTabStyle: (tab: string, style: { color?: string, size?: number }) => void;
  setBanner: (msg: string, visible: boolean, type?: 'info' | 'warning' | 'success' | 'error') => void;
  setFormPublished: (pub: boolean) => void;
  setAttendanceFormPublished: (pub: boolean) => void;
  setAdminPass: (pass: string) => void;
  setMaintenance: (mode: boolean, msg: string) => void;
  setMaintenanceGif: (url: string) => void;
  setDefaultCorePass: (pass: string) => void;
  setPermissionsGranted: (granted: boolean) => void;
  addUserImage: (img: Omit<UploadedImage, 'id' | 'timestamp'>) => void;
  deleteUserImage: (id: string) => void;
  addMentor: (m: Omit<Mentor, 'id'>) => void;
  updateMentor: (id: string, m: Partial<Mentor>) => void;
  deleteMentor: (id: string) => void;
  addCoreMember: (m: Omit<CoreMember, 'id'>) => void;
  updateCoreMember: (id: string, m: Partial<CoreMember>) => void;
  deleteCoreMember: (id: string) => void;
  addCoreDept: (name: string, icon: string) => void;
  updateCoreDept: (id: string, name: string, icon: string) => void;
  deleteCoreDept: (id: string) => void;
  updateCoreCred: (id: string, cred: Partial<CoreCreds>) => void;
  updateCoreId: (oldId: string, newId: string) => void;
  addCoreCred: (id: string, pass: string, power: PowerLevel, name?: string, post?: string) => void;
  deleteCoreCred: (id: string) => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addEquipment: (e: Omit<Equipment, 'id'>) => void;
  deleteEquipment: (id: string) => void;
  addHoliday: (h: Omit<Holiday, 'id'>) => void;
  updateHoliday: (id: string, h: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;
  setHolidayPdf: (pdf: HolidayPdf | null) => void;
  addPortal: (p: Omit<Portal, 'id'>) => void;
  updatePortal: (id: string, p: Partial<Portal>) => void;
  deletePortal: (id: string) => void;
  addEvent: (e: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, e: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  addRegistration: (r: Omit<Registration, 'id' | 'date'>) => void;
  updateRegistration: (id: string, r: Partial<Registration>) => void;
  deleteRegistration: (id: string) => void;
  sendMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
}

const defaultCreds: Record<string, CoreCreds> = {
  '1111': { id: '1111', pass: 'CORE2026', power: 'basic', name: 'Pratik', post: 'President' },
  'balli': { id: 'balli', pass: 'BALLI123', power: 'master', name: 'Balli', post: 'Equipment Lead' }
};

const MockContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [coreId, setCoreId] = useState<string | null>(null);
  const [islandMessage, setIslandMessage] = useState<string | null>(null);
  const [coreCreds, setCoreCreds] = useState<Record<string, CoreCreds>>(defaultCreds);
  const [mentors, setMentors] = useState<Mentor[]>([
    { id: 'm1', name: 'Dr. Sarah Jenkins', designation: 'Chief Mentor', description: 'Oversees all sports operations', dateAdded: '2026-01-01' }
  ]);
  const [coreMembers, setCoreMembers] = useState<CoreMember[]>([
    { id: 'c1', department: 'Core Head', name: 'Alice', branch: 'Computer Science', description: 'Overall coordinator', dateAdded: '2026-01-01' }
  ]);
  const [coreDepts, setCoreDepts] = useState<CoreDept[]>([
    { id: 'd1', name: 'Core Head', icon: '👨‍💼' },
    { id: 'd2', name: 'Equipment Head', icon: '🏀' },
    { id: 'd3', name: 'Graphic Head', icon: '🎨' },
    { id: 'd4', name: 'Reels & VFX Head', icon: '🎬' },
    { id: 'd5', name: 'Treasurer Head', icon: '🤑' },
    { id: 'd6', name: 'Volunteer Head', icon: '🫂' },
    { id: 'd7', name: 'Documentation Head', icon: '📝' },
    { id: 'd8', name: 'Logistics Head', icon: '💰' }
  ]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: 'l1', user: 'System', action: 'System Initialized', date: new Date().toLocaleString() }
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: 'e1', name: 'Football', qty: 5, type: 'available' },
    { id: 'e2', name: 'Cricket Bat', qty: 2, type: 'wanted' }
  ]);
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: 'h1', title: 'Winter Break', dateRange: 'DEC 25 - JAN 1' }
  ]);
  const [holidayPdf, setHolidayPdfState] = useState<HolidayPdf | null>(null);
  const [portals, setPortals] = useState<Portal[]>([
    { id: 'p1', title: 'Khelo India', icon: '🏆', link: '#' },
    { id: 'p2', title: 'Khel Mahakumbh', icon: '🏅', link: '#' }
  ]);
  const [events, setEvents] = useState<EventItem[]>([
    { id: 'ev1', name: 'Inter-College Cricket', date: '2026-03-15', description: 'Annual cricket tournament with neighboring colleges.', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800' }
  ]);
  const [bgUrl, setBgUrlState] = useState(localStorage.getItem('g_bg_v2') || '');
  const [themeColor, setThemeColorState] = useState(localStorage.getItem('g_theme_v2') || '#6b5cff');
  const [fontFamily, setFontFamilyState] = useState(localStorage.getItem('g_font_v2') || 'Outfit, sans-serif');
  const [tabShape, setTabShapeState] = useState<'rounded' | 'pill' | 'square'>(localStorage.getItem('g_tab_shape') as any || 'pill');
  const [tabStyles, setTabStylesState] = useState<Record<string, {color: string, size: number}>>(
    JSON.parse(localStorage.getItem('g_tab_styles') || 'null') || {
      home: { color: '#6b5cff', size: 1 },
      events: { color: '#6b5cff', size: 1 },
      join: { color: '#6b5cff', size: 1 },
      messages: { color: '#6b5cff', size: 1 },
      admin: { color: '#6b5cff', size: 1 }
    }
  );
  const [bannerMsg, setBannerMsg] = useState(localStorage.getItem('g_msg') || 'Football Selection | Coming Soon');
  const [bannerVisible, setBannerVisible] = useState(localStorage.getItem('g_msg_s') === 'Y');
  const [bannerType, setBannerType] = useState<'info' | 'warning' | 'success' | 'error'>((localStorage.getItem('g_msg_t') as any) || 'info');
  const [formPublished, setFormPublishedState] = useState(localStorage.getItem('g_form_pub') !== 'N');
  const [attendanceFormPublished, setAttendanceFormPublishedState] = useState(localStorage.getItem('g_att_form_pub') !== 'N');
  const [adminPass, setAdminPassState] = useState(localStorage.getItem('g_admin_pass') || 'GCET2351');
  const [adminLevel, setAdminLevel] = useState<'normal' | 'super' | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(localStorage.getItem('g_maint_mode') === 'Y');
  const [maintenanceMsg, setMaintenanceMsg] = useState(localStorage.getItem('g_maint_msg') || 'The portal is currently under maintenance. Please check back later.');
  const [maintenanceGif, setMaintenanceGifState] = useState(localStorage.getItem('g_maint_gif') || 'https://media.giphy.com/media/EPcvhM28ER9XW/giphy.gif');
  const [defaultCorePass, setDefaultCorePassState] = useState(localStorage.getItem('g_def_core_pass') || 'CORE2026');
  const [permissionsGranted, setPermissionsGrantedState] = useState(localStorage.getItem('g_perms') === 'Y');
  const [userGallery, setUserGallery] = useState<UploadedImage[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', senderId: 'system', senderName: 'System', senderRole: 'admin', text: 'Welcome to the secure messaging channel.', timestamp: new Date().toLocaleTimeString(), targetTab: 'student' }
  ]);

  const showIsland = (msg: string) => setIslandMessage(msg);

  const login = (r: Role, id?: string, level?: 'normal' | 'super') => {
    setRole(r);
    if(id) setCoreId(id);
    if(level) setAdminLevel(level);
    if (!(r === 'admin' && level === 'super')) {
      const userName = r === 'admin' ? `Admin (${level})` : (r === 'core' ? `Core[${id}]` : 'Student');
      setLogs(prev => [{ id: Math.random().toString(36).substr(2, 9), user: userName, action: 'LOG IN', date: new Date().toLocaleString() }, ...prev]);
    }
    showIsland(`Logged in as ${r}`);
  };

  const logout = () => {
    const userName = role === 'admin' ? 'Admin' : (role === 'core' ? `Core[${coreId}]` : 'Student');
    if (role) {
      setLogs([{ id: Math.random().toString(36).substr(2, 9), user: userName, action: 'LOG OUT', date: new Date().toLocaleString() }, ...logs]);
    }
    setRole(null);
    setCoreId(null);
    setAdminLevel(null);
    showIsland('Logged out successfully');
  };

  const setBgUrl = (url: string) => {
    setBgUrlState(url);
    localStorage.setItem('g_bg_v2', url);
  };

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    localStorage.setItem('g_theme_v2', color);
  };

  const setFontFamily = (font: string) => {
    setFontFamilyState(font);
    localStorage.setItem('g_font_v2', font);
  };

  const setTabShape = (shape: 'rounded' | 'pill' | 'square') => {
    setTabShapeState(shape);
    localStorage.setItem('g_tab_shape', shape);
  };

  const setTabStyle = (tab: string, style: {color?: string, size?: number}) => {
    setTabStylesState(prev => {
      const next = { ...prev, [tab]: { ...prev[tab], ...style } };
      localStorage.setItem('g_tab_styles', JSON.stringify(next));
      return next;
    });
  };

  const setBanner = (msg: string, visible: boolean, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
    setBannerMsg(msg);
    setBannerVisible(visible);
    setBannerType(type);
    localStorage.setItem('g_msg', msg);
    localStorage.setItem('g_msg_s', visible ? 'Y' : 'N');
    localStorage.setItem('g_msg_t', type);
  };

  const setFormPublished = (pub: boolean) => {
    setFormPublishedState(pub);
    localStorage.setItem('g_form_pub', pub ? 'Y' : 'N');
    showIsland(pub ? 'Registration Form Published' : 'Registration Form Unpublished');
  };

  const setAttendanceFormPublished = (pub: boolean) => {
    setAttendanceFormPublishedState(pub);
    localStorage.setItem('g_att_form_pub', pub ? 'Y' : 'N');
    showIsland(pub ? 'Attendance Form Published' : 'Attendance Form Unpublished');
  };

  const setAdminPass = (pass: string) => {
    setAdminPassState(pass);
    localStorage.setItem('g_admin_pass', pass);
    showIsland('Admin password updated');
  };

  const setMaintenance = (mode: boolean, msg: string) => {
    setMaintenanceMode(mode);
    setMaintenanceMsg(msg);
    localStorage.setItem('g_maint_mode', mode ? 'Y' : 'N');
    localStorage.setItem('g_maint_msg', msg);
    showIsland(mode ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled');
  };

  const setMaintenanceGif = (url: string) => {
    setMaintenanceGifState(url);
    localStorage.setItem('g_maint_gif', url);
    showIsland('Maintenance GIF updated');
  };

  const setDefaultCorePass = (pass: string) => {
    setDefaultCorePassState(pass);
    localStorage.setItem('g_def_core_pass', pass);
    showIsland('Default Core Password updated');
  };

  const setPermissionsGranted = (granted: boolean) => {
    setPermissionsGrantedState(granted);
    localStorage.setItem('g_perms', granted ? 'Y' : 'N');
    if (granted) showIsland('Gallery/Contacts permissions granted');
  };

  const addUserImage = (img: Omit<UploadedImage, 'id' | 'timestamp'>) => {
    setUserGallery(prev => [...prev, { ...img, id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toLocaleString() }]);
    showIsland('Photo uploaded successfully!');
  };

  const deleteUserImage = (id: string) => {
    setUserGallery(prev => prev.filter(img => img.id !== id));
    showIsland('Photo deleted');
  };

  const addMentor = (m: Omit<Mentor, 'id'>) => {
    setMentors([...mentors, { ...m, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Mentor added successfully');
  };

  const updateMentor = (id: string, m: Partial<Mentor>) => {
    setMentors(mentors.map(x => x.id === id ? { ...x, ...m } : x));
    showIsland('Mentor updated');
  };

  const deleteMentor = (id: string) => {
    setMentors(mentors.filter(x => x.id !== id));
    showIsland('Mentor removed');
  };

  const addCoreMember = (m: Omit<CoreMember, 'id'>) => {
    setCoreMembers([...coreMembers, { ...m, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Core member added');
  };

  const updateCoreMember = (id: string, m: Partial<CoreMember>) => {
    setCoreMembers(coreMembers.map(x => x.id === id ? { ...x, ...m } : x));
    showIsland('Core member updated');
  };

  const deleteCoreMember = (id: string) => {
    const member = coreMembers.find(x => x.id === id);
    if (member) {
      setCoreCreds(prev => {
        const next = { ...prev };
        const matchingCred = Object.entries(next).find(([_, cred]) => cred.name === member.name);
        if (matchingCred) {
          delete next[matchingCred[0]];
        }
        return next;
      });
    }
    setCoreMembers(coreMembers.filter(x => x.id !== id));
    showIsland('Core member removed');
  };

  const addCoreDept = (name: string, icon: string) => {
    setCoreDepts([...coreDepts, { id: Math.random().toString(36).substr(2, 9), name, icon }]);
    showIsland('Department added');
  };

  const updateCoreDept = (id: string, name: string, icon: string) => {
    setCoreDepts(coreDepts.map(d => d.id === id ? { ...d, name, icon } : d));
    showIsland('Department updated');
  };

  const deleteCoreDept = (id: string) => {
    setCoreDepts(coreDepts.filter(d => d.id !== id));
    showIsland('Department deleted');
  };

  const updateCoreCred = (id: string, cred: Partial<CoreCreds>) => {
    setCoreCreds(prev => ({...prev, [id]: { ...prev[id], ...cred }}));
    showIsland('Credentials updated');
  };

  const updateCoreId = (oldId: string, newId: string) => {
    setCoreCreds(prev => {
      const newCreds = { ...prev };
      const cred = newCreds[oldId];
      if (cred) {
        newCreds[newId] = { ...cred, id: newId };
        delete newCreds[oldId];
      }
      return newCreds;
    });
    if (coreId === oldId) setCoreId(newId);
    showIsland('Core ID renamed');
  };

  const addCoreCred = (id: string, pass: string, power: PowerLevel, name?: string, post?: string) => {
    setCoreCreds(prev => ({...prev, [id]: { id, pass, power, name, post }}));
    showIsland('New Core ID issued');
  };

  const deleteCoreCred = (id: string) => {
    setCoreCreds(prev => {
      const newCreds = {...prev};
      delete newCreds[id];
      return newCreds;
    });
    showIsland('Core ID revoked');
  };

  const addExpense = (e: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...e, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland(`${e.type === 'allotted' ? 'Budget' : 'Expense'} added`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    showIsland('Entry deleted');
  };

  const addEquipment = (e: Omit<Equipment, 'id'>) => {
    setEquipment([...equipment, { ...e, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Equipment added');
  };

  const deleteEquipment = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
    showIsland('Equipment removed');
  };

  const addHoliday = (h: Omit<Holiday, 'id'>) => {
    setHolidays([...holidays, { ...h, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Holiday added');
  };

  const updateHoliday = (id: string, h: Partial<Holiday>) => {
    setHolidays(holidays.map(x => x.id === id ? { ...x, ...h } : x));
    showIsland('Holiday updated');
  };

  const deleteHoliday = (id: string) => {
    setHolidays(holidays.filter(x => x.id !== id));
    showIsland('Holiday removed');
  };

  const setHolidayPdf = (pdf: HolidayPdf | null) => {
    setHolidayPdfState(pdf);
    if(pdf) {
      setHolidays(prev => {
        const withoutPdf = prev.filter(h => h.id !== 'pdf-sync');
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        return [{ id: 'pdf-sync', title: pdf.name, dateRange: today }, ...withoutPdf];
      });
      showIsland('Holidays PDF linked & synced');
    } else {
      setHolidays(prev => prev.filter(h => h.id !== 'pdf-sync'));
      showIsland('Holidays PDF unlinked');
    }
  };

  const addPortal = (p: Omit<Portal, 'id'>) => {
    setPortals([...portals, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Portal added');
  };
  const updatePortal = (id: string, p: Partial<Portal>) => {
    setPortals(portals.map(x => x.id === id ? { ...x, ...p } : x));
    showIsland('Portal updated');
  };
  const deletePortal = (id: string) => {
    setPortals(portals.filter(x => x.id !== id));
    showIsland('Portal deleted');
  };

  const addEvent = (e: Omit<EventItem, 'id'>) => {
    setEvents([...events, { ...e, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Event added');
  };
  const updateEvent = (id: string, e: Partial<EventItem>) => {
    setEvents(events.map(x => x.id === id ? { ...x, ...e } : x));
    showIsland('Event updated');
  };
  const deleteEvent = (id: string) => {
    setEvents(events.filter(x => x.id !== id));
    showIsland('Event deleted');
  };

  const addRegistration = (r: Omit<Registration, 'id' | 'date'>) => {
    setRegistrations([{ ...r, id: Math.random().toString(36).substr(2, 9), date: new Date().toLocaleDateString() }, ...registrations]);
    showIsland('Registration submitted');
  };

  const updateRegistration = (id: string, r: Partial<Registration>) => {
    setRegistrations(registrations.map(x => x.id === id ? { ...x, ...r } : x));
    showIsland('Registration updated');
  };

  const deleteRegistration = (id: string) => {
    setRegistrations(registrations.filter(x => x.id !== id));
    showIsland('Registration removed');
  };

  const sendMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toLocaleTimeString() }]);
  };

  return (
    <MockContext.Provider value={{
      role, coreId, coreCreds, mentors, coreMembers, coreDepts, holidays, holidayPdf, expenses, equipment, portals, events, registrations, logs, islandMessage, bgUrl, themeColor, fontFamily, tabShape, tabStyles, bannerMsg, bannerVisible, bannerType, formPublished, attendanceFormPublished, adminPass, adminLevel, maintenanceMode, maintenanceMsg, maintenanceGif, defaultCorePass, permissionsGranted, userGallery, messages,
      setIslandMessage, login, logout, setBgUrl, setThemeColor, setFontFamily, setTabShape, setTabStyle, setBanner, setFormPublished, setAttendanceFormPublished, setAdminPass, setMaintenance, setMaintenanceGif, setDefaultCorePass, setPermissionsGranted, addUserImage, deleteUserImage,
      addMentor, updateMentor, deleteMentor,
      addCoreMember, updateCoreMember, deleteCoreMember,
      addCoreDept, updateCoreDept, deleteCoreDept,
      updateCoreCred, updateCoreId, addCoreCred, deleteCoreCred,
      addExpense, deleteExpense, addEquipment, deleteEquipment,
      addHoliday, updateHoliday, deleteHoliday, setHolidayPdf,
      addPortal, updatePortal, deletePortal,
      addEvent, updateEvent, deleteEvent,
      addRegistration, updateRegistration, deleteRegistration,
      sendMessage
    }}>
      {children}
    </MockContext.Provider>
  );
}

export const useAppStore = () => {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error('Missing AppProvider');
  return ctx;
};