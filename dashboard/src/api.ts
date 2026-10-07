import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      const loginPath = `${import.meta.env.BASE_URL}login`.replace(/\/{2,}/g, '/')
      if (!window.location.pathname.endsWith('/login')) {
        window.location.href = loginPath
      }
    }
    return Promise.reject(error)
  }
)

export default api
