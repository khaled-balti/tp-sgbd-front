import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' })
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return req
})
export const getProviders = () => API.get('/provider')
export const getProvider = (providerId) => API.get(`/provider/${providerId}`)
export const updateProvider = (providerId, provider) => API.patch(`/provider/${providerId}`, provider, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
export const addProvider = (provider) => API.post('/provider', provider, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
export const deleteProvider = (providerId) => API.delete(`/provider/${providerId}`)