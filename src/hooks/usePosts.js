/**
 * usePosts.js — Hook for CRUD posts from Supabase.
 * Gracefully degrades if Supabase is not configured.
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const isSupabaseConfigured =
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('[project-id]')

// Dummy data for when Supabase is not configured
const DUMMY_POSTS = [
  {
    id: '1',
    author_id: 'dex',
    author_name: 'Dex',
    image_url: '/assets/images/memory-01.jpg',
    caption: 'first post di ruang kita 🌙',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    author_id: 'angel',
    author_name: 'Angel',
    image_url: '/assets/images/memory-02.jpg',
    caption: 'kenangan yang nggak boleh hilang ✨',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured) {
      setPosts(DUMMY_POSTS)
      setLoading(false)
      return
    }

    try {
      const { data, error: err } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setPosts(data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err.message)
      setPosts(DUMMY_POSTS) // Fallback
    } finally {
      setLoading(false)
    }
  }, [])

  // Create post
  const createPost = useCallback(async (postData) => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured, post not saved')
      return { id: String(Date.now()), ...postData, created_at: new Date().toISOString() }
    }

    try {
      const { data, error: err } = await supabase
        .from('posts')
        .insert({
          author_id: postData.author_id,
          image_url: postData.image_url,
          caption: postData.caption,
        })
        .select()
        .single()

      if (err) throw err
      setPosts(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating post:', err)
      throw err
    }
  }, [])

  // Delete post
  const deletePost = useCallback(async (postId) => {
    if (!isSupabaseConfigured) {
      setPosts(prev => prev.filter(p => p.id !== postId))
      return
    }

    try {
      const { error: err } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (err) throw err
      setPosts(prev => prev.filter(p => p.id !== postId))
    } catch (err) {
      console.error('Error deleting post:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    refetch: fetchPosts,
    isConfigured: isSupabaseConfigured,
  }
}
