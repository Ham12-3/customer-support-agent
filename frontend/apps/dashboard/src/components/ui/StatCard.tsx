'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: number; // Percentage change
  trendLabel?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel = 'vs last month',
  color = 'blue',
  delay = 0,
}: StatCardProps) {
  const [count, setCount] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.floor(stepValue * currentStep));
      } else {
        setCount(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorVariants = {
    blue: {
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200/50 dark:border-blue-500/30',
      glow: 'shadow-blue-500/20',
    },
    green: {
      gradient: 'from-green-500/10 via-green-500/5 to-transparent',
      icon: 'bg-green-500/10 text-green-600 dark:text-green-400',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200/50 dark:border-green-500/30',
      glow: 'shadow-green-500/20',
    },
    purple: {
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      icon: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200/50 dark:border-purple-500/30',
      glow: 'shadow-purple-500/20',
    },
    orange: {
      gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
      icon: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200/50 dark:border-orange-500/30',
      glow: 'shadow-orange-500/20',
    },
    red: {
      gradient: 'from-red-500/10 via-red-500/5 to-transparent',
      icon: 'bg-red-500/10 text-red-600 dark:text-red-400',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200/50 dark:border-red-500/30',
      glow: 'shadow-red-500/20',
    },
  };

  const colors = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border backdrop-blur-xl',
        'bg-white/80 dark:bg-gray-800/80',
        colors.border,
        'shadow-soft hover:shadow-medium transition-all duration-300',
        'group cursor-pointer'
      )}
    >
      {/* Gradient Background */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-50',
          colors.gradient
        )}
      />

      {/* Glow effect on hover */}
      <div
        className={cn(
          'absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100',
          'transition-opacity duration-300 blur-xl',
          colors.glow
        )}
      />

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-xl', colors.icon)}>
            {icon}
          </div>

          {trend !== undefined && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3, type: 'spring' }}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                trend >= 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              {trend >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(trend)}%
            </motion.div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <motion.p
            className={cn('text-4xl font-bold', colors.text)}
            key={count}
          >
            {count.toLocaleString()}
          </motion.p>
          {trend !== undefined && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {trendLabel}
            </p>
          )}
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-shimmer animate-shimmer" />
      </div>
    </motion.div>
  );
}