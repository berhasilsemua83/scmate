import fs from 'fs';
let code = fs.readFileSync('services/geminiService.ts', 'utf8');

const regex = /let _customApiKey = "";[\s\S]*?function getApiKey\(\): string \{[\s\S]*?return _customApiKey \|\| process\.env\.API_KEY \|\| "";\n\}/;

const replacement = `let _customApiKey = "";
export function setApiKey(key: string) {
  _customApiKey = key;
}

const SERVER_API_KEYS = [
    import.meta.env.VITE_API_KEY_1,
    import.meta.env.VITE_API_KEY_2,
    import.meta.env.VITE_API_KEY_3,
    import.meta.env.VITE_API_KEY_4,
    import.meta.env.VITE_API_KEY_5,
].filter(key => Boolean(key && key.trim()));

let currentServerKeyIndex = 0;

function getApiKey(): string {
  if (_customApiKey) return _customApiKey;
  if (currentServerKeyIndex < SERVER_API_KEYS.length) {
      return SERVER_API_KEYS[currentServerKeyIndex];
  }
  return ""; // Exhausted
}

export async function checkUsageLimit(): Promise<boolean> {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        
        const today = new Date().toISOString().split('T')[0];
        const storageKey = \`usage_limit_\${ip}\`;
        
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            const usage = JSON.parse(stored);
            if (usage.date === today && usage.count >= 3) {
                return false; // Limit reached
            }
        }
        return true;
    } catch (error) {
        console.warn("Could not check IP limit", error);
        return true;
    }
}

export async function incrementUsageLimit(): Promise<void> {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        
        const today = new Date().toISOString().split('T')[0];
        const storageKey = \`usage_limit_\${ip}\`;
        
        const stored = localStorage.getItem(storageKey);
        let usage = { date: today, count: 0 };
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.date === today) {
                usage = parsed;
            }
        }
        usage.count++;
        localStorage.setItem(storageKey, JSON.stringify(usage));
    } catch (error) {
         console.warn("Could not increment IP limit", error);
    }
}`;

code = code.replace(regex, replacement);
fs.writeFileSync('services/geminiService.ts', code);
