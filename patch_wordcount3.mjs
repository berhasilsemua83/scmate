import fs from 'fs';
let code = fs.readFileSync('services/geminiService.ts', 'utf8');

const oldBlock = `        ATURAN LAIN:
        - \${formData.hardSelling ? 'Hard Selling (Tetap Human-Centric).' : 'Soft Selling.'}
        - \${formData.seoFriendly ? 'SEO Friendly.' : ''}
        - Hitung jumlah kata dari "scriptContent" yang dihasilkan dan masukkan angka pastinya ke field "wordCount".`;

const newBlock = `        ATURAN LAIN:
        - \${formData.hardSelling ? 'Hard Selling (Tetap Human-Centric).' : 'Soft Selling.'}
        - \${formData.seoFriendly ? 'SEO Friendly.' : ''}
        \${totalSeconds > 0 ? \`- BATASAN DURASI (\${totalSeconds} detik): Target jumlah kata maksimal adalah \${Math.floor(totalSeconds * 2.5)} kata (asumsi 150 kata/menit). Jika bank kalimat/hook terlalu panjang, Anda DIIZINKAN dan DIWAJIBKAN memparafrase/mempersingkatnya agar durasi skrip tidak over.\` : ''}
        - Hitung jumlah kata dari "scriptContent" yang dihasilkan dan masukkan angka pastinya ke field "wordCount".`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('services/geminiService.ts', code);
