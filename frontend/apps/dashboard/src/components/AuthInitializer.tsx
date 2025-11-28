'use client';

import { useAuthInit } from '@/hooks/useAuthInit';

/**
 * Component to initialize authentication state on app load
 * Should be placed in the root layout
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInit();
  return <>{children}</>;
}

