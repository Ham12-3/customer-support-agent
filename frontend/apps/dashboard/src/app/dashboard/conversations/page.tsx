'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Filter,
  User,
  Bot,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Calendar,
  TrendingUp,
  Mail
} from 'lucide-react';
import { api } from '@/lib/api';
import GlassmorphismLayout from '@/components/GlassmorphismLayout';
import { ModernCard } from '@/components/ui/ModernCard';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: string;
  content: string;
  confidenceScore?: number;
  isFromHuman: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  domainUrl: string;
  sessionId: string;
  customerEmail?: string;
  customerName?: string;
  status: string;
  isEscalated: boolean;
  messageCount: number;
  createdAt: string;
  endedAt?: string;
  messages?: Message[];
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [escalatedFilter, setEscalatedFilter] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadConversations();
  }, [statusFilter, escalatedFilter]);

  const loadConversations = async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (escalatedFilter) params.isEscalated = escalatedFilter === 'true';

      const data = await api.conversations.getAll(params);
      setConversations(data.items || []);
    } catch (error) {
      showToast('error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadConversationDetails = async (id: string) => {
    try {
      const data = await api.conversations.getById(id);
      setSelectedConversation(data);
    } catch (error) {
      showToast('error', 'Failed to load conversation details');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'from-green-500 to-emerald-500',
      Closed: 'from-gray-500 to-gray-600',
      Escalated: 'from-red-500 to-rose-500',
      Pending: 'from-yellow-500 to-orange-500',
    };
    return colors[status] || 'from-gray-500 to-gray-600';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Closed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      Escalated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.domainUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <GlassmorphismLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Conversations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            View and manage customer conversations
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ModernCard variant="glass" className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or domain..."
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-xl',
                      'bg-gray-50 dark:bg-gray-900/50',
                      'border-2 border-gray-200 dark:border-gray-700',
                      'focus:border-primary-500 dark:focus:border-primary-400',
                      'transition-all duration-200'
                    )}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={cn(
                    'w-full px-4 py-2 rounded-xl',
                    'bg-gray-50 dark:bg-gray-900/50',
                    'border-2 border-gray-200 dark:border-gray-700',
                    'focus:border-primary-500 dark:focus:border-primary-400',
                    'transition-all duration-200'
                  )}
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Escalated">Escalated</option>
                </select>
              </div>

              {/* Escalated Filter */}
              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={escalatedFilter}
                  onChange={(e) => setEscalatedFilter(e.target.value)}
                  className={cn(
                    'w-full px-4 py-2 rounded-xl',
                    'bg-gray-50 dark:bg-gray-900/50',
                    'border-2 border-gray-200 dark:border-gray-700',
                    'focus:border-primary-500 dark:focus:border-primary-400',
                    'transition-all duration-200'
                  )}
                >
                  <option value="">All</option>
                  <option value="true">Escalated Only</option>
                  <option value="false">Normal</option>
                </select>
              </div>

              {/* Clear Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setStatusFilter('');
                  setEscalatedFilter('');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Clear Filters
              </motion.button>
            </div>
          </ModernCard>
        </motion.div>

        {/* Conversations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              All Conversations ({filteredConversations.length})
            </h2>

            {filteredConversations.length === 0 ? (
              <ModernCard variant="soft" className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No conversations found
                </p>
              </ModernCard>
            ) : (
              filteredConversations.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ModernCard
                    variant={selectedConversation?.id === conv.id ? 'elevated' : 'glass'}
                    hover
                    className={cn(
                      'p-4 cursor-pointer transition-all',
                      selectedConversation?.id === conv.id && 'ring-2 ring-primary-500'
                    )}
                    onClick={() => loadConversationDetails(conv.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {conv.customerName || conv.customerEmail || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {conv.domainUrl}
                        </p>
                      </div>
                      {conv.isEscalated && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={cn(
                        'px-2 py-1 rounded-full font-medium',
                        getStatusBadgeColor(conv.status)
                      )}>
                        {conv.status}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {conv.messageCount}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(conv.createdAt).toLocaleString()}
                    </p>
                  </ModernCard>
                </motion.div>
              ))
            )}
          </div>

          {/* Conversation Details */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <ModernCard variant="glass" className="p-6">
                  {/* Header */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {selectedConversation.customerName?.[0] || 'A'}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedConversation.customerName || 'Anonymous Customer'}
                          </h2>
                          {selectedConversation.customerEmail && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {selectedConversation.customerEmail}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Domain: {selectedConversation.domainUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          getStatusBadgeColor(selectedConversation.status)
                        )}>
                          {selectedConversation.status}
                        </span>
                        {selectedConversation.isEscalated && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            Escalated
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Started: {new Date(selectedConversation.createdAt).toLocaleString()}</span>
                      </div>
                      {selectedConversation.endedAt && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Ended: {new Date(selectedConversation.endedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-4 max-h-[calc(100vh-500px)] overflow-y-auto pr-2">
                    {selectedConversation.messages?.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'flex',
                          message.role === 'User' || message.role === 'Customer'
                            ? 'justify-end'
                            : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[80%] rounded-2xl p-4 shadow-soft',
                            message.role === 'User' || message.role === 'Customer'
                              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {message.role === 'User' || message.role === 'Customer' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                            <span className="font-semibold text-sm">{message.role}</span>
                            {message.confidenceScore && (
                              <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                message.role === 'User' || message.role === 'Customer'
                                  ? 'bg-white/20'
                                  : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                              )}>
                                {(message.confidenceScore * 100).toFixed(0)}% confidence
                              </span>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                          <p className={cn(
                            'text-xs mt-2',
                            message.role === 'User' || message.role === 'Customer'
                              ? 'text-white/70'
                              : 'text-gray-500 dark:text-gray-400'
                          )}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ModernCard>
              </motion.div>
            ) : (
              <ModernCard variant="soft" className="p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-purple-200 dark:from-primary-800 dark:to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Conversation Selected
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a conversation from the list to view messages
                </p>
              </ModernCard>
            )}
          </div>
        </div>
      </div>
    </GlassmorphismLayout>
  );
}