const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
       await User.deleteMany({ username: { $ne: 'blog' } })
        const savedUser = await User.findOne({ username: 'root' })
        if(!savedUser){
            const passwordHash = await bcrypt.hash('sekret', 10)
            const user = new User({ username: 'root', passwordHash })
            await user.save()
        }
    })
    
    test('All users are returned as json', async () => {
        const users = await helper.usersInDb()

        const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, users.length)

    })

    describe('Create user', ()=>{
        test('creation succeeds with a fresh username', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'test',
                name: 'Test',
                password: 'test',
            }

            await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

            const usernames = usersAtEnd.map(u => u.username)
            assert(usernames.includes(newUser.username))
        })

        test('fails with status 400 when username is duplicate', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'root',
                name: 'Test',
                password: 'test',
            }

            const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

            const error = JSON.parse(response.text)
            assert(error.error.includes('E11000 duplicate key error collection'))

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('fails with status 400 when username is missing', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                name: 'Test',
                password: 'test'
            }

            const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

            const error = JSON.parse(response.text)
            assert(error.error.includes('User validation failed: username'))

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('fails with status 400 when password is missing', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'test',
                name: 'Test'
            }

            const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

            const error = JSON.parse(response.text)
            assert.strictEqual(error.error, 'password missing or password length is lower than 3')

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('fails with status 400 when username length is lower than 3', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'te',
                name: 'Test',
                password: 'test'
            }

            const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

            const error = JSON.parse(response.text)
            assert(error.error.includes('User validation failed: username'))

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('fails with status 400 when password length is lower than 3', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'test',
                name: 'Test',
                password: 'te'
            }

            const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

            const error = JSON.parse(response.text)
            assert.strictEqual(error.error, 'password missing or password length is lower than 3')

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
    })

    describe('login', ()=>{
        test('Sucess login', async () => {
            const newUser = {
                username: 'root',
                password: 'sekret'
            }

            const response = await api
            .post('/api/login')
            .send(newUser)
            .expect(200)

            assert.strictEqual('token' in response.body, true)
        })

        test('fail login', async () => {
            const newUser = {
                username: 'root',
                password: 'wrong password'
            }

            const response = await api
            .post('/api/login')
            .send(newUser)
            .expect(401)

            assert.strictEqual('token' in response.body, false)
            const error = JSON.parse(response.text)
            assert.strictEqual(error.error, 'invalid username or password')
        })
    })

    

    after(async () => {
        await mongoose.connection.close()
    })
})