const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce(function(sum, blog) {
    return sum + blog.likes
  }, 0)
  return likes
}

const favouriteBlog = (blogs) => {
  const likes = blogs.map(b => {return Number(b.likes)})
  const mostLikes = Math.max( ...likes )
  const favourite = blogs.find(blog => blog.likes === mostLikes)
  return favourite
}

module.exports = { dummy, totalLikes, favouriteBlog }