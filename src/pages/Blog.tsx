import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { uploadImage } from '../services/upload'
import { useSelector } from 'react-redux'
import type { RootState } from '../app/store'

export default function Blog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((s: RootState) => s.auth.user)

  const [blog, setBlog] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])

  const [commentText, setCommentText] = useState('')
  const [commentFile, setCommentFile] = useState<File | null>(null)
  const [loadingComment, setLoadingComment] = useState(false)

  const loadBlogAndComments = async () => {
    if (!id) return

    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()

    if (blogError) {
      alert(blogError.message)
      return
    }
    setBlog(blogData)

    const { data: commentData, error: commentError } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_id', id)
      .order('created_at', { ascending: false })

    if (commentError) {
      alert(commentError.message)
      return
    }
    setComments(commentData ?? [])
  }

  useEffect(() => {
    loadBlogAndComments()
  }, [id])

  const handleDeleteBlog = async () => {
    if (!id) return
    if (!confirm('Delete this blog?')) return

    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (error) return alert(error.message)

    navigate('/')
  }

  const handleAddComment = async () => {
    if (!id) return
    if (!user) return alert('Login to comment.')
    if (!commentText.trim()) return alert('Comment is required.')

    try {
      setLoadingComment(true)

      let image_url: string | null = null
      if (commentFile) image_url = await uploadImage(commentFile, 'comments')

      const { error } = await supabase.from('comments').insert([
        {
          blog_id: id,
          user_id: user.id,
          content: commentText,
          image_url,
        },
      ])

      if (error) throw error

      setCommentText('')
      setCommentFile(null)
      await loadBlogAndComments()
    } catch (e: any) {
      alert(e.message ?? 'Failed to add comment')
    } finally {
      setLoadingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
    if (error) return alert(error.message)

    await loadBlogAndComments()
  }

  if (!blog) return <div className="blog-page">Loading...</div>

  const isOwner = user?.id === blog.user_id

  return (
    <div className="blog-page">
     <div className="image-wrapper">
       <h1 className="blog-title title">{blog.title}</h1>

      {blog.image_url && <img src={blog.image_url} alt="blog" />}

      <p className="blog-content title" >
        {blog.content}
      </p>

      {isOwner && (
        <div className='button-ED'>
          <Link to={`/blog/${blog.id}/edit`} className="btn-create">
            Edit
          </Link>
          <button onClick={handleDeleteBlog} className="btn-login">
            Delete
          </button>
        </div>
      )}
     </div>

      <div className='comment-wrapper'>
        <h2 className='title'>Comments</h2>

        <textarea
          className="textarea"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(e) => setCommentFile(e.target.files?.[0] ?? null)}
        />

        <button
          onClick={handleAddComment}
          disabled={loadingComment}
          className="btn-create"
         
        >
          {loadingComment ? 'Posting...' : 'Post Comment'}
        </button>

        <div>
          {comments.map((c) => {
            const isCommentOwner = user?.id === c.user_id

            return (
              <div key={c.id} className="blog-card">
                <p>{c.content}</p>

                {c.image_url && <img src={c.image_url} alt="comment" />}

                <div>{new Date(c.created_at).toLocaleString()}</div>

                {isCommentOwner && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="btn-login"
                  >
                    Delete Comment
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
