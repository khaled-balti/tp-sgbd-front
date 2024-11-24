import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' })
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return req
})
export const addReport = (credentials) => API.post('/report', credentials)
export const getReports = () => API.get('/report')
export const getReport = (reportId) => API.get(`report/${reportId}`)
