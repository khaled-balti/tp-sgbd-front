import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' })
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return req
})
export const loginApi = (credentials) => API.post('/auth/login', credentials)
