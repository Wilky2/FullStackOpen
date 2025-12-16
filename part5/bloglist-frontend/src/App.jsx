import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import { ErrorNotification, SuccessNotification } from './components/notifications'
import loginService from './services/login'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import handleStrInputChange from './utils/handleStrInputChange'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const updateErrorMessage = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const updateSuccessMessage = message => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const isBlogAddedByConnectedUser = blog => {
    return blog.user.username === user.username
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.clear()
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      updateErrorMessage('wrong username or passsword')
    }
  }

  const handleCreateBlog = async (newBlog) => {
    try{
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      updateSuccessMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    }catch (error){
      updateErrorMessage(`${error.response.data.error}`)
    }
  }

  const handleLike = async likedBlog => {
    const likedBlogCopy = { ...likedBlog }
    likedBlogCopy.user = likedBlog.user.id
    likedBlogCopy.likes = likedBlog.likes + 1
    const updatedBlog = await blogService.update(likedBlogCopy)
    const blogsCopy = [...blogs]
    const updateBlogIndex = blogsCopy.findIndex(blog => blog.id === updatedBlog.id)
    blogsCopy[updateBlogIndex].likes = updatedBlog.likes
    setBlogs(blogsCopy)
  }

  const deleteBlog = async (blogToDelete) => {
    if(window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)){
      try{
        const deletedBlog = await blogService.deleteBlog(blogToDelete)
        console.log('Blog delete', deletedBlog)
        setBlogs(blogs.filter(blog => blog.id!==blogToDelete.id))
        updateSuccessMessage(`Delete ${blogToDelete.title}`)
      }catch (error) {
        console.log(error.response.data.error)
        updateErrorMessage(`${error.response.data.error}`)
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorNotification message={errorMessage}/>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={handleStrInputChange(setUsername)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={handleStrInputChange(setPassword)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  const sortedBlogs = blogs.sort((blog1, blog2) => blog2.likes-blog1.likes)

  return (
    <div>
      <h2>blogs</h2>
      <ErrorNotification message={errorMessage}/>
      <SuccessNotification message={successMessage} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel='create new blog'>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      <div>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={deleteBlog} isBlogAddedByConnectedUser={isBlogAddedByConnectedUser}/>
      )}
      </div>
    </div>
  )
}

export default App