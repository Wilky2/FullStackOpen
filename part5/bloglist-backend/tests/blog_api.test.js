const { test, after, beforeEach, describe, before } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    let token;
    const user = {
        username: 'blog',
        name: 'blog',
        password: 'sekret'
    }
    let savedUser

    before(async () => {
        savedUser = await User.findOne({ username: user.username })
        if(!savedUser){
            const passwordHash = await bcrypt.hash(user.password, 10)
            const userToSave = new User({ username: user.username, name: user.name, passwordHash })
            savedUser = await userToSave.save()     
        }
        const loginResponse = await api
        .post('/api/login')
        .send(user)
        token = loginResponse.body.token
    })

    beforeEach(async () => {
        await Blog.deleteMany({})
        const blogs  = helper.blogs.map(blog => {
            const newBlog = {...blog, user: savedUser._id}
            return newBlog
        })
        await Blog.insertMany(blogs)
    })

    test('All blogs are returned as json', async () => {
        const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.length, helper.blogs.length)
    })

    test('blogs have id property as identifier', async () => {
        const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        response.body.forEach(blog=>{
            assert.strictEqual("id" in blog, true)
            assert.strictEqual("_id" in blog, false)
        })

    })

    describe('addition of a new blog', ()=>{
        test('succeeds with valid data', async () => {
            const newBlog = {
                title: "Testing creating blogs",
                author: "Me",
                url: "http://myurl/",
                likes: 7
            }

            const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) 
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


            newBlog.id = response.body.id
            
            newBlog.user = response.body.user

            const blogs =  await helper.blogsInDb()

            const blog = await helper.findBlogById(newBlog.id)

            assert.strictEqual(blogs.length, helper.blogs.length + 1)

            assert.strictEqual(blog.user.username, user.username)

            assert.deepStrictEqual(blog, newBlog)
        })

        test('If likes is missing it will default to the value zero', async () => {
            const newBlog = {
                title: "Testing creating blogs",
                author: "Me",
                url: "http://myurl/"
            }

            const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`) 
            .expect(201)
            .expect('Content-Type', /application\/json/)

            const blogId = response.body.id

            const blogs =  await helper.blogsInDb()

            const blog = await helper.findBlogById(blogId)

            assert.strictEqual(blogs.length, helper.blogs.length + 1)

            assert.strictEqual(blog.user.username, user.username)

            assert.strictEqual(blog.likes, 0)
        })

        test('fails with status code 401 if token is not valid', async () => {
            const newBlog = {
                title: "Testing creating blogs",
                author: "Me",
                url: "http://myurl/",
                likes: 7
            }

            const customToken = 'invalid token'

            await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${customToken}`) 
            .expect(401)

            const blogs =  await helper.blogsInDb()

            assert.strictEqual(blogs.length, helper.blogs.length)

        })

        test('fails with status code 400 if title and url are missing', async () => {
            const newBlog = {
                author: "Me",
                likes: 7
            }

            await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`) 
            .expect(400)

            const blogs =  await helper.blogsInDb()

            assert.strictEqual(blogs.length, helper.blogs.length)
        })

        test('fails with status code 400 if url is missing', async () => {
            const newBlog = {
                title: "Testing creating blogs",
                author: "Me",
                likes: 7
            }

            await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`) 
            .expect(400)

            const blogs =  await helper.blogsInDb()

            assert.strictEqual(blogs.length, helper.blogs.length)
        })

        test('fails with status code 400 if title is missing', async () => {
            const newBlog = {
                author: "Me",
                url: "http://myurl/",
                likes: 7
            }

            await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`) 
            .expect(400)

            const blogs =  await helper.blogsInDb()

            assert.strictEqual(blogs.length, helper.blogs.length)
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)
            const blogsAtEnd = await helper.blogsInDb()

            assert(!blogsAtEnd.some((blog=>helper.compareTwoBlogs(blog, blogToDelete))))

            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
        })  

        test('fails with status code 401 if token is invalid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            const customToken = 'invalid token'

            await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${customToken}`).expect(401)
            const blogsAtEnd = await helper.blogsInDb()

            assert(blogsAtEnd.some((blog=>helper.compareTwoBlogs(blog, blogToDelete))))

            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })  
    })

    describe('update of a blog', () => {
        test('update the number of likes', async () => {
            const blogs = await helper.blogsInDb()
            const blogToUpdate = blogs[0]
            blogToUpdate.likes = 10
            const blogToUpdateCopy = {...blogToUpdate}
            blogToUpdateCopy.user = blogToUpdate.user.id

            await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdateCopy)
            .expect(200)
            .expect('Content-Type', /application\/json/)

            const updatedBlog = await helper.findBlogById(blogToUpdate.id)

            assert.deepStrictEqual(blogToUpdate, updatedBlog)
        })

        test('fails with status code 404 if id is wrong', async () => {
            const blogs = await helper.blogsInDb()
            const blogToUpdate = blogs[0]
            blogToUpdate.likes = 10
            const blogToUpdateCopy = {...blogToUpdate}
            blogToUpdateCopy.user = blogToUpdate.user.id

            await helper.deleteBlog(blogToUpdate)

            await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdateCopy)
            .expect(404)

            const blogsAtEnd = await helper.blogsInDb()

            assert(!blogsAtEnd.some((blog=>helper.compareTwoBlogs(blog, blogToUpdate))))
        })

        test('update the url', async () => {
            const blogs = await helper.blogsInDb()
            const blogToUpdate = blogs[0]
            blogToUpdate.url = "http://myurl/"
            const blogToUpdateCopy = {...blogToUpdate}
            blogToUpdateCopy.user = blogToUpdate.user.id

            await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdateCopy)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
            const updatedBlog = await helper.findBlogById(blogToUpdate.id)

            assert.deepStrictEqual(blogToUpdate, updatedBlog)

        })

        test('update all properties', async () => {
            const blogs = await helper.blogsInDb()
            const blogToUpdate = blogs[0]
            blogToUpdate.url = "http://myurl/"
            blogToUpdate.likes = 10
            blogToUpdate.author = 'Test'
            blogToUpdate.title = 'Test'
            const blogToUpdateCopy = {...blogToUpdate}
            blogToUpdateCopy.user = blogToUpdate.user.id

            await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdateCopy)
            .expect(200)
            .expect('Content-Type', /application\/json/)

            const updatedBlog = await helper.findBlogById(blogToUpdate.id)

            assert.deepStrictEqual(blogToUpdate, updatedBlog)

        })
    })

    after(async () => {
        await mongoose.connection.close()
    })
})