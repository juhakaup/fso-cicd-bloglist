import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  const blogs = request.then(response => response.data)
  return blogs
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async blog => {
  const updatedBlog = {
    user: blog.user.id,
    author: blog.author,
    likes: blog.likes,
    title: blog.title,
    url: blog.url
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, updatedBlog)
  return response.data
}

const remove = async id => {
  axios.delete(`${baseUrl}/${id}`)
}

export default {
  getAll,
  create,
  update,
  remove,
  setToken,
}