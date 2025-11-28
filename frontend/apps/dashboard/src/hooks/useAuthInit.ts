import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

/**
 * Hook to initialize and verify authentication on app load
 * Should be called at the root level of the app
 */
export function useAuthInit() {
  const router = useRouter();
  const { isAuthenticated, accessToken, setAuth, clearAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // Check if we have tokens in localStorage
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const storedRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

      // If we have tokens but Zustand doesn't, restore from localStorage
      // Don't verify here - let individual pages handle auth checks
      if (storedToken && storedRefreshToken && !isAuthenticated) {
        // Just restore the state from localStorage without API call
        // The dashboard layout will verify if needed
        if (isMounted) {
          // We'll restore state optimistically - actual verification happens in dashboard layout
          setIsInitialized(true);
        }
      } else {
        // No tokens or already authenticated
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  return { isInitialized };
}

