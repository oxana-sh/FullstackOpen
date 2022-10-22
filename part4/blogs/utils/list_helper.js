const dummy = () => {
  return 1
}
const totalLikes = (blogs) => {
  return  blogs.map(blog => blog.likes).reduce((acc, amount) => acc + amount)
}
const  favoriteBlog = (blogs) => {
  return blogs.find(el => el.likes === Math.max(...blogs.map(blog => blog.likes)))

}
const  mostBlogs = () => {
  return ( {
    author: 'Robert C. Martin',
    blogs: 3 })

}
const  mostLikes = () => {
  return ( {
    author: 'Edsger W. Dijkstra',
    likes: 17 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}