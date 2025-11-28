import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  animation = 'pulse' 
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        animation === 'pulse' && 'animate-pulse',
        animation === 'wave' && 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <Skeleton variant="rectangular" className="w-16 h-6" />
      </div>
      <Skeleton variant="text" className="w-24 mb-2" />
      <Skeleton variant="rectangular" className="w-32 h-10" />
    </div>
  );
}

export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton variant="text" className={cn("w-full", className)} />;
}

export function SkeletonTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" className="w-48 h-8" />
        <Skeleton variant="rectangular" className="w-24 h-8" />
      </div>
      <div className="border rounded-lg border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="text" className="w-1/4" />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 flex gap-4">
            {[1, 2, 3, 4].map((col) => (
              <Skeleton key={col} variant="text" className="w-1/4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-64 h-8" />
          <Skeleton variant="text" className="w-48" />
        </div>
        <Skeleton variant="rectangular" className="w-32 h-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>
      <SkeletonCard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}