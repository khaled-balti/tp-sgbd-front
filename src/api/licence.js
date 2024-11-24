import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' })
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return req
})
export const getLicences = () => API.get('/licence')
export const getLicence = (licenceId) => API.get(`/licence/${licenceId}`)
export const updateLicence = (licenceId, licence) => API.patch(`/licence/${licenceId}`, licence, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
export const addLicence = (licence) => API.post('/licence', licence, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
export const deleteLicence = (licenceId) => API.delete(`/licence/${licenceId}`)