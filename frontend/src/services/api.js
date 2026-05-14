import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Note: Port 5000 from your backend
});

// This "Interceptor" adds the token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;