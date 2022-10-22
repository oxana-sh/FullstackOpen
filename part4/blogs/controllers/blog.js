const BlogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
BlogRouter.get('/', async  (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

BlogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog.toJSON())
})

BlogRouter.post('/', middleware.userExtractor, async  (request, response) => {
  const body = request.body
  const user = request.user
  const blog  = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})

BlogRouter.delete('/:id', middleware.userExtractor, async  (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(400).json({
      error: 'The user is not owner of this post'
    })
  }

})


BlogRouter.put('/:id', async(request, response) => {
  const blog = {
    likes: request.body.likes
  }
  await  Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
  response.status(204).end()

})


module.exports = BlogRouter