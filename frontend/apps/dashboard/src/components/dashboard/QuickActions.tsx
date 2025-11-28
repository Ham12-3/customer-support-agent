'use client';

import { useRouter } from 'next/navigation';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import {
  Zap,
  Upload,
  Globe,
  Settings,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Zap;
  onClick: () => void;
  color?: string;
}

/**
 * Quick actions component providing shortcuts to frequently used features
 */
export function QuickActions() {
  const router = useRouter();

  const actions: QuickAction[] = [
    {
      id: 'create-agent',
      label: 'Create Agent',
      icon: Zap,
      onClick: () => router.push('/dashboard/domains'), // Navigate to domains where agents are created
      color: 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20',
    },
    {
      id: 'upload-document',
      label: 'Upload Document',
      icon: Upload,
      onClick: () => router.push('/dashboard/knowledge-base'),
      color: 'text-blue-400 bg-blue-400/10 hover:bg-blue-400/20',
    },
    {
      id: 'add-domain',
      label: 'Add Domain',
      icon: Globe,
      onClick: () => router.push('/dashboard/domains'),
      color: 'text-green-400 bg-green-400/10 hover:bg-green-400/20',
    },
    {
      id: 'conversations',
      label: 'Conversations',
      icon: MessageSquare,
      onClick: () => router.push('/dashboard/conversations'),
      color: 'text-purple-400 bg-purple-400/10 hover:bg-purple-400/20',
    },
    {
      id: 'knowledge-base',
      label: 'Knowledge Base',
      icon: BookOpen,
      onClick: () => router.push('/dashboard/knowledge-base'),
      color: 'text-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => router.push('/dashboard/settings'),
      color: 'text-gray-400 bg-gray-400/10 hover:bg-gray-400/20',
    },
  ];

  return (
    <LuxuryCard>
      <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={action.onClick}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-4 rounded-xl',
                'bg-white/[0.02] border border-white/[0.02]',
                'hover:bg-white/[0.04] hover:border-white/[0.05]',
                'transition-all cursor-pointer group',
                action.color
              )}
            >
              <div className={cn('p-2 rounded-lg', action.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-white group-hover:text-white">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </LuxuryCard>
  );
}

