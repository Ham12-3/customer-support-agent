'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, accessToken, setAuth, clearAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [authVerified, setAuthVerified] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let redirecting = false;
    
    const checkAuth = async () => {
      // Wait for Zustand persist to hydrate properly
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!isMounted || redirecting) return;
      
      // Check if we just logged in (within last 10 seconds) - give enough time for page load
      const loginTime = sessionStorage.getItem('login_time');
      const justLoggedIn = loginTime && (Date.now() - parseInt(loginTime)) < 10000;
      
      // Check if we have a token in localStorage (primary source of truth)
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const storedRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      const token = accessToken || storedToken;
      
      // If we have a token OR just logged in, allow access
      if (token || justLoggedIn) {
        if (isMounted) {
          setAuthVerified(true);
          setIsChecking(false);
          
          // Sync Zustand state if needed (non-blocking)
          if (storedToken && storedRefreshToken && (!isAuthenticated || accessToken !== storedToken)) {
            // Try to get user in background to sync state, but don't block
            api.auth.getCurrentUser()
              .then((user) => {
                if (isMounted) {
                  setAuth(user, storedToken, storedRefreshToken);
                  // Clear the login time after successful auth
                  sessionStorage.removeItem('login_time');
                }
              })
              .catch((error) => {
                console.log('Background auth sync failed:', error);
                // Silently fail - API interceptor will handle auth errors
                // Only redirect if we don't have a token AND didn't just login
                if (!token && !justLoggedIn && isMounted && !redirecting) {
                  redirecting = true;
                  clearAuth();
                  router.push('/login?redirect=' + encodeURIComponent(pathname));
                }
              });
          }
        }
        return;
      }
      
      // No token and didn't just login - redirect to login
      if (!token && !justLoggedIn) {
        if (isMounted && !redirecting) {
          redirecting = true;
          clearAuth();
          router.push('/login?redirect=' + encodeURIComponent(pathname));
        }
        return;
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  // Check localStorage as primary source (Zustand might not be hydrated yet)
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('access_token');

  if (isChecking) {
    return <PageLoader />;
  }

  // If we verified auth successfully, show content
  // Otherwise, if we have a token, show content (will be verified by API calls)
  // If no token, will redirect
  if (!hasToken && !authVerified) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

