import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');

const regex = /const handleGenerateLongForm = useCallback\(async \(scriptId: string\) => \{[\s\S]*?\}, \[generatedScripts, history, formData\]\);/;

const replacement = `const handleGenerateLongForm = useCallback(async (scriptId: string) => {
      setShowPaywall(true);
  }, []);`;

code = code.replace(regex, replacement);
fs.writeFileSync('App.tsx', code);
