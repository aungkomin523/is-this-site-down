import axios from 'axios'

const api = axios.create({
  baseURL: 'https://upornot.dev/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api