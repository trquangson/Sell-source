import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Tùy chỉnh theo port backend
    withCredentials: true, // Quan trọng: Cho phép gửi và nhận cookie
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor cho response
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error.response?.data || error);
    }
);

export default axiosClient;
