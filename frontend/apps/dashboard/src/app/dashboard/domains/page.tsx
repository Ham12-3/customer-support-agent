'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink,
  Shield,
  Code2,
  Zap
} from 'lucide-react';
import { api } from '@/lib/api';
import GlassmorphismLayout from '@/components/GlassmorphismLayout';
import { ModernCard } from '@/components/ui/ModernCard';
import { LoadingSpinner, PageLoader } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
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

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingDomain, setAddingDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [embedScript, setEmbedScript] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

  const handleGetEmbedCode = async (domain: Domain) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${domain.id}/script`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      setEmbedScript(data.script);
      setSelectedDomain(domain);
    } catch (error) {
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
    <GlassmorphismLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Domains
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Connect your websites and generate embed scripts
          </p>
        </motion.div>

        {/* Add Domain Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Domain
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  'bg-gray-50 dark:bg-gray-900/50',
                  'border-2 border-gray-200 dark:border-gray-700',
                  'focus:border-primary-500 dark:focus:border-primary-400',
                  'focus:ring-2 focus:ring-primary-500/20',
                  'transition-all duration-200',
                  'placeholder:text-gray-500'
                )}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddDomain}
                disabled={addingDomain || !newDomain.trim()}
                className={cn(
                  'px-6 py-3 rounded-xl font-medium',
                  'bg-gradient-to-r from-primary-500 to-primary-600',
                  'hover:from-primary-600 hover:to-primary-700',
                  'text-white shadow-soft hover:shadow-medium',
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
          </ModernCard>
        </motion.div>

        {/* Domains List */}
        <div className="space-y-4">
          {domains.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ModernCard variant="soft" className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No domains yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add your first domain above to get started! 🚀
                </p>
              </ModernCard>
            </motion.div>
          ) : (
            domains.map((domain, index) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <ModernCard 
                  variant="glass" 
                  hover={true}
                  className="p-6 group"
                >
                  <div className="flex items-start justify-between">
                    {/* Domain Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {domain.domainUrl}
                          </h3>
                          <span
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                              domain.isVerified || domain.status === 'Active'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            )}
                          >
                            <Shield className="w-3 h-3" />
                            {domain.isVerified || domain.status === 'Active' ? 'Verified' : 'Pending'}
                          </span>
                        </div>

                        {/* API Key */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                              API Key:
                            </span>
                            <code className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-lg text-xs font-mono">
                              {domain.apiKey}
                            </code>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(domain.apiKey, `key-${domain.id}`)}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                              {copiedId === `key-${domain.id}` ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                              )}
                            </motion.button>
                          </div>

                          <p className="text-gray-500 dark:text-gray-500 text-xs flex items-center gap-1">
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
                          'bg-primary-500 hover:bg-primary-600',
                          'text-white shadow-soft hover:shadow-medium',
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
                          'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30',
                          'text-red-600 dark:text-red-400',
                          'transition-colors'
                        )}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </ModernCard>
              </motion.div>
            ))
          )}
        </div>

        {/* Embed Code Modal */}
        <Modal
          isOpen={!!embedScript}
          onClose={() => {
            setEmbedScript('');
            setSelectedDomain(null);
          }}
          title="Embed Code"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Copy this code and paste it before the closing <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">&lt;/body&gt;</code> tag on{' '}
              <strong>{selectedDomain?.domainUrl}</strong>
            </p>

            <div className="relative">
              <pre className="p-4 bg-gray-900 dark:bg-gray-950 rounded-xl overflow-x-auto text-sm text-green-400 font-mono">
                {embedScript}
              </pre>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(embedScript, 'embed')}
                className={cn(
                  'absolute top-2 right-2 px-3 py-2 rounded-lg',
                  'bg-gray-800 hover:bg-gray-700',
                  'text-white text-sm font-medium',
                  'flex items-center gap-2'
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

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Pro Tip:</strong> The widget will automatically appear on all pages where you paste this code!
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </GlassmorphismLayout>
  );
}