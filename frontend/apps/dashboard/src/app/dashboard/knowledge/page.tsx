'use client';

import React, { useState, useEffect } from 'react';
import { Upload, File, Trash2, ExternalLink, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Knowledge Base page with domain-specific document management
export default function KnowledgeBasePage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload form state
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');

  // Load domains on component mount
  useEffect(() => {
    loadDomains();
  }, []);

  // Load documents when domain selection changes
  useEffect(() => {
    if (selectedDomainId) {
      loadDocuments(selectedDomainId);
    } else {
      setDocuments([]);
    }
  }, [selectedDomainId]);

  const loadDomains = async () => {
    try {
      const response = await api.domains.getAll();
      const domainList = response.items || response.Items || response;
      setDomains(Array.isArray(domainList) ? domainList : []);
      
      // Auto-select first domain if available
      if (domainList.length > 0 && !selectedDomainId) {
        setSelectedDomainId(domainList[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load domains:', error);
      setLoading(false);
    }
  };

  const loadDocuments = async (domainId: string) => {
    setLoading(true);
    try {
      const response = await api.documents.getAll({ domainId });
      const documentList = response.items || response.Items || response;
      setDocuments(Array.isArray(documentList) ? documentList : []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDomainId) {
      alert('Please select a domain first');
      return;
    }

    if (!title) {
      alert('Please enter a document title');
      return;
    }

    if (uploadMode === 'file' && !file) {
      alert('Please select a file to upload');
      return;
    }

    if (uploadMode === 'url' && !url) {
      alert('Please enter a URL');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('domainId', selectedDomainId);
      
      if (uploadMode === 'file' && file) {
        formData.append('file', file);
      } else if (uploadMode === 'url') {
        formData.append('sourceUrl', url);
      }

      await api.documents.upload(formData);
      
      // Reset form
      setTitle('');
      setFile(null);
      setUrl('');
      
      // Reload documents
      await loadDocuments(selectedDomainId);
      
      alert('Document uploaded successfully!');
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.documents.delete(documentId);
      await loadDocuments(selectedDomainId);
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document');
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
      case 'queued':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="text-gray-600 mt-2">
          Upload and manage documents for your AI agents. Each document is linked to a specific domain.
        </p>
      </div>

      {/* Domain Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Select Domain</h2>
        {loading && domains.length === 0 ? (
          <p className="text-gray-500">Loading domains...</p>
        ) : domains.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No domains found. Please create a domain first.</p>
            <Button
              onClick={() => window.location.href = '/dashboard/domains'}
              className="mt-4"
            >
              Go to Domains
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedDomainId === domain.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{domain.domainUrl}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {domain.isVerified ? '✓ Verified' : 'Pending'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upload Section */}
      {selectedDomainId && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
          
          {/* Upload Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={uploadMode === 'file' ? 'primary' : 'secondary'}
              onClick={() => setUploadMode('file')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant={uploadMode === 'url' ? 'primary' : 'secondary'}
              onClick={() => setUploadMode('url')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Add URL
            </Button>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <Input
              label="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Product Documentation, FAQ, Pricing Guide"
              required
            />

            {uploadMode === 'file' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.txt,.md"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supported: PDF, DOC, DOCX, TXT, MD
                </p>
              </div>
            ) : (
              <Input
                label="Document URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/documentation"
                type="url"
                required
              />
            )}

            <Button
              type="submit"
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </form>
        </div>
      )}

      {/* Documents List */}
      {selectedDomainId && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Documents</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading documents...</p>
          ) : filteredDocuments.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              {searchQuery ? 'No documents match your search' : 'No documents uploaded yet'}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <File className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{doc.fileType?.toUpperCase() || 'N/A'}</span>
                        <span>{formatFileSize(doc.fileSizeBytes)}</span>
                        <span>{doc.chunkCount} chunks</span>
                        {doc.sourceUrl && (
                          <a
                            href={doc.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Source
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                      {doc.errorMessage && (
                        <p className="text-xs text-red-500 mt-1">
                          Error: {doc.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm text-gray-600 capitalize">
                        {doc.status}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

