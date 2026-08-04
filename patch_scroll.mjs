import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  "const resultsRef = useRef<HTMLDivElement>(null);",
  "const resultsRef = useRef<HTMLDivElement>(null);\n  const rightColumnRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    if (isLoading && rightColumnRef.current) {\n        // Use a small timeout to allow UI to render the loading indicator before scrolling\n        setTimeout(() => {\n           rightColumnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });\n        }, 50);\n    }\n  }, [isLoading]);"
);

code = code.replace(
  '<div className="lg:col-span-8 space-y-8">',
  '<div className="lg:col-span-8 space-y-8" ref={rightColumnRef}>'
);

fs.writeFileSync('App.tsx', code);
