import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, isBlogAddedByConnectedUser }) => {
  const [showDetail, setShowDetail] = useState(false)

  const toggleShowdetail = () => {
    setShowDetail(!showDetail)
  }

  const showWhenShowDetail = { display: showDetail ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (

    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleShowdetail} >{showDetail ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenShowDetail}>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>
          {blog.user.username}
        </div>
        {
          isBlogAddedByConnectedUser(blog) &&
          <div>
            <button onClick={() => handleDelete(blog)}>remove</button>
          </div>
        }
      </div>
    </div>

  )
}
export default Blog