import { useQuery } from '@tanstack/react-query';
import { userApi } from '../services/api';

export const useAuth = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch: refreshUser
  } = useQuery({
    queryKey: ['userData'],
    queryFn: userApi.getCurrentUser,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache for 30 minutes
  });

  return {
    user,
    isLoading,
    error,
    refreshUser,
    isAuthenticated: !!user,
  };
}; 