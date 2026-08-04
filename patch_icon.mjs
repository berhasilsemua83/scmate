import fs from 'fs';
let code = fs.readFileSync('components/Icon.tsx', 'utf8');

code = code.replace(
  "type: 'copy' | 'delete' | 'sparkles' | 'history' | 'check' | 'download' | 'edit' | 'preview' | 'regenerate' | 'adjust' | 'document' | 'trash';",
  "type: 'copy' | 'delete' | 'sparkles' | 'history' | 'check' | 'download' | 'edit' | 'preview' | 'regenerate' | 'adjust' | 'document' | 'trash' | 'close';"
);

const closeSvg = `
  close: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
`;

code = code.replace("const icons = {", "const icons = {\n" + closeSvg);

fs.writeFileSync('components/Icon.tsx', code);
