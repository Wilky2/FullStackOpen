const _ = require("lodash")
const logger = require('./logger')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog)=>sum+blog.likes,0)
}

const favoriteBlog = (blogs) => {
  const blog = _.maxBy(blogs, blog=>blog.likes)
  return blog
}

const mostBlogs = (blogs) => {
  let grouped_data = _.groupBy(blogs, 'author')
  logger.info(grouped_data)
  let authors = _.reduce(grouped_data,(result, value, key)=>{
    result.push({author: key, blogs: value.length})
    return result
  }, [])
  logger.info(authors)
  const author = _.maxBy(authors, author=>author.blogs);
  logger.info(author)
  return author
}

const mostLikes = (blogs) => {
  let grouped_data = _.groupBy(blogs, 'author')
  logger.info(grouped_data)
  let authors = _.reduce(grouped_data,(result, value, key)=>{
    result.push({author: key, likes: _.sumBy(value, element=>element.likes)})
    return result
  }, [])
  logger.info(authors)
  const author = _.maxBy(authors, author=>author.likes)
  logger.info(author)
  return author
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}