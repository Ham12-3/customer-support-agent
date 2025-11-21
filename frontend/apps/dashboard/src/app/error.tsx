'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

/**
 * Next.js 14 Error Component
 * Catches errors in the app router
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console (send to error tracking in production)
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-error-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-8">
          We're sorry for the inconvenience. The application encountered an unexpected error.
        </p>

        {/* Show error details in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-gray-100 rounded-lg text-left">
            <p className="font-mono text-sm text-error-600 mb-2">
              {error.name}: {error.message}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-gray-600">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={reset} fullWidth size="lg">
            Try Again
          </Button>
          
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            fullWidth
            size="lg"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}

