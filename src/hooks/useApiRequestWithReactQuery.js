import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApiRequest from './useApiRequest';

// Generate a unique query key based on the URL and parameters
const generateQueryKey = (url, params = {}) => {
  return [url, JSON.stringify(params)]; // Stringify parameters for consistent caching
};

const useApiRequestWithReactQuery = () => {
  const { makeRequest } = useApiRequest();
  const queryClient = useQueryClient();

  const useApiQuery = (url, options = {}) => {
    const queryKey = generateQueryKey(url, options.params);
    return useQuery({
      queryKey,
      queryFn: () => makeRequest(url, 'GET'),
      ...options,
      retry: options.retry ?? false, // Default to false if not specified
      onError: (error) => {
        console.error('API Query Error:', error);
      },
    });
  };

  const useApiMutation = (url, method = 'POST', options = {}) => {
    return useMutation({
      mutationFn: (requestData) => makeRequest(url, method, requestData),
      onSuccess: () => {
        queryClient.invalidateQueries(generateQueryKey(url));
      },
      onError: (error) => {
        console.error('API Mutation Error:', error);
        if (options.onError) {
          options.onError(error); 
        }
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

export default useApiRequestWithReactQuery;
