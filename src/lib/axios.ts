import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request/response interceptors for auth tokens or global error handling
api.interceptors.request.use(
  (config) => {
    // For example, attach a token to every request if it exists:
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and it's not a retry of a refresh request itself
    if (
      error.response?.status === 401 && 
      originalRequest && 
      !(originalRequest as any)._isRetry &&
      !originalRequest.url?.includes('v1/auth/token/refresh/')
    ) {
      (originalRequest as any)._isRetry = true;

      try {
        // Automatically request a new access token using the HttpOnly refresh_token cookie
        await api.post('v1/auth/token/refresh/');
        
        // If successful, the browser automatically saves the new cookie
        // Retry the original request seamlessly
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token itself is invalid or expired, reject
        // This will propagate to AuthGuard and log the user out
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
