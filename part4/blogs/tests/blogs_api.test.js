const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('Viewing blogs', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const result = response.body.map(r => r.id)
    expect(result[0]).toBeDefined()
  })
})

describe('Addition of a new blog', () => {
  let token = null
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret13', 10)
    const user = new User({ username: 'admin', passwordHash })
    await user.save()
    const userForToken = { username: user.username, id:user.id }
    token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60*60 }
    )
  })

  test('blog added by authorized user', async () => {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const newBlog = {
      title: 'Ukrainian Volunteers Use 3D Printers to Save Lives',
      author: 'ROMAN MYKHAILYSHYN',
      url: 'https://spectrum.ieee.org/ukraine-3d-printing',
      user: user._id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'Ukrainian Volunteers Use 3D Printers to Save Lives'
    )
  })
  test('blog added by NO authorized user with code 401', async () => {
    token = null
    const newBlog = {
      title: 'Ukrainian Volunteers Use 3D Printers to Save Lives',
      author: 'ROMAN MYKHAILYSHYN',
      url: 'https://spectrum.ieee.org/ukraine-3d-printing',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(401)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(response.body).toHaveLength(helper.initialBlogs.length )
    expect(titles).not.toContain(newBlog.title)
  })

  test('likes property default value 0', async () => {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const newBlog = {
      title: 'Ukrainian Volunteers Use 3D Printers to Save Lives',
      author: 'ROMAN MYKHAILYSHYN',
      url: 'https://spectrum.ieee.org/ukraine-3d-printing',
      user: user._id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const blog = response.body.find(r => r.title === newBlog.title)
    expect(blog.likes).toBe(0)
  })

  test('blog without title and url is not added', async () => {
    const emptyBlog = {
      author: 'Roman Smetan',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(emptyBlog)
      .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Deletion of a blog', () => {
  let token = null
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret13', 10)
    const user = new User({ username: 'admin', passwordHash })
    await user.save()
    const userForToken = { username: user.username, id:user.id }
    token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60*60 }
    )
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const userExist  = await User.findById(decodedToken.id)
    const newBlog = {
      title: 'Ukrainian Volunteers Use 3D Printers to Save Lives',
      author: 'ROMAN MYKHAILYSHYN',
      url: 'https://spectrum.ieee.org/ukraine-3d-printing',
      user: userExist._id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('succeeds with status code 204', async () => {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const userExist  = await User.findById(decodedToken.id)
    const blogsAtStart = await Blog.find({}).populate('user')
    const blogToDelete = blogsAtStart[2]
    if (blogToDelete.user._id.toString() === userExist._id.toString()) {
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    }
    const blogsAtEnd = await Blog.find({}).populate('user')
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    const title = blogsAtEnd.map(r => r.title)
    expect(title).not.toContain(blogToDelete.title)
  })
})

describe('Update info on the blog', () => {
  test('succeeds with update the amount of likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
      likes: blogToUpdate.likes + 1,
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(204)
    const response = await api.get(`/api/blogs/${blogToUpdate.id}`)
    expect(response.body.likes).toBe(newBlog.likes)

  })
})
afterAll(() => {
  mongoose.connection.close()
})