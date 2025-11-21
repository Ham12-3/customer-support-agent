import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest } from '@/types/api';

/**
 * Custom hook for login functionality
 * Handles login logic, loading states, and errors
 */
export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (data: LoginRequest) => {
      setIsLoading(true);
      setError('');

      try {
        const response = await api.auth.login(data);
        setAuth(response.user, response.accessToken, response.refreshToken);
        router.push('/dashboard');
        return { success: true };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.title ||
          'Login failed. Please check your credentials and try again.';
        
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [router, setAuth]
  );

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    login,
    error,
    isLoading,
    clearError,
  };
}

