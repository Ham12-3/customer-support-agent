'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Shield,
  Code2,
  Zap,
  Sparkles
} from 'lucide-react';
import { api } from '@/lib/api';
import LuxuryLayout from '@/components/LuxuryLayout';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { LoadingSpinner, PageLoader } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { CreateAgentWizard, AgentConfig } from '@/components/CreateAgentWizard';
import { cn } from '@/lib/utils';

interface Domain {
  id: string;
  domainUrl: string;
  apiKey: string;
  verificationCode: string;
  isVerified: boolean;
  status: string;
  createdAt: string;
}

interface EmbedScripts {
  htmlScript: string;
  reactScript: string;
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingDomain, setAddingDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [embedScripts, setEmbedScripts] = useState<EmbedScripts | null>(null);
  const [embedTab, setEmbedTab] = useState<'html' | 'react'>('html');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAgentWizard, setShowAgentWizard] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      const data = await api.domains.getAll();
      setDomains(data.items || []);
    } catch (error) {
      showToast('error', 'Failed to load domains', 'Please try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      showToast('warning', 'Domain required', 'Please enter a valid domain');
      return;
    }

    setAddingDomain(true);
    try {
      await api.domains.create({ domainUrl: newDomain });
      setNewDomain('');
      await loadDomains();
      showToast('success', 'Domain added!', `${newDomain} has been connected`);
    } catch (error) {
      showToast('error', 'Failed to add domain', 'Please check the domain and try again');
    } finally {
      setAddingDomain(false);
    }
  };

  const handleCreateAgent = async (config: AgentConfig) => {
    try {
      await api.domains.createAgent(config);
      await loadDomains();
      showToast('success', 'Agent created!', `Your AI agent for ${config.companyName} is ready`);
    } catch (error) {
      showToast('error', 'Failed to create agent', 'Please try again');
      throw error;
    }
  };

  const handleGetEmbedCode = async (domain: Domain) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/domains/${domain.id}/script`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setEmbedScripts({
        htmlScript: data.htmlScript || data.script,
        reactScript: data.reactScript || '',
      });
      setEmbedTab('html');
      setSelectedDomain(domain);
    } catch (error) {
      console.error('Embed code error:', error);
      showToast('error', 'Failed to get embed code', 'Please try again');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('success', 'Copied!', 'Text copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, domainUrl: string) => {
    if (!confirm(`Delete ${domainUrl}? This action cannot be undone.`)) return;

    try {
      await api.domains.delete(id);
      await loadDomains();
      showToast('success', 'Domain deleted', `${domainUrl} has been removed`);
    } catch (error) {
      showToast('error', 'Failed to delete', 'Please try again');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <LuxuryLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              AI Agents
            </h1>
            <p className="text-gray-400 text-lg">
              Create intelligent agents trained on your business
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAgentWizard(true)}
            className={cn(
              'px-6 py-3 rounded-xl font-semibold',
              'bg-gradient-to-r from-primary-600 to-purple-600',
              'text-white shadow-glow-sm',
              'hover:shadow-glow-md transition-all duration-300',
              'flex items-center gap-2'
            )}
          >
            <Sparkles className="w-5 h-5" />
            Create AI Agent
          </motion.button>
        </motion.div>

        {/* Add Domain Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <LuxuryCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl shadow-glow-sm">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Add New Domain
                </h2>
                <p className="text-sm text-gray-400">
                  Connect your website to start using the chat widget
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                placeholder="www.yourwebsite.com"
                className={cn(
                  'flex-1 px-4 py-3 rounded-xl',
                  'bg-white/[0.03] border border-white/[0.05]',
                  'focus:border-primary-500/50 focus:bg-white/[0.05] focus:ring-0',
                  'text-white placeholder-gray-600',
                  'transition-all duration-200'
                )}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddDomain}
                disabled={addingDomain || !newDomain.trim()}
                className={cn(
                  'px-6 py-3 rounded-xl font-medium',
                  'bg-primary-600 hover:bg-primary-500',
                  'text-white shadow-glow-sm',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center gap-2'
                )}
              >
                {addingDomain ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Domain
                  </>
                )}
              </motion.button>
            </div>
          </LuxuryCard>
        </motion.div>

        {/* Domains List */}
        <div className="space-y-4">
          {domains.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <LuxuryCard className="p-12 text-center">
                <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/[0.05]">
                  <Globe className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No domains yet
                </h3>
                <p className="text-gray-400">
                  Add your first domain above to get started! 🚀
                </p>
              </LuxuryCard>
            </motion.div>
          ) : (
            domains.map((domain, index) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <LuxuryCard className="p-6 group">
                  <div className="flex items-start justify-between">
                    {/* Domain Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05] group-hover:border-primary-500/30 transition-colors">
                        <Globe className="w-6 h-6 text-primary-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {domain.domainUrl}
                          </h3>
                          <span
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                              domain.isVerified || domain.status === 'Active'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            )}
                          >
                            <Shield className="w-3 h-3" />
                            {domain.isVerified || domain.status === 'Active' ? 'Verified' : 'Pending'}
                          </span>
                        </div>

                        {/* API Key */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-medium">
                              API Key:
                            </span>
                            <code className="px-3 py-1 bg-black/40 rounded-lg text-xs font-mono text-gray-300 border border-white/[0.05]">
                              {domain.apiKey}
                            </code>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(domain.apiKey, `key-${domain.id}`)}
                              className="p-1.5 hover:bg-white/[0.1] rounded-lg transition"
                            >
                              {copiedId === `key-${domain.id}` ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                              )}
                            </motion.button>
                          </div>

                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Added on {new Date(domain.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGetEmbedCode(domain)}
                        className={cn(
                          'px-4 py-2 rounded-xl font-medium text-sm',
                          'bg-primary-600 hover:bg-primary-500',
                          'text-white shadow-glow-sm',
                          'transition-all duration-200',
                          'flex items-center gap-2'
                        )}
                      >
                        <Code2 className="w-4 h-4" />
                        Embed Code
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(domain.id, domain.domainUrl)}
                        className={cn(
                          'p-2 rounded-xl',
                          'bg-red-500/10 hover:bg-red-500/20 border border-red-500/10',
                          'text-red-400',
                          'transition-colors'
                        )}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </LuxuryCard>
              </motion.div>
            ))
          )}
        </div>

        {/* Embed Code Modal */}
        <Modal
          isOpen={!!embedScripts}
          onClose={() => {
            setEmbedScripts(null);
            setSelectedDomain(null);
          }}
          title="Embed Code"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-400">
              Copy this code and add it to{' '}
              <strong className="text-white">{selectedDomain?.domainUrl}</strong>
            </p>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <button
                onClick={() => setEmbedTab('html')}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  embedTab === 'html'
                    ? 'bg-primary-600 text-white shadow-glow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                HTML / Vanilla JS
              </button>
              <button
                onClick={() => setEmbedTab('react')}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  embedTab === 'react'
                    ? 'bg-primary-600 text-white shadow-glow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                React / Next.js
              </button>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="p-4 bg-white/[0.03] rounded-xl overflow-x-auto text-sm text-primary-300 font-mono border border-white/[0.05] backdrop-blur-sm max-h-80">
                <code className="block whitespace-pre-wrap break-words">
                  {embedTab === 'html' ? embedScripts?.htmlScript : embedScripts?.reactScript}
                </code>
              </pre>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(
                  embedTab === 'html' ? embedScripts?.htmlScript || '' : embedScripts?.reactScript || '',
                  'embed'
                )}
                className={cn(
                  'absolute top-3 right-3 px-4 py-2 rounded-lg',
                  'bg-primary-600 hover:bg-primary-500',
                  'text-white text-sm font-medium shadow-glow-sm',
                  'flex items-center gap-2 transition-all'
                )}
              >
                {copiedId === 'embed' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </motion.button>
            </div>

            {/* Instructions based on tab */}
            <div className="p-4 bg-primary-500/10 rounded-xl border border-primary-500/20 backdrop-blur-sm">
              {embedTab === 'html' ? (
                <div className="text-sm text-primary-300 space-y-2">
                  <p className="flex items-start gap-2">
                    <span>📄</span>
                    <span><strong className="text-primary-200">For HTML sites:</strong> Paste this code before the closing <code className="px-1 py-0.5 bg-black/30 rounded">&lt;/body&gt;</code> tag.</span>
                  </p>
                </div>
              ) : (
                <div className="text-sm text-primary-300 space-y-2">
                  <p className="flex items-start gap-2">
                    <span>⚛️</span>
                    <span><strong className="text-primary-200">For Next.js App Router:</strong> Add the <code className="px-1 py-0.5 bg-black/30 rounded">&lt;Script&gt;</code> component inside your <code className="px-1 py-0.5 bg-black/30 rounded">layout.js</code> or <code className="px-1 py-0.5 bg-black/30 rounded">layout.tsx</code> file, within the <code className="px-1 py-0.5 bg-black/30 rounded">&lt;body&gt;</code> tag.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span>📦</span>
                    <span><strong className="text-primary-200">Important:</strong> Make sure to import <code className="px-1 py-0.5 bg-black/30 rounded">Script</code> from <code className="px-1 py-0.5 bg-black/30 rounded">next/script</code> at the top of your file.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>

        {/* Create Agent Wizard */}
        <CreateAgentWizard
          isOpen={showAgentWizard}
          onClose={() => setShowAgentWizard(false)}
          onSubmit={handleCreateAgent}
        />
      </div>
    </LuxuryLayout>
  );
}