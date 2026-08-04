const fs = require('fs');
let code = fs.readFileSync('services/geminiService.ts', 'utf8');

const fallbackCode = `
const textModels = [
    "gemini-pro-latest",
    "gemini-3.1-pro-preview",
    "gemini-3.5-flash",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-preview-09-2025",
    "gemini-1.5-pro",
    "gemini-1.5-flash"
];

async function generateContentWithFallback(ai: any, request: any) {
    let modelsToTry = [request.model];
    // If it's a text task (e.g. using a text model), we apply the fallback
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
            // if we hit an error, we try the next one
        }
    }
    throw lastError;
}
`;

code = code.replace('function getApiKey(): string {\n  return _customApiKey || process.env.API_KEY || "";\n}', 'function getApiKey(): string {\n  return _customApiKey || process.env.API_KEY || "";\n}\n' + fallbackCode);

code = code.replace(/await ai\.models\.generateContent\(/g, 'await generateContentWithFallback(ai, ');

fs.writeFileSync('services/geminiService.ts', code);
