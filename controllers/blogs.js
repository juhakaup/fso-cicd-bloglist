const blogsRouter = require('express').Router()
const Blog = require('./../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (!request.token.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!request.user) {
    return response.status(401).json({ error: 'user undefined' })
  }
  const likes = body.likes===undefined ? 0 : body.likes

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes,
    user: request.user._id
  })

  try{
    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  if (!request.token.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog undefined' })
  }
  const blogUser = blog.user
  const reqUser = request.user
  if (!blogUser || !reqUser) {
    return response.status(400).json({ error: 'user undefined' })
  }
  if (blogUser.toString() !== reqUser._id.toString()) {
    return response.status(401).json({ error: 'Authorization error' })
  }
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter