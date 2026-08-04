import fs from 'fs';
const code = `import React from 'react';
import Icon from './Icon';

interface ManualBookProps {
    isOpen: boolean;
    onClose: () => void;
}

const ManualBook: React.FC<ManualBookProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-slate-800 border border-slate-700 p-2 md:p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-slate-800 z-10 pb-4 mb-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                        <Icon type="document" className="w-6 h-6 text-indigo-400" />
                        Panduan Penggunaan ScriptMate AI
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-white hover:text-white bg-rose-500 hover:bg-rose-600 rounded-lg px-4 py-2 flex items-center gap-2 font-bold transition-colors shadow-lg"
                        title="Tutup Panduan"
                    >
                        <Icon type="close" className="w-5 h-5" />
                        <span className="hidden sm:inline">Tutup</span>
                    </button>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                    <p>
                        Selamat datang di <strong>ScriptMate AI</strong>! Aplikasi ini dirancang untuk membantu Anda menulis naskah (skrip) konten yang menarik secara otomatis menggunakan AI. 
                        Sangat cocok untuk konten TikTok, Instagram Reels, YouTube Shorts, maupun artikel blog.
                    </p>

                    <details className="bg-slate-900/60 rounded-xl border border-slate-700 group" open>
                        <summary className="p-4 font-bold text-indigo-400 cursor-pointer flex items-center justify-between outline-none hover:bg-slate-800/50 rounded-xl transition-colors">
                            <span className="flex items-center gap-2">
                                <Icon type="edit" className="w-5 h-5" />
                                1. Mode Umum (Edukasi, Cerita, Opini)
                            </span>
                            <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 mt-2">
                            <p className="mb-2">Gunakan mode ini untuk membuat konten edukasi, cerita, opini, atau hiburan. Cukup masukkan "Topik / Ide Cerita" yang ingin Anda bahas.</p>
                            <ul className="list-disc pl-5 space-y-2 mb-3">
                                <li><strong>Rumus Storytelling:</strong> Anda bisa memilih struktur penceritaan. Misalnya, formula <em>AIDA (Attention, Interest, Desire, Action)</em>, <em>PAS (Problem, Agitate, Solve)</em>, atau biarkan <em>Auto/Campur</em> untuk menyerahkan pada AI.</li>
                                <li><strong>Durasi & Jumlah Skrip:</strong> Tentukan panjang konten dan berapa opsi skrip yang ingin dihasilkan (Maksimal 5 untuk gratis).</li>
                                <li><strong>Gaya Bahasa:</strong> Pilih nada bicara yang sesuai dengan personal branding Anda (Formal, Santai, Lucu, dll).</li>
                            </ul>
                        </div>
                    </details>

                    <details className="bg-slate-900/60 rounded-xl border border-slate-700 group">
                        <summary className="p-4 font-bold text-emerald-400 cursor-pointer flex items-center justify-between outline-none hover:bg-slate-800/50 rounded-xl transition-colors">
                            <span className="flex items-center gap-2">
                                <Icon type="sparkles" className="w-5 h-5" />
                                2. Mode Jualan (Promosi Produk)
                            </span>
                            <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 mt-2">
                            <p className="mb-2">Khusus untuk membuat skrip promosi produk. Anda akan menemukan menu yang lebih kompleks di mode ini:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-3">
                                <li><strong>Info Produk:</strong> Masukkan Nama Produk dan Deskripsi Produk Anda agar AI memahami apa yang Anda jual.</li>
                                <li><strong>Menu Kompleks (Rumus):</strong>
                                    <ul className="list-circle pl-5 mt-1 space-y-1 text-slate-400">
                                        <li><strong>Pilihan Storytelling:</strong> Pilih rumus copywriting seperti AIDA, PAS, atau fitur keunggulan produk.</li>
                                        <li><strong>Rumus Relate:</strong> Strategi pendekatan emosional ke audiens (misal: "Gelisah ke Solusi", "Curhat", atau "FOMO - Takut Ketinggalan").</li>
                                    </ul>
                                </li>
                                <li><strong>Target Audiens:</strong> Tentukan siapa yang akan menonton video Anda (Ibu-ibu, Gen Z, Pekerja Kantoran, dll).</li>
                                <li><strong>Opsi Hard Selling:</strong> Aktifkan ini jika ingin gaya promosi yang sangat agresif langsung menawarkan produk.</li>
                            </ul>
                        </div>
                    </details>

                    <details className="bg-slate-900/60 rounded-xl border border-slate-700 group">
                        <summary className="p-4 font-bold text-rose-400 cursor-pointer flex items-center justify-between outline-none hover:bg-slate-800/50 rounded-xl transition-colors">
                            <span className="flex items-center gap-2">
                                <Icon type="adjust" className="w-5 h-5" />
                                3. Mode Spesialis (Khusus Platform Tertentu)
                            </span>
                            <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 mt-2">
                            <p className="mb-2">Mode ini dirancang khusus dengan aturan kepatuhan (compliance) untuk platform tertentu seperti TikTok Shop atau Shopee Video.</p>
                            <ul className="list-disc pl-5 space-y-2 mb-3">
                                <li><strong>Mode Aman (Strict Compliance):</strong> AI akan sangat berhati-hati dan menghindari kata-kata terlarang (banned words) yang sering membuat konten terkena shadowban atau pelanggaran komunitas (seperti klaim berlebihan, kata "Gratis", "Garansi 100%", atau medis). Sangat disarankan untuk akun jualan.</li>
                                <li><strong>Mode Bebas:</strong> AI bisa lebih kreatif dan menggunakan kata-kata marketing yang lebih agresif tanpa batasan strict. Gunakan jika Anda merasa aman atau platform yang Anda gunakan lebih longgar.</li>
                            </ul>
                        </div>
                    </details>

                    <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/30 shadow-inner">
                        <h3 className="text-indigo-400 font-bold text-base mb-2 flex items-center gap-2">
                            <Icon type="document" className="w-5 h-5" />
                            Fitur Lainnya
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-indigo-200">
                            <li><strong className="text-white">Hasil Skrip & Riwayat:</strong> Semua skrip yang Anda buat akan otomatis tersimpan. Anda bisa mengedit, copy, atau mengunduhnya sebagai file .txt.</li>
                            <li><strong className="text-white">Fitur Premium:</strong> Ada mode "Cari Ide Konten", "Produksi Gambar" (termasuk karakter dan promt otomatis), serta opsi untuk menghasilkan lebih dari 5 skrip di versi lengkap.</li>
                        </ul>
                    </div>

                    <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 shadow-inner">
                        <h3 className="text-emerald-400 font-bold text-base mb-2 flex items-center gap-2">
                            <Icon type="check" className="w-5 h-5" />
                            Pengaturan API Key (Penting!)
                        </h3>
                        <p className="mb-2 text-emerald-100">Untuk menggunakan fitur pembuatan skrip otomatis, Anda perlu memasukkan API Key milik Anda sendiri:</p>
                        <ul className="list-disc pl-5 space-y-2 text-emerald-200">
                            <li>Klik tombol <strong>Pengaturan (Ikon Gear ⚙️)</strong> di pojok kanan atas aplikasi.</li>
                            <li>Masukkan <strong>Gemini API Key</strong> Anda pada kolom yang disediakan, lalu simpan.</li>
                            <li>Anda bisa mendapatkan API Key secara gratis melalui Google AI Studio.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualBook;
`;

fs.writeFileSync('components/ManualBook.tsx', code);
