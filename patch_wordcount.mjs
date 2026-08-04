import fs from 'fs';
let code = fs.readFileSync('services/geminiService.ts', 'utf8');

const regex = /ATURAN LAIN:\\n        - \$\{formData\.hardSelling \? 'Hard Selling \(Tetap Human-Centric\)\.' : 'Soft Selling\.'\}\\n        - \$\{formData\.seoFriendly \? 'SEO Friendly\.' : ''\}/;

const replacement = \`ATURAN LAIN:\\n        - \$\{formData.hardSelling ? 'Hard Selling (Tetap Human-Centric).' : 'Soft Selling.'\}\\n        - \$\{formData.seoFriendly ? 'SEO Friendly.' : ''\}\\n        \$\{totalSeconds > 0 ? \`- BATASAN DURASI (\$\{totalSeconds\} detik): Target jumlah kata maksimal adalah \$\{Math.floor(totalSeconds * 2.5)\} kata (asumsi 150 kata/menit). Jika bank kalimat/hook terlalu panjang, Anda DIIZINKAN dan DIWAJIBKAN memparafrase/mempersingkatnya agar durasi tidak over.\` : ''\}\`;

code = code.replace(regex, replacement);
fs.writeFileSync('services/geminiService.ts', code);
