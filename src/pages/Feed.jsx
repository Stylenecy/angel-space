import { useState, useEffect, useRef } from 'react'
import StarField from '../components/StarField'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/feed/PostCard'

/**
 * Feed.jsx — Instagram-like feed page.
 */
export default function Feed({ setPage }) {
  const { posts, loading, createPost, deletePost } = usePosts()
  const [titleOp, setTitleOp] = useState(0)
  const [toolbarOp, setToolbarOp] = useState(0)
  const [listOp, setListOp] = useState(0)
  const [showComposer, setShowComposer] = useState(false)
  const [caption, setCaption] = useState('')
  const listRef = useRef(null)

  // Entrance sequence
  useEffect(() => {
    const t1 = setTimeout(() => setTitleOp(1), 100);
    const t2 = setTimeout(() => setToolbarOp(1), 300);
    const t3 = setTimeout(() => setListOp(1), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [])

  const handlePost = () => {
    if (!caption.trim()) return
    createPost({
      author_id: 'angel',
      author_name: 'Angel',
      caption: caption.trim(),
      image_url: null,
    })
    setCaption('')
    setShowComposer(false)
  }

  const handleDelete = (postId) => {
    deletePost(postId)
  }

  return (
    <section className="relative flex flex-col items-center min-h-screen px-6 py-10 overflow-hidden select-none">
      <StarField />

      <div className="relative z-10 w-full max-w-md">
        {/* Title */}
        <h2
          className="font-pixel text-xs md:text-sm text-warm-gold mb-6 text-center"
          style={{
            opacity: titleOp,
            transform: titleOp ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.4s ease-out',
          }}
        >
          📝 Feed Kita
        </h2>

        {/* Toolbar */}
        <div
          className="flex items-center justify-between mb-6"
          style={{
            opacity: toolbarOp,
            transition: 'opacity 0.3s ease-out',
          }}
        >
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="pixel-btn !text-[0.5rem] !py-2 !px-3"
          >
            ✏️ tulis
          </button>
          <button
            onClick={() => setPage('dashboard')}
            className="font-pixel text-[0.5rem] text-soft-white/25 hover:text-soft-white/50 transition-colors"
          >
            &lt; dashboard
          </button>
        </div>

        {/* Composer */}
        {showComposer && (
          <div className="pixel-card bg-deep-blue/90 border-2 border-warm-gold/30 p-4 mb-6">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="apa yang kamu pikirkan..."
              className="w-full bg-midnight/50 border border-soft-white/10 text-soft-white text-sm p-3 resize-none focus:border-warm-gold/50 focus:outline-none"
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={handlePost} className="pixel-btn !text-[0.5rem] !py-2 !px-3">
                posting
              </button>
              <button
                onClick={() => { setShowComposer(false); setCaption('') }}
                className="pixel-btn !text-[0.5rem] !py-2 !px-3 !bg-transparent border-soft-white/20 text-soft-white/40"
              >
                batal
              </button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div
          ref={listRef}
          style={{
            opacity: listOp,
            transition: 'opacity 0.4s ease-out',
          }}
        >
          {loading && (
            <div className="text-center py-12">
              <p className="font-pixel text-xs text-soft-white/30 animate-pixel-blink">
                loading...
              </p>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-soft-white/30 text-sm">
                belum ada postingan...
              </p>
              <p className="text-soft-white/20 text-xs mt-2">
                jadi yang pertama! ✨
              </p>
            </div>
          )}

          {!loading && posts.map((post, i) => (
            <div
              key={post.id}
              style={{
                opacity: listOp ? 1 : 0,
                transform: listOp ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.4s ease-out ${i * 0.06}s`,
              }}
            >
              <PostCard
                post={post}
                onDelete={handleDelete}
                isOwner={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
