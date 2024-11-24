import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' })
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return req
})
export const getClients = () => API.get('/client')
export const getClient = (clientId) => API.get(`/client/${clientId}`)
export const updateClient = (clientId, client) => API.patch(`/client/${clientId}`, client)
export const addClient = (client) => API.post('/client', client)
export const deleteClient = (clientId) => API.delete(`/client/${clientId}`)