'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LuxuryLayout from '@/components/LuxuryLayout';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { RecentConversations } from '@/components/dashboard/RecentConversations';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RefreshControl } from '@/components/dashboard/RefreshControl';
import { TimeRangeSelector, TimeRange } from '@/components/dashboard/TimeRangeSelector';
import { 
  Users, 
  MessageSquare, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe, 
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { api } from '@/lib/api';
import { PageLoader } from '@/components/ui/LoadingSpinner';

interface DashboardStats {
  totalConversations: number;
  activeAgents: number;
  averageResponseTimeSeconds: number;
  conversationsChangePercent: number;
  responseTimeChangePercent: number;
  agentsChangePercent: number;
}

interface AnalyticsData {
  dailyData: Array<{ name: string; value: number }>;
}

interface SystemHealth {
  apiLatencyMs: number;
  databaseLoadPercent: number;
  memoryUsagePercent: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const loadDashboardData = useCallback(async () => {
    try {
      // Use Promise.allSettled to prevent one failure from breaking everything
      const results = await Promise.allSettled([
        api.dashboard.getStats().catch(() => null),
        api.dashboard.getAnalytics().catch(() => null),
        api.dashboard.getSystemHealth().catch(() => null),
        api.users.getProfile().catch(() => ({ fullName: 'User' })),
        api.domains.getAll().catch(() => ({ items: [] }))
      ]);

      // Only set data if requests succeeded
      if (results[0].status === 'fulfilled' && results[0].value) {
        setStats(results[0].value);
      }
      if (results[1].status === 'fulfilled' && results[1].value) {
        setAnalytics(results[1].value);
      }
      if (results[2].status === 'fulfilled' && results[2].value) {
        setHealth(results[2].value);
      }
      if (results[3].status === 'fulfilled' && results[3].value) {
        setUserName(results[3].value.fullName?.split(' ')[0] || 'User');
      }
      if (results[4].status === 'fulfilled' && results[4].value) {
        setDomains(results[4].value.items?.slice(0, 3) || []);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Don't redirect on error - let API interceptor handle auth errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) return <PageLoader />;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statsData = [
    { 
      label: 'Total Conversations', 
      value: stats?.totalConversations.toLocaleString() || '0', 
      change: `${(stats?.conversationsChangePercent || 0) > 0 ? '+' : ''}${(stats?.conversationsChangePercent || 0).toFixed(1)}%`, 
      icon: MessageSquare,
      isPositive: (stats?.conversationsChangePercent || 0) >= 0,
      onClick: () => router.push('/dashboard/conversations'),
    },
    { 
      label: 'Active Agents', 
      value: stats?.activeAgents.toString() || '0', 
      change: `${(stats?.agentsChangePercent || 0) > 0 ? '+' : ''}${(stats?.agentsChangePercent || 0).toFixed(0)}`, 
      icon: Users,
      isPositive: (stats?.agentsChangePercent || 0) >= 0,
      onClick: () => router.push('/dashboard/agents'),
    },
    { 
      label: 'Avg. Response Time', 
      value: `${stats?.averageResponseTimeSeconds.toFixed(1) || '0'}s`, 
      change: `${(stats?.responseTimeChangePercent || 0).toFixed(1)}%`, 
      icon: Clock,
      isPositive: (stats?.responseTimeChangePercent || 0) < 0, // Negative is good for response time
      onClick: () => router.push('/dashboard/analytics'),
    },
  ];

  return (
    <LuxuryLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {getGreeting()}, {userName}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400"
            >
              Here&apos;s what&apos;s happening with your agents today.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => router.push('/dashboard/domains')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium shadow-glow-md transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Create Agent</span>
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <LuxuryCard
                onClick={stat.onClick}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/[0.03] rounded-xl">
                    <stat.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <span className={cn(
                    "flex items-center gap-1 text-sm px-2 py-1 rounded-lg",
                    stat.isPositive 
                      ? "text-green-400 bg-green-400/10" 
                      : "text-red-400 bg-red-400/10"
                  )}>
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </LuxuryCard>
            </motion.div>
          ))}
        </div>

        {/* Main Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LuxuryCard className="h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white">Analytics Overview</h3>
                <p className="text-sm text-gray-500">
                  Message volume over the last {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} days
                </p>
              </div>
              <div className="flex items-center gap-3">
                <RefreshControl
                  onRefresh={loadDashboardData}
                  autoRefreshInterval={30}
                  lastUpdated={lastUpdated || undefined}
                />
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              </div>
            </div>
            <div className="h-[300px] w-full">
              {analytics && analytics.dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.dailyData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#121218', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px',
                        color: '#fff' 
                      }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4F46E5" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No analytics data available
                </div>
              )}
            </div>
          </LuxuryCard>
        </motion.div>

        {/* Quick Actions and Recent Conversations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <QuickActions />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <RecentConversations limit={5} />
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Domains */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <LuxuryCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Active Domains</h3>
                {domains.length > 0 && (
                  <button
                    onClick={() => router.push('/dashboard/domains')}
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    View All
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {domains.length > 0 ? (
                  domains.map((domain, i) => (
                    <div 
                      key={domain.id || i} 
                      onClick={() => router.push(`/dashboard/domains/${domain.id}`)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{domain.domainUrl}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              domain.isVerified || domain.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                            )} />
                            <p className="text-xs text-gray-500">
                              {domain.isVerified || domain.status === 'Active' ? 'Operational' : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-500 group-hover:text-primary-400 transition-colors">
                        {Math.floor(Math.random() * 100) + 50}ms
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm mb-4">No domains configured yet</p>
                    <button
                      onClick={() => router.push('/dashboard/domains')}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Add Domain
                    </button>
                  </div>
                )}
              </div>
            </LuxuryCard>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <LuxuryCard>
              <h3 className="text-lg font-semibold text-white mb-6">System Health</h3>
              <div className="space-y-6">
                {health && [
                  { label: 'API Latency', value: Math.min(health.apiLatencyMs, 100), color: 'bg-green-500', unit: 'ms' },
                  { label: 'Database Load', value: health.databaseLoadPercent, color: 'bg-primary-500', unit: '%' },
                  { label: 'Memory Usage', value: health.memoryUsagePercent, color: 'bg-purple-500', unit: '%' },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">{metric.label}</span>
                      <span className="text-sm font-medium text-white">
                        {metric.label === 'API Latency' ? `${health.apiLatencyMs.toFixed(0)}ms` : `${metric.value.toFixed(0)}%`}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                        className={cn("h-full rounded-full", metric.color)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </LuxuryCard>
          </motion.div>
        </div>
      </div>
    </LuxuryLayout>
  );
}