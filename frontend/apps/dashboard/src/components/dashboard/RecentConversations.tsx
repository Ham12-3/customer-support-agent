'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquare, ArrowRight, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { ConversationDto, ConversationStatus } from '@/types/api';
import { formatRelativeTime } from '@/lib/timeUtils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RecentConversationsProps {
  limit?: number;
}

/**
 * Component displaying recent conversations with quick access
 */
export function RecentConversations({ limit = 10 }: RecentConversationsProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await api.conversations.getAll({
          page: 1,
          pageSize: limit,
          sortBy: 'startedAt',
          sortOrder: 'desc',
        });
        
        // Handle both paginated and non-paginated responses
        const items = response.items || response.data || response || [];
        setConversations(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error('Error loading recent conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [limit]);

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case ConversationStatus.Resolved:
      case 'Resolved':
        return 'bg-green-500';
      case ConversationStatus.Open:
      case 'Open':
      case 'Active':
        return 'bg-yellow-500';
      case ConversationStatus.InProgress:
      case 'InProgress':
      case 'Escalated':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: ConversationStatus) => {
    switch (status) {
      case ConversationStatus.Resolved:
      case 'Resolved':
        return 'Resolved';
      case ConversationStatus.Open:
      case 'Open':
      case 'Active':
        return 'Active';
      case ConversationStatus.InProgress:
      case 'InProgress':
      case 'Escalated':
        return 'Escalated';
      default:
        return 'Closed';
    }
  };

  const handleConversationClick = (id: string) => {
    // Navigate to conversations page - individual conversation detail can be added later
    router.push('/dashboard/conversations');
  };

  if (loading) {
    return (
      <LuxuryCard>
        <h3 className="text-lg font-semibold text-white mb-6">Recent Conversations</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/[0.02] rounded-xl animate-pulse" />
          ))}
        </div>
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Conversations</h3>
        {conversations.length > 0 && (
          <button
            onClick={() => router.push('/dashboard/conversations')}
            className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Start by adding a domain and embedding the widget on your website to begin receiving conversations."
          action={{
            label: 'Add Domain',
            onClick: () => router.push('/dashboard/domains'),
          }}
        />
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleConversationClick(conversation.id)}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.05] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400 flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate">
                      {conversation.customerEmail || conversation.customerName || 'Anonymous User'}
                    </p>
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        getStatusColor(conversation.status as ConversationStatus)
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(conversation.startedAt)}</span>
                    <span className="text-gray-600">•</span>
                    <span>{conversation.messageCount} messages</span>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-lg',
                    conversation.status === ConversationStatus.Resolved || conversation.status === 'Resolved'
                      ? 'text-green-400 bg-green-400/10'
                      : conversation.status === ConversationStatus.Open || conversation.status === 'Open' || conversation.status === 'Active'
                      ? 'text-yellow-400 bg-yellow-400/10'
                      : 'text-red-400 bg-red-400/10'
                  )}
                >
                  {getStatusLabel(conversation.status as ConversationStatus)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </LuxuryCard>
  );
}

