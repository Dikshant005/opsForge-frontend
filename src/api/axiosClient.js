import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor  .use() gives two callbacks, one for success and one for error
axiosClient.interceptors.request.use(
  (config) => {
    // 1. Get the latest token from localStorage here
    const token = localStorage.getItem('token');
    // 2. If the token exists, attach it to the headers.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // error acknowledgment, pass it to the next handler
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    // Any status code within the 2xx range triggers this function.
    // We just pass the successful response.
    return response;
  },
  (error) => {
    // Any status code outside the 2xx range triggers this function.
    const { response } = error;
    
    if (response && response.status === 401) {
      // 1. Remove the token from localStorage
      localStorage.removeItem('token');
      // 2. Redirect the user to the login page
        window.location.href = '/login';
      
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;