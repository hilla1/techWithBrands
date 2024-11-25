// src/hooks/useApiRequest.js
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import useLogout from './useLogout';

const useApiRequest = () => {
  const [token, setToken] = useState(null); // Manage token state here
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [retryCount, setRetryCount] = useState(0); 
  const { logout } = useLogout();

  // Token refresh function
  const refreshAuthToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      return response.data; // Return the refreshed token
    } catch (error) {
      console.error('Failed to refresh token', error);
      throw error;
    }
  };

  // Axios interceptors to handle token refresh
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        config.withCredentials = true; // Ensure credentials (cookies) are sent
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response, 
      async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshedToken = await refreshAuthToken(); 
            console.log('Token refreshed. Retrying original request...');
            return axios(originalRequest); 
          } catch (refreshError) {
            console.error('Token refresh failed', refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Function to handle API requests
  const makeRequest = useCallback(
    async (url, method = 'GET', requestData = null, headers = {}) => {
      setLoading(true); 
      setError(null);

      const baseURL = import.meta.env.VITE_API_URL;
      const fullURL = url.startsWith('/')
        ? `${baseURL.replace(/\/+$/, '')}${url}`
        : `${baseURL.replace(/\/+$/, '')}/${url}`;

      console.log('Making API Request:', { method, url: fullURL, data: requestData, headers });

      try {
        const config = {
          method,
          url: fullURL,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
          },
          ...(requestData && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())
            ? { data: requestData }
            : {}),
          withCredentials: true,
        };

        const response = await axios(config); 
        setData(response.data); 
        setRetryCount(0); 
        return response.data;
      } catch (err) {
        const statusCode = err.response ? err.response.status : null;

        if (statusCode === 401 && retryCount < 2) {
          console.warn(`Request failed with status ${statusCode}. Retrying attempt ${retryCount + 1}...`);

          setRetryCount((prev) => prev + 1);

          try {
            await refreshAuthToken(); 
            console.log('Token refreshed. Retrying the request...');
            return await makeRequest(url, method, requestData, headers); 
          } catch (tokenError) {
            console.error('Token refresh failed:', tokenError);
            setError('Authentication failed. Please log in again.');
            logout();
          }
        } else if (statusCode === 403) {
          console.error('Access denied (403):', err);
          setError('You do not have permission to access this resource.');
        } else {
          console.error('API request failed:', err);
          setError(err.response ? err.response.data : err.message);
        }

        throw err; 
      } finally {
        setLoading(false); 
      }
    },
    [token, retryCount] 
  );

  return { data, loading, error, makeRequest }; 
};

export default useApiRequest;
