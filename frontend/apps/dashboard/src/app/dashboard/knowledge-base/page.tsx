'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Globe,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Link2
} from 'lucide-react';
import { api } from '@/lib/api';
import LuxuryLayout from '@/components/LuxuryLayout';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { LoadingSpinner, PageLoader } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  sourceUrl?: string;
  fileType?: string;
  fileSizeBytes?: number;
  status: string;
  chunkCount: number;
  createdAt: string;
  processedAt?: string;
  errorMessage?: string;
}

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await api.documents.getAll();
      setDocuments(data.items || []);
    } catch (error) {
      showToast('error', 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name);
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      showToast('warning', 'Title required', 'Please enter a document title');
      return;
    }

    if (uploadMode === 'file' && !selectedFile) {
      showToast('warning', 'File required', 'Please select a file to upload');
      return;
    }

    if (uploadMode === 'url' && !sourceUrl.trim()) {
      showToast('warning', 'URL required', 'Please enter a valid URL');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);

      if (uploadMode === 'file' && selectedFile) {
        formData.append('file', selectedFile);
      } else if (uploadMode === 'url') {
        formData.append('sourceUrl', sourceUrl);
      }

      await api.documents.upload(formData);

      // Reset form
      setTitle('');
      setSourceUrl('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      await loadDocuments();
      showToast('success', 'Document uploaded!', 'Processing will begin shortly');
    } catch (error) {
      showToast('error', 'Upload failed', 'Please try again');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      await api.documents.delete(id);
      await loadDocuments();
      showToast('success', 'Document deleted', `"${title}" has been removed`);
    } catch (error) {
      showToast('error', 'Delete failed', 'Please try again');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'Active':
      case 'Completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'Active':
      case 'Completed':
        return 'bg-green-500/10 border-green-500/20';
      case 'Failed':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
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
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Knowledge Base
          </h1>
          <p className="text-gray-400 text-lg">
            Upload documents to train your AI assistant
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <LuxuryCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl shadow-glow-sm">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Upload New Document
                </h2>
                <p className="text-sm text-gray-400">
                  Supported: PDF, DOCX, TXT, or web URLs
                </p>
              </div>
            </div>

            {/* Upload Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setUploadMode('file')}
                className={cn(
                  'flex-1 py-3 px-4 rounded-xl font-medium transition-all',
                  'flex items-center justify-center gap-2',
                  uploadMode === 'file'
                    ? 'bg-primary-600 text-white shadow-glow-sm'
                    : 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.05]'
                )}
              >
                <FileText className="w-5 h-5" />
                Upload File
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setUploadMode('url')}
                className={cn(
                  'flex-1 py-3 px-4 rounded-xl font-medium transition-all',
                  'flex items-center justify-center gap-2',
                  uploadMode === 'url'
                    ? 'bg-primary-600 text-white shadow-glow-sm'
                    : 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.05]'
                )}
              >
                <Link2 className="w-5 h-5" />
                Import URL
              </motion.button>
            </div>

            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Product Manual, FAQ Guide"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-white/[0.03] border border-white/[0.05]',
                    'focus:border-primary-500/50 focus:bg-white/[0.05] focus:ring-0',
                    'text-white placeholder-gray-600',
                    'transition-all duration-200'
                  )}
                />
              </div>

              {/* File/URL Input */}
              <AnimatePresence mode="wait">
                {uploadMode === 'file' ? (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Upload File
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        accept=".pdf,.docx,.txt,.doc"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className={cn(
                          'flex-1 py-3 px-4 rounded-xl cursor-pointer transition-all',
                          'border-2 border-dashed',
                          selectedFile
                            ? 'border-green-500/50 bg-green-500/5'
                            : 'border-white/[0.1] bg-white/[0.02] hover:border-primary-500/50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {selectedFile ? (
                            <>
                              <FileCheck className="w-5 h-5 text-green-400" />
                              <div className="flex-1">
                                <p className="font-medium text-white">
                                  {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {formatFileSize(selectedFile.size)}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-gray-500" />
                              <span className="text-gray-400">
                                Click to choose file
                              </span>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Web URL
                    </label>
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://example.com/documentation"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl',
                        'bg-white/[0.03] border border-white/[0.05]',
                        'focus:border-primary-500/50 focus:bg-white/[0.05] focus:ring-0',
                        'text-white placeholder-gray-600',
                        'transition-all duration-200'
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={uploading}
                className={cn(
                  'w-full py-3 px-6 rounded-xl font-medium',
                  'bg-gradient-to-r from-primary-600 to-purple-600',
                  'hover:from-primary-500 hover:to-purple-500',
                  'text-white shadow-glow-sm',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2'
                )}
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Document
                  </>
                )}
              </motion.button>
            </div>
          </LuxuryCard>
        </motion.div>

        {/* Documents List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-500" />
            Your Documents ({documents.length})
          </h2>

          {documents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <LuxuryCard className="p-12 text-center">
                <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/[0.05]">
                  <FileText className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No documents yet
                </h3>
                <p className="text-gray-400">
                  Upload your first document to train your AI! 📚
                </p>
              </LuxuryCard>
            </motion.div>
          ) : (
            documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <LuxuryCard className="p-6 group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={cn(
                        'p-3 rounded-xl shadow-lg border transition-colors',
                        getStatusColor(doc.status)
                      )}>
                        {getStatusIcon(doc.status)}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {doc.title}
                        </h3>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-400">
                          <div>
                            <span className="font-medium text-gray-500">Type:</span>{' '}
                            {doc.fileType?.toUpperCase() || 'Unknown'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Size:</span>{' '}
                            {formatFileSize(doc.fileSizeBytes)}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Chunks:</span>{' '}
                            {doc.chunkCount}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Uploaded:</span>{' '}
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {doc.sourceUrl && (
                          <div className="mt-2">
                            <a
                              href={doc.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-400 hover:text-primary-300 hover:underline flex items-center gap-1"
                            >
                              <Globe className="w-3 h-3" />
                              {doc.sourceUrl}
                            </a>
                          </div>
                        )}

                        {doc.errorMessage && (
                          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                            <strong>Error:</strong> {doc.errorMessage}
                          </div>
                        )}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(doc.id, doc.title)}
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
                </LuxuryCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </LuxuryLayout>
  );
}