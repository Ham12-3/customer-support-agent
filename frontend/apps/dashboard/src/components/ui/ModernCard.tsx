import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'soft';
  hover?: boolean;
  glow?: boolean;
}

export function ModernCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  glow = false 
}: ModernCardProps) {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-soft',
    glass: 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-medium',
    elevated: 'bg-white dark:bg-gray-800 shadow-hard border-0',
    soft: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 shadow-soft',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        hover && 'hover:shadow-hard hover:-translate-y-1',
        glow && 'hover:shadow-glow',
        className
      )}
    >
      {children}
    </div>
  );
}