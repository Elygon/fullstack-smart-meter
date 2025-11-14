import axios from 'axios'

// Create Axios instance
const api = axios.create({
    baseURL: "http://localhost:4885", // Change to your backend URL
    headers: {
        "Content-Type": "application/json"
    }
})

// Automatically add token to every request if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") // Where you store JWT after login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api