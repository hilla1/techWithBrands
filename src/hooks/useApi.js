import { useState, useCallback } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Core API request hook
const useApiRequest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(
    async (url, method = 'GET', requestData = null, headers = {}) => {
      setLoading(true);
      setError(null);

      const baseURL = import.meta.env.VITE_API_URL;
      const fullURL = url.startsWith('/')
        ? `${baseURL.replace(/\/+$/, '')}${url}`
        : `${baseURL.replace(/\/+$/, '')}/${url}`;

      try {
        const config = {
          method,
          url: fullURL,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          ...(requestData && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())
            ? { data: requestData }
            : {}),
          withCredentials: true,
        };

        const response = await axios(config);
        setData(response.data);
        return response.data;
      } catch (err) {
        const statusCode = err.response?.status || null;

        if (statusCode === 401) {
          setError('Unauthorized. Please log in.');
        } else if (statusCode === 403) {
          setError('Forbidden. You do not have access.');
        } else {
          setError(err.response?.data || err.message);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, makeRequest };
};

// Helper to create consistent React Query keys
const generateQueryKey = (url, params = {}) => {
  return [url, JSON.stringify(params)];
};

// Combined hook with React Query integration
const useApi = () => {
  const { makeRequest } = useApiRequest();
  const queryClient = useQueryClient();

  const useApiQuery = (url, options = {}) => {
    const queryKey = generateQueryKey(url, options.params);
    return useQuery({
      queryKey,
      queryFn: () => makeRequest(url, 'GET'),
      retry: options.retry ?? false,
      ...options,
      onError: (error) => {
        console.error('API Query Error:', error);
        if (options.onError) options.onError(error);
      },
    });
  };

  const useApiMutation = (url, method = 'POST', options = {}) => {
    return useMutation({
      mutationFn: (requestData) => makeRequest(url, method, requestData),
      onSuccess: () => {
        queryClient.invalidateQueries(generateQueryKey(url));
        if (options.onSuccess) options.onSuccess();
      },
      onError: (error) => {
        console.error('API Mutation Error:', error);
        if (options.onError) options.onError(error);
      },
      ...options,
    });
  };

  return {
    useApiQuery,
    useApiMutation,
    useApiDelete: (url, options) => useApiMutation(url, 'DELETE', options),
    useApiCreate: (url, options) => useApiMutation(url, 'POST', options),
    useApiUpdate: (url, options) => useApiMutation(url, 'PATCH', options),
    useApiPut: (url, options) => useApiMutation(url, 'PUT', options),
    getCachedData: (url) => queryClient.getQueryData(generateQueryKey(url)),
  };
};

export default useApi;
