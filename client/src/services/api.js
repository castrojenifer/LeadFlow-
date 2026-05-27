import axios from 'axios';

// Define server base URL (IPv4 direct address)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Response Interceptor: Uniform error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.response) {
      // Server responded with an error code (4xx, 5xx)
      errorMessage = error.response.data.error || errorMessage;
    } else if (error.request) {
      // Request was made but no response was received (Network error)
      errorMessage = 'Failed to connect to the backend server. Please verify the server is running.';
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// API Endpoints
export const leadsApi = {
  // GET all leads (supports query filters)
  getAll: (params) => api.get('/leads', { params }),
  
  // POST create a new lead
  create: (leadData) => api.post('/leads', leadData),
  
  // PUT update a lead (e.g. status)
  update: (id, leadData) => api.put(`/leads/${id}`, leadData),
  
  // DELETE remove a lead
  delete: (id) => api.delete(`/leads/${id}`),
};

export default api;
