import { useState } from 'react'
import { createTimeline } from 'animejs'
import { heartBurst } from '../../lib/animeUtils'

/**
 * PostCard — Single post in the feed with image, caption, and like animation.
 */
export default function PostCard({ post, onDelete, isOwner }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const handleLike = (e) => {
    setLiked(prev => !prev)
    if (!liked) {
      setLikeCount(prev => prev + 1)
      heartBurst(e.currentTarget)
    } else {
      setLikeCount(prev => Math.max(0, prev - 1))
    }
  }

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'baru saja'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m lalu`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h lalu`
    const days = Math.floor(hours / 24)
    return `${days}h lalu`
  }

  return (
    <div className="post-card pixel-card bg-deep-blue/80 border-2 border-soft-white/10 mb-4 overflow-hidden opacity-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-soft-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-midnight border border-warm-gold/30 flex items-center justify-center text-xs">
            {post.author_name?.[0]?.toUpperCase() || 'A'}
          </div>
          <span className="font-pixel text-[0.45rem] text-warm-gold tracking-wide">
            {post.author_name || 'Angel'}
          </span>
        </div>
        <span className="text-xs text-soft-white/25">
          {timeAgo(post.created_at)}
        </span>
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="w-full aspect-[4/3] bg-midnight/50 overflow-hidden">
          <img
            src={post.image_url}
            alt={post.caption}
            className="w-full h-full object-cover pixel-render"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      )}

      {/* Caption + Actions */}
      <div className="px-4 py-3">
        <p className="text-sm text-soft-white/70 leading-relaxed">
          {post.caption}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-soft-white/5">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-colors ${
              liked ? 'text-pixel-pink' : 'text-soft-white/40 hover:text-soft-white/60'
            }`}
          >
            <span className="text-sm">{liked ? '💛' : '🤍'}</span>
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="text-xs text-soft-white/20 hover:text-pixel-pink transition-colors"
            >
              hapus
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
