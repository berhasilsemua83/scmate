import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  "import ManualBook from './components/ManualBook';",
  "import ManualBook from './components/ManualBook';\nimport { openAffiliateLink } from './components/affiliateLinks';"
);

code = code.replace(
  "const handleSubmit = async (e: React.FormEvent) => {\n    // ... existing implementation ...\n    e.preventDefault();\n    setIsLoading(true);",
  "const handleSubmit = async (e: React.FormEvent) => {\n    // ... existing implementation ...\n    e.preventDefault();\n    openAffiliateLink(); // Add affiliate link popup\n    setIsLoading(true);"
);

fs.writeFileSync('App.tsx', code);
