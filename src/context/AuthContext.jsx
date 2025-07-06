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

  // ---------- USER & AUTH ----------
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

  const user = useMemo(() => userDataResponse?.userData ?? null, [userDataResponse]);
  const role = useMemo(() => authResponse?.role ?? null, [authResponse]);

  const isAuthenticated = useMemo(() => {
    if (userLoading || authLoading) return null;
    return !!authResponse?.success;
  }, [authResponse, userLoading, authLoading]);

  const loading = userLoading || authLoading;
  const error = userError || authError;

  const refetch = useCallback(async () => {
    await Promise.all([fetchUserData(), checkAuthentication()]);
  }, [fetchUserData, checkAuthentication]);

  const [activeTab, setActiveTab] = useState('Dashboard');

  // ---------- PROJECTS ----------
  const {
    data: projectResponse,
    isLoading: projectsLoading,
    refetch: fetchProjects,
  } = useApiQuery('/project', { retry: false });

  const projects = projectResponse?.projects || [];

  // ---------- CONSULTATIONS ----------
  const {
    data: consultationResponse,
    isLoading: consultationsLoading,
    refetch: fetchConsultations,
  } = useApiQuery('/consultation/get-consultations', { retry: false });

  const consultations = consultationResponse?.consultations || [];

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        error,
        backend,
        fetchUserData,
        checkAuthentication,
        refetch,
        activeTab,
        setActiveTab,

        // Project state
        projects,
        fetchProjects,
        projectsLoading,

        // Consultation state
        consultations,
        fetchConsultations,
        consultationsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
