'use client';

import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TimeRange = '7d' | '30d' | '90d' | 'custom';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

/**
 * Component for selecting time range for analytics charts
 */
export function TimeRangeSelector({
  value,
  onChange,
  className,
}: TimeRangeSelectorProps) {
  const ranges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] rounded-lg border border-white/[0.05]">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => onChange(range.value)}
            className={cn(
              'px-3 py-1 rounded-md text-sm font-medium transition-all',
              value === range.value
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}

