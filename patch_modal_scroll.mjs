import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');

const targetStr = \`<div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"\`;

const replacement = \`<div 
            ref={(el) => {
                if (el && !el.dataset.scrolled) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.dataset.scrolled = "true";
                }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"\`;

// replace all instances (there are 2 modals: quota and paywall, wait, let's just do split join)
code = code.split(targetStr).join(replacement);

fs.writeFileSync('App.tsx', code);
