import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import useApi from '../hooks/useApi';

const backend = import.meta.env.VITE_API_URL;
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { useApiQuery, useApiMutation } = useApi();

  const {
    data: userDataResponse,
    isLoading: userLoading,
    error: userError,
    refetch: fetchUserData,
  } = useApiQuery('/user/data', { retry: false });

  const [authResponse, setAuthResponse] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const {
    mutateAsync: checkAuthentication,
    isPending: isAuthPending,
  } = useApiMutation('/auth/is-auth', 'POST', {
    onSuccess: (data) => {
      setAuthResponse(data);
      setAuthError(null);
    },
    onError: (err) => {
      setAuthResponse(null);
      setAuthError(err);
    },
    onSettled: () => {
      setAuthLoading(false);
    },
  });

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const loading = userLoading || authLoading;
  const error = userError || authError;

  const user = useMemo(() => userDataResponse?.userData ?? null, [userDataResponse]);
  const role = useMemo(() => authResponse?.role ?? null, [authResponse]);

  const isAuthenticated = useMemo(() => {
    if (loading) return null;
    return !!authResponse?.success;
  }, [authResponse, loading]);

  const refetch = useCallback(async () => {
    await Promise.all([fetchUserData(), checkAuthentication()]);
  }, [fetchUserData, checkAuthentication]);

  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        error,
        fetchUserData,
        checkAuthentication,
        refetch,
        backend,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
