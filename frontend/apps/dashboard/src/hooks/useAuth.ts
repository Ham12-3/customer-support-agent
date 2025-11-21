import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

/**
 * Custom hook for authentication logic
 * Provides centralized auth state and actions
 */
export function useAuth() {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const logout = useCallback(() => {
    clearAuth();
    router.push('/login');
  }, [clearAuth, router]);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  }, [isAuthenticated, router]);

  return {
    isAuthenticated,
    user,
    logout,
    requireAuth,
  };
}

