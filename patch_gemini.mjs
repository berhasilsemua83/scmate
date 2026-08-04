import fs from 'fs';
let code = fs.readFileSync('services/geminiService.ts', 'utf8');

// Replace getApiKey and add API rotation logic
code = code.replace(
  `let _customApiKey = "";
export function setApiKey(key: string) {
  _customApiKey = key;
}
function getApiKey(): string {
  return _customApiKey || process.env.API_KEY || "";
}`,
  `let _customApiKey = "";
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
}
`
);

// Replace generateContentWithFallback
const oldGenerate = `async function generateContentWithFallback(ai: any, request: any) {
    let modelsToTry = [request.model];
    // Apply fallback logic
    if (request.model.includes('flash') || request.model.includes('pro')) {
        modelsToTry = [...new Set([request.model, ...textModels])];
    }
        
    let lastError: any = null;
    for (const modelName of modelsToTry) {
        try {
            console.log("Trying model: " + modelName);
            const response = await ai.models.generateContent({
                ...request,
                model: modelName
            });
            return response;
        } catch (error: any) {
            console.warn("Model " + modelName + " failed:", error?.message || error);
            lastError = error;
            // try next model
        }
    }
    throw lastError;
}`;

const newGenerate = `async function generateContentWithFallback(initialAi: any, request: any) {
    let currentAi = initialAi;
    let modelsToTry = [request.model];
    // Apply fallback logic
    if (request.model.includes('flash') || request.model.includes('pro')) {
        modelsToTry = [...new Set([request.model, ...textModels])];
    }
        
    let lastError: any = null;
    
    while (true) {
        for (const modelName of modelsToTry) {
            try {
                console.log("Trying model: " + modelName + " with key index: " + currentServerKeyIndex);
                const response = await currentAi.models.generateContent({
                    ...request,
                    model: modelName
                });
                return response;
            } catch (error: any) {
                console.warn("Model " + modelName + " failed:", error?.message || error);
                lastError = error;
                const errorMsg = String(error?.message || error).toLowerCase();
                if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('resource exhausted')) {
                   break;
                }
            }
        }
        
        const errorMsg = String(lastError?.message || lastError).toLowerCase();
        if (!_customApiKey && SERVER_API_KEYS.length > 0 && (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('resource exhausted'))) {
            currentServerKeyIndex++;
            if (currentServerKeyIndex < SERVER_API_KEYS.length) {
                console.log("Switching to API Key index: " + currentServerKeyIndex);
                currentAi = new GoogleGenAI({ apiKey: SERVER_API_KEYS[currentServerKeyIndex] });
                continue;
            } else {
                throw new Error("QUOTA_EXHAUSTED");
            }
        }
        
        throw lastError;
    }
}`;

code = code.replace(oldGenerate, newGenerate);

fs.writeFileSync('services/geminiService.ts', code);
