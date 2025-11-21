import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ErrorMessage component props
export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  variant?: 'inline' | 'banner' | 'alert';
  onDismiss?: () => void;
}

/**
 * Reusable ErrorMessage component for displaying errors
 * Supports inline, banner, and alert variants
 */
export function ErrorMessage({
  title = 'Error',
  message,
  variant = 'banner',
  onDismiss,
  className,
  ...props
}: ErrorMessageProps) {
  // Variant styles
  const variantStyles = {
    inline: 'text-sm text-error-600 flex items-center gap-1',
    banner: 'rounded-md bg-error-50 p-4',
    alert: 'rounded-lg border border-error-200 bg-error-50 p-4 shadow-sm',
  };

  if (variant === 'inline') {
    return (
      <div
        className={cn(variantStyles.inline, className)}
        role="alert"
        {...props}
      >
        <svg
          className="h-4 w-4 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(variantStyles[variant], className)}
      role="alert"
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-error-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-error-800">{title}</h3>
          <div className="mt-2 text-sm text-error-700">
            <p>{message}</p>
          </div>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex rounded-md bg-error-50 p-1.5 text-error-500 hover:bg-error-100 focus:outline-none focus:ring-2 focus:ring-error-600 focus:ring-offset-2 focus:ring-offset-error-50 transition-colors"
                aria-label="Dismiss error"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

