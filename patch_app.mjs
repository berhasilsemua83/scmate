import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  "import { generateScripts, generateImage, generateVideoPrompt, generateTextToVideoPrompt, generateVeo3VideoPrompt, detectImageGender, generateLongFormContent, generateContentIdeas, generateCharacterSession, generateCreativeImagePrompts, generateAdvancedImages, generateFlowVideoPrompt, setApiKey } from './services/geminiService';",
  "import { generateScripts, generateImage, generateVideoPrompt, generateTextToVideoPrompt, generateVeo3VideoPrompt, detectImageGender, generateLongFormContent, generateContentIdeas, generateCharacterSession, generateCreativeImagePrompts, generateAdvancedImages, generateFlowVideoPrompt, setApiKey, checkUsageLimit, incrementUsageLimit } from './services/geminiService';"
);

// 2. Add state
code = code.replace(
  "const [showPaywall, setShowPaywall] = useState(false);",
  "const [showPaywall, setShowPaywall] = useState(false);\n  const [showQuotaModal, setShowQuotaModal] = useState(false);"
);

// 3. Update handleSubmit
code = code.replace(
  `  const handleSubmit = async (e: React.FormEvent) => {
    // ... existing implementation ...
    e.preventDefault();
    openAffiliateLink(); // Add affiliate link popup
    setIsLoading(true);`,
  `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    openAffiliateLink();
    
    // IP Rate Limiting Check
    const isAllowed = await checkUsageLimit();
    if (!isAllowed) {
        setShowPaywall(true);
        return;
    }

    setIsLoading(true);`
);

// 4. Update try/catch inside handleSubmit to increment limit and handle QUOTA_EXHAUSTED
const tryBlock = `    try {
      const result = await generateScripts(
          formData.topic,
          formData.productName,
          formData.productDesc,
          formData.duration,
          formData.scriptCount,
          formData.tone,
          formData.audience,
          formData.mode,
          formData.generateImagePrompts,
          formData.enableLipsync,
          formData.referenceScript,
          formData.seoFriendly,
          formData.storytellingFormula,
          formData.relateFormula,
          formData.strictCompliance,
          formData.hardSelling
      );
      
      // Auto-generate lipsync videos or images if enabled
      if (formData.enableLipsync && result.length > 0) {`;

const newTryBlock = `    try {
      const result = await generateScripts(
          formData.topic,
          formData.productName,
          formData.productDesc,
          formData.duration,
          formData.scriptCount,
          formData.tone,
          formData.audience,
          formData.mode,
          formData.generateImagePrompts,
          formData.enableLipsync,
          formData.referenceScript,
          formData.seoFriendly,
          formData.storytellingFormula,
          formData.relateFormula,
          formData.strictCompliance,
          formData.hardSelling
      );
      
      await incrementUsageLimit(); // Increment successful generation
      
      // Auto-generate lipsync videos or images if enabled
      if (formData.enableLipsync && result.length > 0) {`;

code = code.replace(tryBlock, newTryBlock);

const catchBlock = `    } catch (err: any) {
      console.error("Failed to generate script", err);
      setError(err.message || "Terjadi kesalahan saat membuat skrip.");
    } finally {`;

const newCatchBlock = `    } catch (err: any) {
      console.error("Failed to generate script", err);
      if (err.message === "QUOTA_EXHAUSTED") {
          setShowQuotaModal(true);
          setError("Kuota server habis. Silakan masukkan API Key Anda sendiri.");
      } else {
          setError(err.message || "Terjadi kesalahan saat membuat skrip.");
      }
    } finally {`;

code = code.replace(catchBlock, newCatchBlock);

// 5. Add Quota Exhausted Modal UI at the bottom
const modals = `{showPaywall && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setShowPaywall(false)}
        >`;

const quotaModalStr = `{showQuotaModal && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setShowQuotaModal(false)}
        >
            <div 
                className="bg-slate-800 border border-slate-700 p-6 rounded-xl max-w-sm w-full shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={() => setShowQuotaModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <Icon type="close" className="w-5 h-5" />
                </button>
                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mb-4">
                        <Icon type="delete" className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Kuota Server Habis</h3>
                    <p className="text-slate-300 text-sm">
                        Mohon maaf, kuota harian dari API Key server kami telah habis digunakan oleh pengguna lain. 
                        <br/><br/>
                        Silakan masukkan <strong>Gemini API Key</strong> Anda sendiri melalui ikon pengaturan (⚙️) di pojok kanan atas agar tetap bisa menggunakan aplikasi.
                    </p>
                </div>
                <button 
                    onClick={() => {
                        setShowQuotaModal(false);
                    }}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors border border-slate-600"
                >
                    Tutup & Mengerti
                </button>
            </div>
        </div>
      )}

      {showPaywall && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setShowPaywall(false)}
        >`;

code = code.replace(modals, quotaModalStr);

fs.writeFileSync('App.tsx', code);
