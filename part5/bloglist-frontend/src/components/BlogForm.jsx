import handleStrInputChange from '../utils/handleStrInputChange'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title,author,url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <div>
        <label>
            title: <input value={title} onChange={handleStrInputChange(setTitle)}/>
        </label>
      </div>
      <div>
        <label>
            author: <input value={author} onChange={handleStrInputChange(setAuthor)}/>
        </label>
      </div>
      <div>
        <label>
            url: <input value={url} onChange={handleStrInputChange(setUrl)}/>
        </label>
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  )
}

export default BlogForm