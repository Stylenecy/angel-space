import { useState, useEffect } from 'react'
import StarField from '../components/StarField'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

const BOOKS = ['Kejadian', 'Keluaran', 'Imamat', 'Bilangan', 'Ulangan', 'Yosua', 'Hakim-hakim', 'Rut', '1 Samuel', '2 Samuel', '1 Raja-raja', '2 Raja-raja', '1 Tawarikh', '2 Tawarikh', 'Ezra', 'Nehemia', 'Ester', 'Ayub', 'Mazmur', 'Amsal', 'Pengkhotbah', 'Kidung Agung', 'Yesaya', 'Yeremia', 'Ratapan', 'Yehezkiel', 'Daniel', 'Hosea', 'Yoel', 'Amos', 'Obaja', 'Yunus', 'Mikha', 'Nahum', 'Habakuk', 'Zefanya', 'Hagai', 'Zakharia', 'Maleakhi', 'Matius', 'Markus', 'Lukas', 'Yohanes', 'Kisah Para Rasul', 'Roma', '1 Korintus', '2 Korintus', 'Galatia', 'Efesus', 'Filipi', 'Kolose', '1 Tesalonika', '2 Tesalonika', '1 Timotius', '2 Timotius', 'Titus', 'Filemon', 'Ibrani', 'Yakobus', '1 Petrus', '2 Petrus', '1 Yohanes', '2 Yohanes', '3 Yohanes', 'Yudas', 'Wahyu']

const CHAPTER_COUNTS = {
  Kejadian: 50, Keluaran: 40, Imamat: 27, Bilangan: 36, Ulangan: 34, Yosua: 24,
  'Hakim-hakim': 21, Rut: 4, '1 Samuel': 31, '2 Samuel': 24, '1 Raja-raja': 22,
  '2 Raja-raja': 25, '1 Tawarikh': 29, '2 Tawarikh': 36, Ezra: 10, Nehemia: 13,
  Ester: 10, Ayub: 42, Mazmur: 150, Amsal: 31, Pengkhotbah: 12, 'Kidung Agung': 8,
  Yesaya: 66, Yeremia: 52, Ratapan: 5, Yehezkiel: 48, Daniel: 12, Hosea: 14,
  Yoel: 3, Amos: 9, Obaja: 1, Yunus: 4, Mikha: 7, Nahum: 3, Habakuk: 3,
  Zefanya: 3, Hagai: 2, Zakharia: 14, Maleakhi: 4, Matius: 28, Markus: 16,
  Lukas: 24, Yohanes: 21, 'Kisah Para Rasul': 28, Roma: 16, '1 Korintus': 16,
  '2 Korintus': 13, Galatia: 6, Efesus: 6, Filipi: 4, Kolose: 4, '1 Tesalonika': 5,
  '2 Tesalonika': 3, '1 Timotius': 6, '2 Timotius': 4, Titus: 3, Filemon: 1,
  Ibrani: 13, Yakobus: 5, '1 Petrus': 5, '2 Petrus': 3, '1 Yohanes': 5,
  '2 Yohanes': 1, '3 Yohanes': 1, Yudas: 1, Wahyu: 22
}

const FALLBACK_KEY = 'angel-bible-progress'
const FALLBACK_NOTE_KEY = 'angel-bible-notes'

const BOOK_FILE_NAMES = {
  Kejadian: 'kejadian', Keluaran: 'keluaran', Imamat: 'imamat', Bilangan: 'bilangan',
  Ulangan: 'ulangan', Yosua: 'yosua', 'Hakim-hakim': 'hakim_hakim', Rut: 'rut',
  '1 Samuel': '1_samuel', '2 Samuel': '2_samuel', '1 Raja-raja': '1_raja_raja',
  '2 Raja-raja': '2_raja_raja', '1 Tawarikh': '1_tawarikh', '2 Tawarikh': '2_tawarikh',
  Ezra: 'ezra', Nehemia: 'nehemia', Ester: 'ester', Ayub: 'ayub', Mazmur: 'mazmur',
  Amsal: 'amsal', Pengkhotbah: 'pengkotbah', 'Kidung Agung': 'kidung_agung',
  Yesaya: 'yesaya', Yeremia: 'yeremia', Ratapan: 'ratapan', Yehezkiel: 'yehezkiel',
  Daniel: 'daniel', Hosea: 'hosea', Yoel: 'yoel', Amos: 'amos', Obaja: 'obaja',
  Yunus: 'yunus', Mikha: 'mikha', Nahum: 'nahum', Habakuk: 'habakuk',
  Zefanya: 'zefanya', Hagai: 'hagai', Zakharia: 'zakaria', Maleakhi: 'maleakhi',
  Matius: 'matius', Markus: 'markus', Lukas: 'lukas', Yohanes: 'yohanes',
  'Kisah Para Rasul': 'kisah_para_rasul', Roma: 'roma', '1 Korintus': '1_korintus',
  '2 Korintus': '2_korintus', Galatia: 'galatia', Efesus: 'efesus', Filipi: 'filipi',
  Kolose: 'kolose', '1 Tesalonika': '1_tesalonika', '2 Tesalonika': '2_tesalonika',
  '1 Timotius': '1_timotius', '2 Timotius': '2_timotius', Titus: 'titus',
  Filemon: 'filemon', Ibrani: 'ibrani', Yakobus: 'yakobus', '1 Petrus': '1_petrus',
  '2 Petrus': '2_petrus', '1 Yohanes': '1_yohanes', '2 Yohanes': '2_yohanes',
  '3 Yohanes': '3_yohanes', Yudas: 'yudas', Wahyu: 'wahyu'
}

const PL_BOOKS = new Set([
  'Kejadian', 'Keluaran', 'Imamat', 'Bilangan', 'Ulangan', 'Yosua', 'Hakim-hakim',
  'Rut', '1 Samuel', '2 Samuel', '1 Raja-raja', '2 Raja-raja', '1 Tawarikh',
  '2 Tawarikh', 'Ezra', 'Nehemia', 'Ester', 'Ayub', 'Mazmur', 'Amsal',
  'Pengkhotbah', 'Kidung Agung', 'Yesaya', 'Yeremia', 'Ratapan', 'Yehezkiel',
  'Daniel', 'Hosea', 'Yoel', 'Amos', 'Obaja', 'Yunus', 'Mikha', 'Nahum',
  'Habakuk', 'Zefanya', 'Hagai', 'Zakharia', 'Maleakhi'
])

function cleanVerse(text) {
  return text
    .replace(/\b[A-Z]\w*\s+\d+[.:]\d+[\-\u2013]\d+\s+\d+/g, '')
    .replace(/[*\/]/g, '')
    .replace(/- (?=\S)/g, '-')
    .replace(/-{2,}/g, '—')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function getBibleUrl(book) {
  const dir = PL_BOOKS.has(book) ? 'pl' : 'pb'
  const file = BOOK_FILE_NAMES[book]
  return `https://raw.githubusercontent.com/tobiasagyasta/alkitab-api/main/lib/${dir}/${file}.json`
}

function loadFallback() {
  try { return JSON.parse(localStorage.getItem(FALLBACK_KEY)) || {} } catch { return {} }
}

function saveFallback(data) {
  try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(data)) } catch {}
}

function loadFallbackNotes() {
  try { return JSON.parse(localStorage.getItem(FALLBACK_NOTE_KEY)) || {} } catch { return {} }
}

function saveFallbackNotes(data) {
  try { localStorage.setItem(FALLBACK_NOTE_KEY, JSON.stringify(data)) } catch {}
}

function PixelButton({ children, active, onClick, className = '' }) {
  return (
    <button onClick={onClick}
      className={`font-pixel text-[0.55rem] sm:text-[0.6rem] py-3 px-4 border-2 transition-all duration-100 active:translate-y-0.5
        ${active
          ? 'bg-pixel-green/15 border-pixel-green/50 text-pixel-green shadow-[2px_2px_0_0_#38b764] cursor-default'
          : 'bg-deep-blue/80 border-warm-gold/50 text-warm-gold hover:bg-warm-gold/20 shadow-[3px_3px_0_0_#d4a853] hover:shadow-[1px_1px_0_0_#d4a853] cursor-pointer active:shadow-none' }
        ${className}`}
    >
      {children}
    </button>
  )
}

const PARTNER_CHECK_KEY = 'angel-bible-partner-check'

function getPartner(username) {
  if (!username) return null
  return username.toLowerCase() === 'dex' ? 'Angel' : 'Dex'
}

async function sendPushNotification(username, title, body) {
  try {
    await fetch('/api/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_username: username, title, body, url: '/bible' }),
    })
  } catch { /* fail silently — not critical */ }
}

export default function BibleWalk({ setPage }) {
  const { profile } = useAuth()
  const [progress, setProgress] = useState({})
  const [notes, setNotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentBook, setCurrentBook] = useState('Wahyu')
  const [chapterInput, setChapterInput] = useState('1')
  const [noteText, setNoteText] = useState('')
  const [activeTab, setActiveTab] = useState('read')
  const [verses, setVerses] = useState(null)
  const [versesLoading, setVersesLoading] = useState(false)
  const [showBibleText, setShowBibleText] = useState(true)
  const [partnerUpdates, setPartnerUpdates] = useState(null)

  const displayName = profile?.display_name || profile?.username || 'Angel'
  const bookChapters = CHAPTER_COUNTS[currentBook] || 1
  const readChapters = progress[currentBook] || []
  const chNum = Math.min(Math.max(parseInt(chapterInput) || 1, 1), bookChapters)
  const noteKey = `${currentBook}-${chNum}`
  const currentNote = notes[noteKey] || ''

  const partnerName = getPartner(profile?.username)
  const isDebug = profile?.username?.toLowerCase() === 'dex'

  useEffect(() => {
    fetchProgress()
    fetchNotes()
    fetchPartnerUpdates()
  }, [])

  useEffect(() => {
    fetchVerses()
  }, [currentBook, chNum])

  useEffect(() => {
    setNoteText(currentNote)
  }, [currentBook, chNum])

  const fetchProgress = async () => {
    const { data } = await supabase
      .from('bible_progress')
      .select('book, chapter, username')

    if (data) {
      const grouped = {}
      data.forEach(row => {
        if (!grouped[row.book]) grouped[row.book] = []
        if (!grouped[row.book].includes(row.chapter)) {
          grouped[row.book].push(row.chapter)
        }
      })
      Object.keys(grouped).forEach(b => grouped[b].sort((a, b) => a - b))
      setProgress(grouped)
    } else {
      setProgress(loadFallback())
    }
    setLoading(false)
  }

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('bible_progress')
      .select('book, chapter, note')
      .neq('note', '')

    if (data) {
      const noteMap = {}
      data.forEach(row => {
        if (row.note) noteMap[`${row.book}-${row.chapter}`] = row.note
      })
      setNotes(noteMap)
    } else {
      setNotes(loadFallbackNotes())
    }
  }

  const fetchPartnerUpdates = async () => {
    if (!partnerName) return
    const lastCheck = localStorage.getItem(PARTNER_CHECK_KEY)
    const since = lastCheck || new Date(Date.now() - 86400000).toISOString()

    const { data } = await supabase
      .from('bible_progress')
      .select('book, chapter, created_at')
      .eq('username', partnerName)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data && data.length > 0) {
      const grouped = {}
      data.forEach(r => {
        if (!grouped[r.book]) grouped[r.book] = []
        grouped[r.book].push(r.chapter)
      })
      setPartnerUpdates(grouped)
    }
  }

  const dismissPartnerUpdates = () => {
    localStorage.setItem(PARTNER_CHECK_KEY, new Date().toISOString())
    setPartnerUpdates(null)
  }

  const fetchVerses = async () => {
    setVersesLoading(true)
    setVerses(null)
    try {
      const url = getBibleUrl(currentBook)
      const res = await fetch(url)
      const data = await res.json()
      setVerses(data.chapters[String(chNum)] || [])
    } catch {
      setVerses([])
    }
    setVersesLoading(false)
  }

  const markRead = async () => {
    if (readChapters.includes(chNum)) return

    const updated = { ...progress }
    updated[currentBook] = [...readChapters, chNum].sort((a, b) => a - b)
    setProgress(updated)

    const { error } = await supabase
      .from('bible_progress')
      .insert({ username: profile?.username, book: currentBook, chapter: chNum })
      .maybeSingle()

    if (error && error.code !== '23505') {
      saveFallback(updated)
    }

    // Notify partner
    const partner = getPartner(profile?.username)
    if (partner) {
      sendPushNotification(partner, `${displayName} baca Alkitab ✨`, `${currentBook} pasal ${chNum}`)
    }
  }

  const saveNote = async () => {
    const updated = { ...notes, [noteKey]: noteText }
    setNotes(updated)

    const { error } = await supabase
      .from('bible_progress')
      .upsert(
        { username: profile?.username, book: currentBook, chapter: chNum, note: noteText },
        { onConflict: 'username,book,chapter' }
      )

    if (error) {
      saveFallbackNotes(updated)
    }

    // Notify partner about note
    if (noteText.trim()) {
      const partner = getPartner(profile?.username)
      if (partner) {
        sendPushNotification(partner, `${displayName} nulis catatan ✏️`, `${currentBook} pasal ${chNum}: "${noteText.slice(0, 60)}${noteText.length > 60 ? '...' : ''}"`)
      }
    }
  }

  const progressPercent = loading ? 0 : Math.min(100, Math.round(
    (Object.values(progress).reduce((s, chs) => s + chs.length, 0) / 1189) * 100
  ))

  const startedBooks = new Set(Object.keys(progress))
  const totalRead = Object.values(progress).reduce((sum, chs) => sum + chs.length, 0)

  const tabClass = (tab) =>
    `flex-1 font-pixel text-[0.55rem] sm:text-[0.6rem] py-3 border-2 transition-all duration-100 active:translate-y-0.5
    ${activeTab === tab
      ? 'bg-deep-blue text-warm-gold border-warm-gold/60 shadow-[2px_2px_0_0_#d4a853]'
      : 'bg-midnight text-soft-white/40 border-soft-white/10 hover:bg-deep-blue/50 hover:border-soft-white/20 cursor-pointer shadow-none'}`

  if (loading) {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen w-full bg-midnight">
        <StarField />
        <p className="font-pixel text-[0.6rem] text-warm-gold animate-pixel-blink relative z-10">Loading...</p>
      </section>
    )
  }

  return (
    <section className="relative flex flex-col items-center min-h-screen w-full bg-midnight overflow-x-hidden px-4 py-6 sm:py-8">
      <StarField />

      <button
        onClick={() => setPage('dashboard')}
        className="fixed top-4 left-4 z-50 font-pixel text-[0.5rem] sm:text-[0.55rem] text-warm-gold/60 hover:text-warm-gold border border-warm-gold/20 hover:border-warm-gold/50 px-3 py-1.5 transition-colors cursor-pointer bg-deep-blue/40 hover:bg-deep-blue/70"
      >
        ← Kembali
      </button>

      {partnerUpdates && (
        <div className="relative z-10 w-full max-w-2xl mb-4 bg-pixel-green/10 border-2 border-pixel-green/30 p-3 sm:p-4 flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-pixel text-[0.45rem] sm:text-[0.5rem] text-pixel-green mb-1.5">✨ {partnerName} baru aja baca</p>
            {Object.entries(partnerUpdates).map(([book, chapters]) => (
              <p key={book} className="font-sans text-sm sm:text-base text-soft-white/80">
                <span className="text-warm-gold">{book}</span> pasal {chapters.sort((a,b) => a-b).join(', ')}
              </p>
            ))}
            <p className="font-sans text-xs text-soft-white/30 mt-1">kamu udah baca pasal ini?</p>
          </div>
          <button onClick={dismissPartnerUpdates}
            className="font-pixel text-[0.4rem] text-soft-white/30 hover:text-soft-white/70 transition-colors cursor-pointer shrink-0 mt-0.5">
            ✕
          </button>
        </div>
      )}

      <div className="relative z-10 w-full max-w-2xl text-center mb-6 mt-16 sm:mt-12">
        <h1 className="font-pixel text-[0.7rem] sm:text-[0.85rem] text-warm-gold mb-2 tracking-wider uppercase">Bible Walk</h1>
        <p className="font-sans text-lg sm:text-xl text-soft-white/70">
          Hai {displayName}, yuk baca Alkitab bareng.
        </p>

        <div className="mt-6 flex flex-col items-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#111b3d" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="#d4a853" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPercent / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-pixel text-[0.8rem] sm:text-[0.9rem] text-warm-gold">{progressPercent}%</span>
              <span className="font-sans text-xs sm:text-sm text-soft-white/50">{totalRead}/1189</span>
            </div>
          </div>
          <p className="font-sans text-sm sm:text-base text-soft-white/40 mt-2">
            {startedBooks.size} kitab dimulai dari 66
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl flex gap-2 mb-6">
        {['read', 'progress'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={tabClass(tab)}>
            {tab === 'read' ? '☦️ Baca' : '📊 Progres'}
          </button>
        ))}
      </div>

      {activeTab === 'read' && (
        <div className="relative z-10 w-full max-w-2xl space-y-6">
          <div className="bg-deep-blue/60 border-2 border-soft-white/10 p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block font-sans text-sm text-soft-white/50 mb-1.5">Kitab</label>
                <select value={currentBook} onChange={e => setCurrentBook(e.target.value)}
                  className="w-full bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base sm:text-lg p-2.5 focus:border-warm-gold/50 outline-none cursor-pointer">
                  {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-sans text-sm text-soft-white/50 mb-1.5">Pasal</label>
                <div className="flex gap-2 items-center">
                  <input type="number" min={1} max={bookChapters} value={chapterInput}
                    onChange={e => setChapterInput(e.target.value)}
                    className="flex-1 bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base sm:text-lg p-2.5 w-20 text-center focus:border-warm-gold/50 outline-none" />
                  <span className="font-sans text-sm sm:text-base text-soft-white/40">/ {bookChapters}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <PixelButton active={readChapters.includes(chNum)} onClick={markRead}>
                {readChapters.includes(chNum) ? '✓ Sudah dibaca' : 'Tandai sudah baca'}
              </PixelButton>

              <div>
                <label className="block font-sans text-sm text-soft-white/50 mb-1.5">Catatan (1-2 kalimat)</label>
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                  className="w-full bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base sm:text-lg p-3 min-h-[90px] resize-none focus:border-warm-gold/50 outline-none" />
                <button onClick={saveNote}
                  className="mt-3 font-pixel text-[0.5rem] sm:text-[0.55rem] text-soft-white/40 hover:text-warm-gold border border-soft-white/10 hover:border-warm-gold/30 px-3 py-2 transition-colors cursor-pointer bg-midnight hover:bg-deep-blue/50">
                  💾 Simpan catatan
                </button>
              </div>
            </div>
          </div>

          {currentNote && (
            <div className="bg-deep-blue/30 border-2 border-soft-white/5 p-4 sm:p-6">
              <p className="font-sans text-sm sm:text-base text-soft-white/70 italic leading-relaxed">
                &ldquo;{currentNote}&rdquo;
              </p>
            </div>
          )}

          <div className="bg-midnight/80 border-2 border-warm-gold/10">
            <button onClick={() => setShowBibleText(v => !v)}
              className="w-full font-pixel text-[0.45rem] sm:text-[0.5rem] text-warm-gold/60 hover:text-warm-gold py-2.5 px-4 text-left flex items-center justify-between transition-colors cursor-pointer bg-deep-blue/30 hover:bg-deep-blue/50">
              <span>📖 {currentBook} {chNum}</span>
              <span>{showBibleText ? '▲' : '▼'}</span>
            </button>
            {showBibleText && (
              <div className="p-4 sm:p-6 max-h-[500px] overflow-y-auto space-y-1">
                {versesLoading && (
                  <p className="font-sans text-sm text-soft-white/30 text-center py-4">Memuat...</p>
                )}
                {verses && verses.length === 0 && !versesLoading && (
                  <p className="font-sans text-sm text-soft-white/30 text-center py-4">Teks belum tersedia</p>
                )}
                {verses && verses.map(v => (
                  <p key={v.verse} className="font-sans text-sm sm:text-base text-soft-white/80 leading-relaxed">
                    <sup className="text-warm-gold/60 text-[0.65rem] mr-1.5">{v.verse}</sup>
                    {cleanVerse(v.text)}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="relative z-10 w-full max-w-2xl space-y-3">
          {BOOKS.map(book => {
            const chs = progress[book]
            if (!chs || chs.length === 0) return null
            return (
              <div key={book} className="bg-deep-blue/40 border-2 border-soft-white/5 p-3 sm:p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-sans text-sm sm:text-base text-soft-white/80">{book}</span>
                  <span className="font-pixel text-[0.4rem] sm:text-[0.45rem] text-warm-gold/60">{chs.length}/{CHAPTER_COUNTS[book]}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: CHAPTER_COUNTS[book] }, (_, i) => i + 1).map(ch => (
                    <span key={ch}
                      className={`inline-block w-6 h-6 sm:w-7 sm:h-7 text-center leading-6 sm:leading-7 text-[0.55rem] sm:text-[0.6rem] font-pixel
                        ${chs.includes(ch) ? 'bg-pixel-green text-midnight' : 'bg-midnight border border-soft-white/10 text-soft-white/20'}`}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
          {totalRead === 0 && !loading && (
            <p className="text-center font-sans text-base sm:text-lg text-soft-white/30 py-12">
              Belum ada progres. Mulai baca dulu, yuk!
            </p>
          )}
        </div>
      )}
    </section>
  )
}
