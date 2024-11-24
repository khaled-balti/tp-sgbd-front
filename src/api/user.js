import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' })
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return req
})
export const getUsers = () => API.get('/user')
export const deleteUser = (userId) => API.delete(`/user/${userId}`)
export const getUser = (userId) => API.get(`/user/${userId}`)
// export const updateUser = (userId, user) => API.patch(`/user/${userId}`, user, {
//     headers: {
//         'Content-Type': 'multipart/form-data'
//     }
// })
export const updateUser = (userId, user) => API.patch(`/user/${userId}`, user);
export const addUser = (user) => API.post('/user', user, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})