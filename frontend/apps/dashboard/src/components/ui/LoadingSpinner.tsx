import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={cn(sizes[size], 'text-primary-600', className)} />
      </motion.div>
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="xl" text="Loading..." />
    </div>
  );
}

export function InlineSpinner({ className }: { className?: string }) {
  return <LoadingSpinner size="sm" className={className} />;
}

export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-inherit">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}