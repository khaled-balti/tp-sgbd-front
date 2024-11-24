import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' })
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return req
})

export const addOrder = (order) => API.post(`/licence-per-client`, order)
export const getOrders = () => API.get(`/licence-per-client`)
export const getOrder = (orderId) => API.get(`/licence-per-client/${orderId}`)
export const deleteOrder = (orderId) => API.delete(`/licence-per-client/${orderId}`)
export const updateOrder = (orderId, order) => API.patch(`/licence-per-client/${orderId}`, order)