import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');

const oldTry = `    try {
      const result = await generateScripts(formData);`;
const newTry = `    try {
      const result = await generateScripts(formData);
      await incrementUsageLimit();`;

code = code.replace(oldTry, newTry);
fs.writeFileSync('App.tsx', code);
