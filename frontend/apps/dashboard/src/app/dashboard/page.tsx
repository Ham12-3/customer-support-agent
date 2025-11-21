'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Globe, 
  BookOpen, 
  TrendingUp, 
  Users,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import GlassmorphismLayout from '@/components/GlassmorphismLayout';
import { StatCard } from '@/components/ui/StatCard';
import { ModernCard } from '@/components/ui/ModernCard';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [stats, setStats] = useState({
    conversations: 0,
    domains: 0,
    documents: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadStats();
    }
  }, [isAuthenticated, router]);

  const loadStats = async () => {
    try {
      const domainsData = await api.domains.getAll();
      setStats((prev) => ({ 
        ...prev, 
        domains: domainsData.items?.length || 0,
        conversations: Math.floor(Math.random() * 1000), // Demo data
        documents: Math.floor(Math.random() * 50),
        activeUsers: Math.floor(Math.random() * 100),
      }));
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || loading) {
    return null;
  }

  const quickActions = [
    {
      title: 'Add Domain',
      description: 'Connect a new website',
      icon: Globe,
      href: '/dashboard/domains',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Upload Documents',
      description: 'Expand knowledge base',
      icon: BookOpen,
      href: '/dashboard/knowledge-base',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'View Conversations',
      description: 'Check customer chats',
      icon: MessageSquare,
      href: '/dashboard/conversations',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <GlassmorphismLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Here's what's happening with your customer support system today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Conversations"
            value={stats.conversations}
            icon={<MessageSquare className="w-6 h-6" />}
            trend={12.5}
            color="blue"
            delay={0}
          />
          <StatCard
            title="Connected Domains"
            value={stats.domains}
            icon={<Globe className="w-6 h-6" />}
            trend={5.2}
            color="green"
            delay={0.1}
          />
          <StatCard
            title="Knowledge Base"
            value={stats.documents}
            icon={<BookOpen className="w-6 h-6" />}
            trend={8.1}
            color="purple"
            delay={0.2}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={<Users className="w-6 h-6" />}
            trend={-2.4}
            color="orange"
            delay={0.3}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary-500" />
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={cn(
                      'group relative overflow-hidden',
                      'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
                      'border border-gray-200/50 dark:border-gray-700/50',
                      'rounded-2xl p-6',
                      'shadow-soft hover:shadow-hard',
                      'transition-all duration-300',
                      'cursor-pointer'
                    )}
                  >
                    <div className={cn(
                      'absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-bl-full',
                      action.color
                    )} />
                    
                    <div className="relative z-10">
                      <div className={cn(
                        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4',
                        action.color,
                        'shadow-lg group-hover:scale-110 transition-transform duration-300'
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {action.description}
                      </p>
                      
                      <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:gap-2 transition-all">
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Organization Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {user?.tenantName?.charAt(0) || 'C'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Your Organization
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.tenantName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                      {user?.role}
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  Pro Plan
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unlimited access
                </p>
              </div>
            </div>
          </ModernCard>
        </motion.div>
      </div>
    </GlassmorphismLayout>
  );
}