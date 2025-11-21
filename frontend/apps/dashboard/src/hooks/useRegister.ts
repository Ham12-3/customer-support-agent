import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { RegisterRequest } from '@/types/api';

/**
 * Custom hook for registration functionality
 * Handles registration logic, loading states, and errors
 */
export function useRegister() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const register = useCallback(
    async (data: RegisterRequest) => {
      setIsLoading(true);
      setError('');

      try {
        const response = await api.auth.register(data);
        setAuth(response.user, response.accessToken, response.refreshToken);
        router.push('/dashboard');
        return { success: true };
      } catch (err: any) {
        let errorMessage = 'Registration failed. Please try again.';

        // Handle validation errors
        if (err.response?.data?.errors) {
          const errors = err.response.data.errors;
          const firstError = Object.values(errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        } else if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response?.data?.title) {
          errorMessage = err.response.data.title;
        }

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
    register,
    error,
    isLoading,
    clearError,
  };
}

