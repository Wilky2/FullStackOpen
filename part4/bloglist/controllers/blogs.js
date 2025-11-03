const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})



blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if(!blog.likes){
    blog.likes = 0
  }
  const user = request.user
  blog.user = user._id
  logger.info(blog)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  logger.info(user)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  
  if ( blog.user.toString() === user._id.toString() ){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else{
      response.status(401).json({ error: 'token invalid' })
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).end()
  }
  blog.title = request.body.title
  blog.author = request.body.author
  blog.url = request.body.url
  blog.likes = request.body.likes
  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter