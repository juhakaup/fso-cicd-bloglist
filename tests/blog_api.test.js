const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let authHeader

beforeEach(async () => {
  await blog.deleteMany({})
  await User.deleteMany({})

  let blogObject = new blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new blog(helper.initialBlogs[1])
  await blogObject.save()

  const user = helper.initialUsers[0]
  await api
    .post('/api/users')
    .send(user)
  const res = await api.post('/api/login').send(user)
  authHeader = `Bearer ${res.body.token}`
}, 10000)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs are identified by field id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('new blog can be added', async () => {
  const newBlog = {
    title: 'new blog test',
    author: 'Test Author',
    url: 'https://testurl.not',
    likes: 4
  }
  await api
    .post('/api/blogs')
    .set('Authorization', authHeader)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'new blog test'
  )
})

test('adding new blog, undefined likes is initialized to 0', async () => {
  const newBlog = {
    title: 'new blog test',
    author: 'Test Author',
    url: 'https://testurl.not',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', authHeader)
    .send(newBlog)
    .expect(200)

  expect(response.body.likes).toEqual(0)
})

test('adding new blog without proper fields leads to error', async () => {
  const newBlog = {
    author: 'Test Author'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authHeader)
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})