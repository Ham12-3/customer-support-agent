'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  User,
  Bot,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Mail
} from 'lucide-react';
import { api } from '@/lib/api';
import LuxuryLayout from '@/components/LuxuryLayout';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

// Local interfaces matching API response
interface Message {
  id: string;
  role: string;
  content: string;
  confidenceScore?: number;
  createdAt: string;
}

interface Conversation {
  id: string;
  tenantId: string;
  domainId?: string;
  status: string;
  startedAt: string;
  endedAt?: string;
  customerEmail?: string;
  customerName?: string;
  messageCount: number;
  messages?: Message[];
  // Display fields
  domainUrl?: string;
  sessionId?: string;
  isEscalated?: boolean;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [escalatedFilter, setEscalatedFilter] = useState('');
  const { showToast } = useToast();

  const loadConversations = useCallback(async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (escalatedFilter) params.isEscalated = escalatedFilter === 'true';

      const data = await api.conversations.getAll(params);
      const mappedItems = (data.items || []).map((item: any) => ({
        ...item,
        status: item.status?.toString() || 'Open',
      }));
      setConversations(mappedItems);
    } catch (error) {
      showToast('error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, escalatedFilter, showToast]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadConversationDetails = async (id: string) => {
    try {
      const data = await api.conversations.getById(id);
      const mappedData: Conversation = {
        ...data,
        status: data.status?.toString() || 'Open',
      };
      setSelectedConversation(mappedData);
    } catch (error) {
      showToast('error', 'Failed to load conversation details');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'bg-green-500/10 text-green-400 border border-green-500/20',
      Open: 'bg-green-500/10 text-green-400 border border-green-500/20',
      InProgress: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
      Resolved: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      Closed: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
      Escalated: 'bg-red-500/10 text-red-400 border border-red-500/20',
      Pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.domainUrl?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <LuxuryLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Conversations
          </h1>
          <p className="text-gray-400 text-lg">
            View and manage customer conversations
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <LuxuryCard className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-medium text-gray-400 mb-2">
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
                      'bg-white/[0.03] border border-white/[0.05]',
                      'focus:border-primary-500/50 focus:bg-white/[0.05] focus:ring-0',
                      'text-white placeholder-gray-600',
                      'transition-all duration-200'
                    )}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={cn(
                    'w-full px-4 py-2 rounded-xl',
                    'bg-white/[0.03] border border-white/[0.05]',
                    'focus:border-primary-500/50 focus:bg-white/[0.05] focus:ring-0',
                    'text-white',
                    'transition-all duration-200'
                  )}
                >
                  <option value="" className="bg-gray-900">All Status</option>
                  <option value="Open" className="bg-gray-900">Open</option>
                  <option value="InProgress" className="bg-gray-900">In Progress</option>
                  <option value="Resolved" className="bg-gray-900">Resolved</option>
                  <option value="Closed" className="bg-gray-900">Closed</option>
                </select>
              </div>

              {/* Escalated Filter */}
              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Priority
                </label>
                <select
                  value={escalatedFilter}
                  onChange={(e) => setEscalatedFilter(e.target.value)}
                  className={cn(
                    'w-full px-4 py-2 rounded-xl',
                    'bg-white/[0.03] border border-white/[0.05]',
                    'focus:border-primary-500/50 focus:bg-white/[0.05] focus:ring-0',
                    'text-white',
                    'transition-all duration-200'
                  )}
                >
                  <option value="" className="bg-gray-900">All</option>
                  <option value="true" className="bg-gray-900">Escalated Only</option>
                  <option value="false" className="bg-gray-900">Normal</option>
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
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-sm font-medium text-gray-300"
              >
                Clear Filters
              </motion.button>
            </div>
          </LuxuryCard>
        </motion.div>

        {/* Conversations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              All Conversations ({filteredConversations.length})
            </h2>

            {filteredConversations.length === 0 ? (
              <LuxuryCard className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  No conversations found
                </p>
              </LuxuryCard>
            ) : (
              filteredConversations.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LuxuryCard
                    className={cn(
                      'p-4 transition-all cursor-pointer',
                      selectedConversation?.id === conv.id && 'border-primary-500/50 bg-primary-500/5'
                    )}
                    onClick={() => loadConversationDetails(conv.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-white truncate">
                          {conv.customerName || conv.customerEmail || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.domainUrl || 'No domain'}
                        </p>
                      </div>
                      {conv.isEscalated && (
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium flex items-center gap-1">
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
                      <span className="text-gray-500 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {conv.messageCount}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mt-2">
                      {new Date(conv.startedAt).toLocaleString()}
                    </p>
                  </LuxuryCard>
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
                <LuxuryCard className="p-6 h-[calc(100vh-300px)] flex flex-col">
                  {/* Header */}
                  <div className="border-b border-white/[0.05] pb-4 mb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-glow-sm">
                          {selectedConversation.customerName?.[0] || selectedConversation.customerEmail?.[0] || 'A'}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {selectedConversation.customerName || selectedConversation.customerEmail || 'Anonymous Customer'}
                          </h2>
                          {selectedConversation.customerEmail && (
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {selectedConversation.customerEmail}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Domain: {selectedConversation.domainUrl || 'N/A'}
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
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            Escalated
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Started: {new Date(selectedConversation.startedAt).toLocaleString()}</span>
                      </div>
                      {selectedConversation.endedAt && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Ended: {new Date(selectedConversation.endedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                      selectedConversation.messages.map((message, index) => (
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
                              'max-w-[80%] rounded-2xl p-4',
                              message.role === 'User' || message.role === 'Customer'
                                ? 'bg-primary-600 text-white shadow-glow-sm'
                                : 'bg-white/[0.05] border border-white/[0.05] text-white'
                            )}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {message.role === 'User' || message.role === 'Customer' ? (
                                <User className="w-4 h-4 text-white/70" />
                              ) : (
                                <Bot className="w-4 h-4 text-primary-400" />
                              )}
                              <span className="font-semibold text-sm text-white/90">{message.role}</span>
                              {message.confidenceScore && (
                                <span className={cn(
                                  'text-xs px-2 py-0.5 rounded-full',
                                  message.role === 'User' || message.role === 'Customer'
                                    ? 'bg-white/20'
                                    : 'bg-primary-500/20 text-primary-300'
                                )}>
                                  {(message.confidenceScore * 100).toFixed(0)}% confidence
                                </span>
                              )}
                            </div>
                            <p className="text-sm whitespace-pre-wrap leading-relaxed opacity-90">
                              {message.content}
                            </p>
                            <p className={cn(
                              'text-xs mt-2',
                              message.role === 'User' || message.role === 'Customer'
                                ? 'text-white/50'
                                : 'text-gray-500'
                            )}>
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 h-full flex flex-col items-center justify-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No messages in this conversation yet</p>
                      </div>
                    )}
                  </div>
                </LuxuryCard>
              </motion.div>
            ) : (
              <LuxuryCard className="p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/[0.05]">
                  <MessageSquare className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Conversation Selected
                </h3>
                <p className="text-gray-500">
                  Select a conversation from the list to view messages
                </p>
              </LuxuryCard>
            )}
          </div>
        </div>
      </div>
    </LuxuryLayout>
  );
}