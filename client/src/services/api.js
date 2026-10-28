import axios from 'axios'

const api = axios.create({
  baseURL: '/api/', // same domain in production; proxied to localhost:3000 in dev
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api