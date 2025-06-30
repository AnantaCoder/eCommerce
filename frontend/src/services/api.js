import axios from 'axios'

const api = axios.create({ // env 
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
