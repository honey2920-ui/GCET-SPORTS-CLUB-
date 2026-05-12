const fs = require('fs');
const path = require('path');

const dirs = ['client/src/components', 'client/src'];
const replacements = {
  'bg-white': 'bg-[#1e293b]',
  'border-slate-200': 'border-slate-700',
  'bg-slate-50': 'bg-slate-800',
  'bg-slate-100': 'bg-slate-700',
  'hover:bg-slate-50': 'hover:bg-slate-700',
  'hover:bg-slate-100': 'hover:bg-slate-600',
  'text-slate-900': 'text-white',
  'text-slate-700': 'text-slate-200',
  'text-slate-600': 'text-slate-300',
  'text-slate-500': 'text-slate-400',
  'border-slate-100': 'border-slate-600',
  'bg-amber-50': 'bg-amber-500/10',
  'border-amber-200': 'border-amber-500/20',
  'text-amber-900': 'text-amber-100',
  'text-amber-800': 'text-amber-200',
  'text-amber-700': 'text-amber-300',
  'text-amber-600': 'text-amber-400',
  'bg-amber-100': 'bg-amber-500/20',
  'hover:bg-amber-200': 'hover:bg-amber-500/30',
  'border-amber-300': 'border-amber-500/30',
  'hover:bg-amber-50': 'hover:bg-amber-500/20',
  'bg-red-50': 'bg-red-500/10',
  'border-red-200': 'border-red-500/20',
  'hover:bg-red-100': 'hover:bg-red-500/20',
  'bg-blue-50': 'bg-blue-500/10',
  'border-blue-200': 'border-blue-500/20',
  'hover:bg-blue-100': 'hover:bg-blue-500/20',
  'text-blue-600': 'text-blue-400',
  'text-red-600': 'text-red-400',
};

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Apply replacements iteratively
    for (const [oldStr, newStr] of Object.entries(replacements)) {
      content = content.split(oldStr).join(newStr);
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  });
});
