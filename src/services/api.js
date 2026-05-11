import axios from 'axios'

/**
 * Axios instance ready for a future backend.
 * Demo flows use `aiService` mocks and never call real endpoints.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 20_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Something went wrong. Try again in a moment.'
    return Promise.reject(new Error(message))
  },
)

export default api
