import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/Loginform'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort(function(a,b) {return b.likes - a.likes})
      setBlogs( blogs )
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.clear()
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`${user.name} logged in succesfully`)
      setTimeout(() => {setNotification(null)}, 5000)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {setErrorMessage(null)}, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createNewBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    await blogService.create(blogObject)
    const blogs = await blogService.getAll()
    blogs.sort(function(a,b) {return b.likes - a.likes})
    setBlogs(blogs)

    setNotification(`a new blog ${blogObject.title} was added`)
    setTimeout(() => {setNotification(null)}, 5000)
  }

  const handleLike = async (blog) => {
    const likes = blog.likes + 1
    const updatedBlog = { ...blog, likes: likes }
    const newBlog = await blogService.update(updatedBlog)
    const newBlogs = ( blogs.map(b => {
      if (b.id === newBlog.id) {
        return({ ...b, likes: newBlog.likes })
      } else {
        return b
      }
    }))
    newBlogs.sort(function(a,b) {
      return b.likes - a.likes
    })
    setBlogs(newBlogs)
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Delete ${blog.title}`)) {
      blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setNotification(`${blog.title} removed`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={logout}>logout</button></p>
      <Togglable buttonLabel='new blog' closeLabel='cancel' ref={blogFormRef} >
        <BlogForm createNewBlog={createNewBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} user={user} deleteBlog={deleteBlog}/>
      )}
    </div>
  )

  return (
    <div>
      <Notification message={notification} />
      <Error message={errorMessage} />
      {user === null
        ? <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        : blogList()
      }
    </div>
  )
}

export default App