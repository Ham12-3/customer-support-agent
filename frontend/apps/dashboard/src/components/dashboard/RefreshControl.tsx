'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface RefreshControlProps {
  onRefresh: () => Promise<void> | void;
  autoRefreshInterval?: number; // in seconds, 0 to disable
  lastUpdated?: Date;
}

/**
 * Component for manual refresh and auto-refresh control
 */
export function RefreshControl({
  onRefresh,
  autoRefreshInterval = 0,
  lastUpdated,
}: RefreshControlProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(autoRefreshInterval > 0);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');

  // Update time since last update
  useEffect(() => {
    if (!lastUpdated) return;

    const updateTime = () => {
      const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (seconds < 60) {
        setTimeSinceUpdate(`${seconds}s ago`);
      } else if (seconds < 3600) {
        setTimeSinceUpdate(`${Math.floor(seconds / 60)}m ago`);
      } else {
        setTimeSinceUpdate(`${Math.floor(seconds / 3600)}h ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefreshEnabled || !autoRefreshInterval || autoRefreshInterval <= 0) {
      return;
    }

    const interval = setInterval(async () => {
      if (!isRefreshing) {
        await handleRefresh(true); // Silent refresh
      }
    }, autoRefreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, autoRefreshInterval, isRefreshing]);

  const handleRefresh = useCallback(async (silent = false) => {
    if (isRefreshing) return;

    if (!silent) {
      setIsRefreshing(true);
    }

    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      if (!silent) {
        setIsRefreshing(false);
      }
    }
  }, [onRefresh, isRefreshing]);

  return (
    <div className="flex items-center gap-3">
      {lastUpdated && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated {timeSinceUpdate || 'just now'}</span>
        </div>
      )}

      {autoRefreshInterval > 0 && (
        <button
          onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
          className={cn(
            'text-xs px-2 py-1 rounded-lg transition-colors',
            autoRefreshEnabled
              ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20'
              : 'text-gray-500 bg-white/[0.02] hover:bg-white/[0.04]'
          )}
          title={autoRefreshEnabled ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
        >
          Auto
        </button>
      )}

      <button
        onClick={() => handleRefresh(false)}
        disabled={isRefreshing}
        className={cn(
          'p-2 rounded-lg transition-all',
          'bg-white/[0.02] hover:bg-white/[0.04]',
          'text-gray-400 hover:text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        title="Refresh data"
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : 0 }}
          transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
        >
          <RefreshCw className={cn('w-4 h-4', isRefreshing && 'text-primary-400')} />
        </motion.div>
      </button>
    </div>
  );
}

