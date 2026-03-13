const Blog = require('../models/blog')
const User = require('../models/user')

const blogs = [
  {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
  },
  {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
  },
  {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
  },
  {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10
  },
  {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0
  },
  {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
  }  
]

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return blogs.map(blog => blog.toJSON())
}

const findBlogById = async (id) => {
  const blog = await Blog.findById(id).populate('user', { username: 1, name: 1 })
  return blog.toJSON()
}

const compareTwoBlogs = (blog1, blog2)=>{
    let result = true
    for(key in blog1){
        if(key !== 'user'){
            result = result && blog1[key] === blog2[key]     
        }
    }
    for(userKey in blog1['user']){
        result = result && blog1['user'][userKey] === blog2['user'][userKey]
    }
    return result
}

const deleteBlog = async (blog)=>{
    await Blog.findByIdAndDelete(blog.id)
}

const usersInDb = async ()=>{
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const findUserById = async (id) => {
  const user = await User.findById(id)
  const {blogs, ...newUser} = user.toJSON()
  return newUser
}

module.exports = {blogs, compareTwoBlogs, blogsInDb, findBlogById, deleteBlog, usersInDb, findUserById}