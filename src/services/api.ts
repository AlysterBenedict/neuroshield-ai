
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add authorization header when needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (e.g., token expired)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login page
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/api/v1/auth/login', { email, password }),
  
  signup: (name: string, email: string, password: string) => 
    api.post('/api/v1/auth/signup', { name, email, password }),
  
  getUser: () => 
    api.get('/api/v1/auth/me'),
};

export const contactAPI = {
  submitForm: (data: { name: string; email: string; message: string }) => 
    api.post('/api/v1/contact', data),
};

export const assessmentAPI = {
  getAssessments: () => 
    api.get('/api/v1/assessments'),
  
  submitAssessment: (data: any) => 
    api.post('/api/v1/assessments', data),
};

export default api;
