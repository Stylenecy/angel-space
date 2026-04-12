import { useState } from 'react';
import StarField from '../components/StarField';

const randomMessages = [
  "jangan lupa minum air putih ya hari ini.",
  "nggak apa-apa kalau progress hari ini pelan. siput juga akhirnya sampai tujuan.",
  "makan makanan kesukaanmu hari ini, you deserve it.",
  "coba lihat ke langit sebentar, tarik napas yang dalam.",
  "dunia mungkin berisik, tapi di sini kamu aman.",
  "kamu nggak harus punya semua jawaban sekarang.",
  "istirahat itu bukan kelemahan — itu bagian dari proses.",
  "ada yang bangga sama kamu, meskipun kamu lagi ngerasa sendirian.",
  "satu langkah kecil hari ini sudah lebih dari cukup.",
  "kamu tumbuh, meskipun kadang nggak kerasa.",
  "boleh pelan, yang penting jangan berhenti.",
  "kamu lebih kuat dari yang kamu kira.",
];

const getRandomMsg = () => randomMessages[Math.floor(Math.random() * randomMessages.length)];

export default function Random({ setPage }) {
  const [msg, setMsg] = useState(getRandomMsg);

  const refreshMsg = () => {
    let next;
    do { next = getRandomMsg(); } while (next === msg && randomMessages.length > 1);
    setMsg(next);
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 overflow-hidden select-none">
      <StarField />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        <div className="font-pixel text-[0.55rem] text-soft-white/30 tracking-widest mb-6">
          ✦ pesan untukmu ✦
        </div>

        <div className="bg-deep-blue/80 border-2 border-warm-gold shadow-[4px_4px_0_0_#d4a853] p-8 w-full mb-8 min-h-[160px] flex items-center justify-center text-center">
          <p className="font-sans text-lg md:text-xl leading-relaxed text-soft-white">
            {msg}
          </p>
        </div>

        <div className="flex gap-4">
          <button onClick={refreshMsg} className="pixel-btn text-[0.6rem] md:text-xs">
            pesan lain 🎲
          </button>
          <button
            onClick={() => setPage('menu')}
            className="pixel-btn text-[0.6rem] md:text-xs !bg-transparent border-soft-white/30 text-soft-white/50 hover:text-soft-white hover:border-soft-white/70 shadow-none"
          >
            &lt; kembali
          </button>
        </div>
      </div>
    </section>
  );
}
