// src/hooks/useAuth.js
import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../redux/slices/dashboardSlice';
import useApiRequest from './useApiRequest';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const { makeRequest } = useApiRequest();

  const { data: userData, status, error } = useQuery({
    queryKey: ['authMe'], // Unique key for caching and identifying the query
    queryFn: () => makeRequest('/auth/me', 'GET'), // Simplified the query function
    // You could add onError and onSettled callbacks if needed
  });

  useEffect(() => {
    if (status === 'loading') return; // Early exit if loading

    // Check for API response status
    if (userData?.status === 'success' && userData?.user) {
      setIsAuthenticated(true); // Set authenticated state to true
      Cookies.set('twb', 'session', { expires: 7 });

      // Dispatch user details to the Redux store
      const { role = 'client', id = null } = userData.user; // Fallback values
      dispatch(setUserDetails({ role, id }));
    } else {
      console.error('Authentication failed:' || userData);
      setIsAuthenticated(false); // Set authenticated state to false
    }
  }, [status, userData, error, dispatch]);

  // Callback to get user data
  const getUser = useCallback(() => {
    return userData?.user || null; // Return user data or null
  }, [userData]);

  return { isAuthenticated, getUser, loading: status === 'loading' }; // Return authentication state and loading status
};

export default useAuth;
