import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

let config = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
  config = {
    headers: { Authorization: token }
  }
}

const create = async newBlog => {
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const update = async updatedBlog => {
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
  return response.data
}

const deleteBlog = async blogToDelete => {
  const response = await axios.delete(`${baseUrl}/${blogToDelete.id}`, config)
  return response.data
}
export default { getAll, create, update, setToken, deleteBlog }