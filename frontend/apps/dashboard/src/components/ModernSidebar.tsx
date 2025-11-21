'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Globe,
  BookOpen,
  MessageSquare,
  Settings,
  ChevronRight,
  Sparkles,
  BarChart3,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { 
    href: '/dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    badge: null,
  },
  { 
    href: '/dashboard/domains', 
    label: 'Domains', 
    icon: Globe,
    badge: null,
  },
  { 
    href: '/dashboard/knowledge-base', 
    label: 'Knowledge Base', 
    icon: BookOpen,
    badge: 'New',
  },
  { 
    href: '/dashboard/conversations', 
    label: 'Conversations', 
    icon: MessageSquare,
    badge: null,
  },
  { 
    href: '/dashboard/analytics', 
    label: 'Analytics', 
    icon: BarChart3,
    badge: 'Soon',
  },
];

export function ModernSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50">
      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              className="block relative"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  'group relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-primary-500/5 text-primary-600 dark:text-primary-400 shadow-soft'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className={cn(
                  'relative z-10 transition-transform duration-200',
                  hoveredItem === item.href && 'scale-110'
                )}>
                  <Icon className={cn(
                    'w-5 h-5 transition-colors',
                    isActive && 'text-primary-600 dark:text-primary-400'
                  )} />
                </div>

                {/* Label */}
                <span className={cn(
                  'relative z-10 font-medium text-sm',
                  isActive && 'font-semibold'
                )}>
                  {item.label}
                </span>

                {/* Badge */}
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'ml-auto px-2 py-0.5 text-xs font-medium rounded-full',
                      item.badge === 'New'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    )}
                  >
                    {item.badge}
                  </motion.span>
                )}

                {/* Hover arrow */}
                <AnimatePresence>
                  {hoveredItem === item.href && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="ml-auto"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover background */}
                {hoveredItem === item.href && !isActive && (
                  <motion.div
                    layoutId="hoverBackground"
                    className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-transparent dark:from-gray-800/50 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Organization Info - Bottom Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-4 left-4 right-4"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-pink-500/10 p-4 border border-primary-200/50 dark:border-primary-500/30 backdrop-blur-sm">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl animate-pulse-slow" />
            <div className="absolute bottom-0 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Organization
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user?.tenantName}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                {user?.role}
              </span>
              <span className="px-2 py-1 bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                Pro
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}