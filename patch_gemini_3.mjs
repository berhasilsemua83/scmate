import fs from 'fs';
let code = fs.readFileSync('services/geminiService.ts', 'utf8');

const regexGenerate = /async function generateContentWithFallback\(ai: any, request: any\) \{[\s\S]*?throw lastError;\n\}/;

const replacementGenerate = `async function generateContentWithFallback(initialAi: any, request: any) {
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

code = code.replace(regexGenerate, replacementGenerate);
fs.writeFileSync('services/geminiService.ts', code);
