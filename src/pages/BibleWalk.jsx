import { useState, useEffect } from 'react'
import StarField from '../components/StarField'
import { useAuth } from '../hooks/useAuth'
import { partnerOf } from '../lib/accounts'
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

const PL_BOOK_LIST = BOOKS.filter(b => PL_BOOKS.has(b))
const PB_BOOK_LIST = BOOKS.filter(b => !PL_BOOKS.has(b))

const getPartner = partnerOf

// Group flat bible_progress rows -> { Book: [chapters...] } (sorted, unique).
function groupRows(rows) {
  const grouped = {}
  rows.forEach(row => {
    if (!grouped[row.book]) grouped[row.book] = []
    if (!grouped[row.book].includes(row.chapter)) grouped[row.book].push(row.chapter)
  })
  Object.keys(grouped).forEach(b => grouped[b].sort((a, b) => a - b))
  return grouped
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
  const { profile, partner, signOut } = useAuth()
  const me = profile?.username
  const [progress, setProgress] = useState({})          // MY progress (scoped to me)
  const [partnerProgress, setPartnerProgress] = useState({}) // partner's progress (read-only)
  const [notes, setNotes] = useState({})                // MY notes (scoped to me)
  const [whoseProgress, setWhoseProgress] = useState('me') // 'me' | 'partner' — Progres tab toggle
  const [loading, setLoading] = useState(true)
  const [currentBook, setCurrentBook] = useState('Wahyu')
  const [chapterInput, setChapterInput] = useState('1')
  const [noteText, setNoteText] = useState('')
  const [activeTab, setActiveTab] = useState('read')
  const [verses, setVerses] = useState(null)
  const [versesLoading, setVersesLoading] = useState(false)
  const [showBibleText, setShowBibleText] = useState(true)
  const [partnerUpdates, setPartnerUpdates] = useState(null)
  const [justRead, setJustRead] = useState(false)
  const [showBookJump, setShowBookJump] = useState(false)

  const displayName = profile?.display_name || profile?.username || 'Angel'
  const bookChapters = CHAPTER_COUNTS[currentBook] || 1
  const readChapters = progress[currentBook] || []
  const chNum = Math.min(Math.max(parseInt(chapterInput) || 1, 1), bookChapters)
  const noteKey = `${currentBook}-${chNum}`
  const currentNote = notes[noteKey] || ''

  const partnerName = partner || getPartner(me)

  const isLastChapter = chNum >= bookChapters
  const bookIdx = BOOKS.indexOf(currentBook)
  const hasNextBook = bookIdx < BOOKS.length - 1

  // Navigate to a specific book/chapter and scroll to top of reading area
  const goTo = (book, chapter) => {
    setJustRead(false)
    if (book && book !== currentBook) setCurrentBook(book)
    setChapterInput(String(chapter))
    setActiveTab('read')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Go to the next chapter — rolls over into the next book at the end
  const goNextChapter = () => {
    if (!isLastChapter) {
      goTo(currentBook, chNum + 1)
    } else if (hasNextBook) {
      goTo(BOOKS[bookIdx + 1], 1)
    }
  }

  const goPrevChapter = () => {
    if (chNum > 1) {
      goTo(currentBook, chNum - 1)
    } else if (bookIdx > 0) {
      const prevBook = BOOKS[bookIdx - 1]
      goTo(prevBook, CHAPTER_COUNTS[prevBook] || 1)
    }
  }

  useEffect(() => {
    fetchProgress()
    fetchNotes()
    fetchPartnerProgress()
    fetchPartnerUpdates()
  // Re-scope everything if the logged-in account changes mid-session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])

  useEffect(() => {
    fetchVerses()
  }, [currentBook, chNum])

  useEffect(() => {
    setNoteText(currentNote)
    setJustRead(false)
  }, [currentBook, chNum])

  const fetchProgress = async () => {
    if (!me) { setProgress(loadFallback()); setLoading(false); return }
    // STRICTLY scoped to the logged-in account — never the union of both people.
    const { data } = await supabase
      .from('bible_progress')
      .select('book, chapter')
      .eq('username', me)

    if (data) {
      setProgress(groupRows(data))
    } else {
      setProgress(loadFallback())
    }
    setLoading(false)
  }

  const fetchPartnerProgress = async () => {
    if (!partnerName) { setPartnerProgress({}); return }
    const { data } = await supabase
      .from('bible_progress')
      .select('book, chapter')
      .eq('username', partnerName)

    if (data) setPartnerProgress(groupRows(data))
    else setPartnerProgress({})
  }

  const fetchNotes = async () => {
    if (!me) { setNotes(loadFallbackNotes()); return }
    // MY notes only — scoped to the logged-in account.
    const { data } = await supabase
      .from('bible_progress')
      .select('book, chapter, note')
      .eq('username', me)
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
    setJustRead(true)

    const { error } = await supabase
      .from('bible_progress')
      .insert({ username: me, book: currentBook, chapter: chNum })
      .maybeSingle()

    if (error && error.code !== '23505') {
      saveFallback(updated)
    }

    // Notify partner
    if (partnerName) {
      sendPushNotification(partnerName, `${displayName} baca Alkitab ✨`, `${currentBook} pasal ${chNum}`)
    }
  }

  const saveNote = async () => {
    const updated = { ...notes, [noteKey]: noteText }
    setNotes(updated)

    const { error } = await supabase
      .from('bible_progress')
      .upsert(
        { username: me, book: currentBook, chapter: chNum, note: noteText },
        { onConflict: 'username,book,chapter' }
      )

    if (error) {
      saveFallbackNotes(updated)
    }

    // Notify partner about note
    if (noteText.trim() && partnerName) {
      sendPushNotification(partnerName, `${displayName} nulis catatan ✏️`, `${currentBook} pasal ${chNum}: "${noteText.slice(0, 60)}${noteText.length > 60 ? '...' : ''}"`)
    }
  }

  const TOTAL_CHAPTERS = 1189

  const totalRead = Object.values(progress).reduce((sum, chs) => sum + chs.length, 0)
  const progressPercent = loading ? 0 : Math.min(100, Math.round((totalRead / TOTAL_CHAPTERS) * 100))
  const startedBooks = new Set(Object.keys(progress))

  const partnerTotalRead = Object.values(partnerProgress).reduce((sum, chs) => sum + chs.length, 0)
  const partnerPercent = Math.min(100, Math.round((partnerTotalRead / TOTAL_CHAPTERS) * 100))

  // Which dataset the Progres tab is currently showing.
  const viewingPartner = whoseProgress === 'partner'
  const shownProgress = viewingPartner ? partnerProgress : progress
  const shownTotal = viewingPartner ? partnerTotalRead : totalRead

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

      {/* Identity indicator + switch account — never ambiguous whose space this is */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-deep-blue/40 border border-warm-gold/20 px-2.5 py-1.5">
        <span className="font-pixel text-[0.4rem] sm:text-[0.45rem] text-soft-white/40">kamu:</span>
        <span className="font-pixel text-[0.45rem] sm:text-[0.5rem] text-warm-gold">{displayName}</span>
        <button
          onClick={() => {
            // Deliberate switch only — confirm so a stray tap can't flip accounts.
            if (!window.confirm(`Keluar dari akun ${displayName}? Kamu harus pilih akun lagi buat masuk.`)) return
            signOut(); setPage('landing')
          }}
          title="Ganti akun / keluar"
          className="ml-1 font-pixel text-[0.4rem] sm:text-[0.45rem] text-soft-white/35 hover:text-pixel-pink border-l border-soft-white/10 pl-2 transition-colors cursor-pointer"
        >
          ganti ⇄
        </button>
      </div>

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

        {/* ── Two distinct rings: MINE (gold) vs PARTNER (green) ── */}
        <div className="mt-6 flex items-start justify-center gap-6 sm:gap-10">
          {/* My ring */}
          <div className="flex flex-col items-center">
            <span className="font-pixel text-[0.45rem] sm:text-[0.5rem] text-warm-gold mb-2 tracking-wider uppercase">Kamu</span>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
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
                <span className="font-pixel text-[0.7rem] sm:text-[0.8rem] text-warm-gold">{progressPercent}%</span>
                <span className="font-sans text-[0.65rem] sm:text-xs text-soft-white/50">{totalRead}/{TOTAL_CHAPTERS}</span>
              </div>
            </div>
            <p className="font-sans text-xs sm:text-sm text-soft-white/40 mt-2">{startedBooks.size} kitab</p>
          </div>

          {/* Partner ring */}
          {partnerName && (
            <div className="flex flex-col items-center">
              <span className="font-pixel text-[0.45rem] sm:text-[0.5rem] text-pixel-green mb-2 tracking-wider uppercase">{partnerName}</span>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#111b3d" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#38b764" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - partnerPercent / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-pixel text-[0.7rem] sm:text-[0.8rem] text-pixel-green">{partnerPercent}%</span>
                  <span className="font-sans text-[0.65rem] sm:text-xs text-soft-white/50">{partnerTotalRead}/{TOTAL_CHAPTERS}</span>
                </div>
              </div>
              <p className="font-sans text-xs sm:text-sm text-soft-white/40 mt-2">{new Set(Object.keys(partnerProgress)).size} kitab</p>
            </div>
          )}
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
                <div className="flex gap-2 items-stretch">
                  <select value={currentBook} onChange={e => setCurrentBook(e.target.value)}
                    className="flex-1 min-w-0 bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base sm:text-lg p-2.5 focus:border-warm-gold/50 outline-none cursor-pointer">
                    {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <button onClick={() => setShowBookJump(true)} title="Loncat kitab"
                    className="shrink-0 px-3 bg-midnight border-2 border-warm-gold/30 text-warm-gold hover:bg-warm-gold/15 hover:border-warm-gold/60 transition-colors cursor-pointer active:translate-y-0.5">
                    <span className="text-base">⤵</span>
                  </button>
                </div>
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

            {/* Prev / Next chapter nav */}
            <div className="flex items-center gap-2 mb-4">
              <button onClick={goPrevChapter}
                disabled={chNum <= 1 && bookIdx === 0}
                className="flex-1 font-pixel text-[0.45rem] sm:text-[0.5rem] py-2.5 border-2 border-soft-white/10 text-soft-white/50 hover:text-warm-gold hover:border-warm-gold/30 transition-colors cursor-pointer bg-midnight disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-soft-white/50 disabled:hover:border-soft-white/10 active:translate-y-0.5">
                ◄ sebelumnya
              </button>
              <button onClick={goNextChapter}
                disabled={isLastChapter && !hasNextBook}
                className="flex-1 font-pixel text-[0.45rem] sm:text-[0.5rem] py-2.5 border-2 border-soft-white/10 text-soft-white/50 hover:text-warm-gold hover:border-warm-gold/30 transition-colors cursor-pointer bg-midnight disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-soft-white/50 disabled:hover:border-soft-white/10 active:translate-y-0.5">
                selanjutnya ►
              </button>
            </div>

            <div className="space-y-4">
              <PixelButton active={readChapters.includes(chNum)} onClick={markRead} className="w-full">
                {readChapters.includes(chNum) ? '✓ Sudah dibaca' : 'Tandai sudah baca'}
              </PixelButton>

              {/* Post-read confirmation + easy next-chapter nav */}
              {justRead && (
                <div className="bg-pixel-green/10 border-2 border-pixel-green/40 p-3 sm:p-4 animate-fade-in">
                  <p className="font-pixel text-[0.5rem] sm:text-[0.55rem] text-pixel-green mb-1">
                    ✓ {currentBook} {chNum} ditandai!
                  </p>
                  <p className="font-sans text-sm text-soft-white/50 mb-3">
                    {isLastChapter && !hasNextBook
                      ? 'Kamu sampai di akhir Alkitab. ✨'
                      : 'Mantap. Lanjut ke pasal berikutnya?'}
                  </p>
                  <div className="flex gap-2">
                    {(!isLastChapter || hasNextBook) && (
                      <button onClick={goNextChapter}
                        className="flex-1 font-pixel text-[0.45rem] sm:text-[0.5rem] py-2.5 border-2 border-pixel-green/50 text-pixel-green hover:bg-pixel-green/15 transition-colors cursor-pointer bg-midnight active:translate-y-0.5 shadow-[2px_2px_0_0_#38b764]">
                        {isLastChapter
                          ? `► ${BOOKS[bookIdx + 1]} 1`
                          : `► Pasal ${chNum + 1}`}
                      </button>
                    )}
                    <button onClick={() => setJustRead(false)}
                      className="font-pixel text-[0.45rem] sm:text-[0.5rem] py-2.5 px-4 border-2 border-soft-white/10 text-soft-white/40 hover:text-soft-white/70 transition-colors cursor-pointer bg-midnight active:translate-y-0.5">
                      tutup
                    </button>
                  </div>
                </div>
              )}

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
                  <p key={v.verse} className="font-sans text-base sm:text-lg text-soft-white/85 leading-loose">
                    <sup className="text-warm-gold/60 text-[0.75rem] mr-1.5">{v.verse}</sup>
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
          {/* ── Whose tiles? — Kamu vs Partner toggle ── */}
          {partnerName && (
            <div className="flex gap-2 mb-1">
              {[['me', 'Kamu'], ['partner', partnerName]].map(([key, label]) => {
                const on = whoseProgress === key
                const isMe = key === 'me'
                return (
                  <button key={key} onClick={() => setWhoseProgress(key)}
                    className={`flex-1 font-pixel text-[0.5rem] sm:text-[0.55rem] py-2.5 border-2 transition-all duration-100 active:translate-y-0.5 cursor-pointer
                      ${on
                        ? (isMe
                            ? 'bg-warm-gold/15 border-warm-gold/60 text-warm-gold shadow-[2px_2px_0_0_#d4a853]'
                            : 'bg-pixel-green/15 border-pixel-green/60 text-pixel-green shadow-[2px_2px_0_0_#38b764]')
                        : 'bg-midnight text-soft-white/40 border-soft-white/10 hover:border-soft-white/25'}`}>
                    {label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Whose-progress label */}
          <p className="font-sans text-xs sm:text-sm text-soft-white/40 px-1">
            {viewingPartner
              ? `Progres ${partnerName} — ${shownTotal} pasal`
              : `Progres kamu — ${shownTotal} pasal`}
          </p>

          {BOOKS.map(book => {
            const chs = shownProgress[book]
            if (!chs || chs.length === 0) return null
            return (
              <div key={book} className="bg-deep-blue/40 border-2 border-soft-white/5 p-3 sm:p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-sans text-sm sm:text-base text-soft-white/80">{book}</span>
                  <span className={`font-pixel text-[0.4rem] sm:text-[0.45rem] ${viewingPartner ? 'text-pixel-green/70' : 'text-warm-gold/60'}`}>{chs.length}/{CHAPTER_COUNTS[book]}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: CHAPTER_COUNTS[book] }, (_, i) => i + 1).map(ch => (
                    <span key={ch}
                      className={`inline-block w-6 h-6 sm:w-7 sm:h-7 text-center leading-6 sm:leading-7 text-[0.55rem] sm:text-[0.6rem] font-pixel
                        ${chs.includes(ch)
                          ? (viewingPartner ? 'bg-pixel-green text-midnight' : 'bg-warm-gold text-midnight')
                          : 'bg-midnight border border-soft-white/10 text-soft-white/20'}`}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
          {shownTotal === 0 && !loading && (
            <p className="text-center font-sans text-base sm:text-lg text-soft-white/30 py-12">
              {viewingPartner
                ? `${partnerName} belum punya progres.`
                : 'Belum ada progres. Mulai baca dulu, yuk!'}
            </p>
          )}
        </div>
      )}

      {/* ── Quick book-jump modal (Testament navigation) ── */}
      {showBookJump && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-midnight/80 animate-fade-in"
          onClick={() => setShowBookJump(false)}>
          <div onClick={e => e.stopPropagation()}
            className="bg-deep-blue border-2 border-warm-gold/40 shadow-[4px_4px_0_0_#d4a853] w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b-2 border-soft-white/10 shrink-0">
              <p className="font-pixel text-[0.55rem] sm:text-[0.6rem] text-warm-gold">📖 Loncat ke kitab</p>
              <button onClick={() => setShowBookJump(false)}
                className="font-pixel text-[0.5rem] text-soft-white/40 hover:text-warm-gold transition-colors cursor-pointer px-2">✕</button>
            </div>
            <div className="overflow-y-auto p-3 sm:p-4 space-y-4">
              {[['Perjanjian Lama', PL_BOOK_LIST], ['Perjanjian Baru', PB_BOOK_LIST]].map(([label, list]) => (
                <div key={label}>
                  <p className="font-pixel text-[0.45rem] sm:text-[0.5rem] text-soft-white/40 mb-2 uppercase tracking-wider">{label}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {list.map(b => {
                      const done = (progress[b]?.length || 0)
                      const total = CHAPTER_COUNTS[b] || 1
                      const isCur = b === currentBook
                      return (
                        <button key={b}
                          onClick={() => { goTo(b, 1); setShowBookJump(false) }}
                          className={`text-left p-2 border-2 transition-colors cursor-pointer active:translate-y-0.5
                            ${isCur
                              ? 'bg-warm-gold/15 border-warm-gold/60 text-warm-gold'
                              : 'bg-midnight border-soft-white/10 text-soft-white/70 hover:border-warm-gold/40 hover:text-warm-gold'}`}>
                          <span className="font-sans text-sm sm:text-base block leading-tight truncate">{b}</span>
                          <span className={`font-pixel text-[0.35rem] ${done >= total ? 'text-pixel-green' : 'text-soft-white/30'}`}>
                            {done}/{total}{done >= total ? ' ✓' : ''}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
