'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LuxuryLayout from '@/components/LuxuryLayout';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Zap,
  Key,
  Mail,
  Lock,
  Smartphone,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { PageLoader } from '@/components/ui/LoadingSpinner';

type TabType = 'profile' | 'security' | 'notifications' | 'billing' | 'api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
    timezone: 'UTC-5',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    securityAlerts: true,
    newConversations: true,
    agentUpdates: false,
  });

  const [sessions, setSessions] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newApiKeyName, setNewApiKeyName] = useState('');

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'security' as TabType, label: 'Security', icon: Shield },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'billing' as TabType, label: 'Billing', icon: CreditCard },
    { id: 'api' as TabType, label: 'API Keys', icon: Key },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [profile, notifications, sessionsData, billingData, invoicesData, keysData] = await Promise.all([
        api.users.getProfile(),
        api.users.getNotifications(),
        api.users.getSessions(),
        api.billing.getSubscription(),
        api.billing.getInvoices(),
        api.apiKeys.getAll(),
      ]);

      setProfileData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        company: profile.company || '',
        role: profile.role || '',
        timezone: profile.timezone || 'UTC-5',
      });

      setNotificationSettings(notifications);
      setSessions(sessionsData);
      setSubscription(billingData);
      setInvoices(invoicesData);
      setApiKeys(keysData);
    } catch (error) {
      console.error('Error loading settings:', error);
      setErrorMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      if (activeTab === 'profile') {
        await api.users.updateProfile(profileData);
      } else if (activeTab === 'security' && passwordData.currentPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setErrorMessage('Passwords do not match');
          setIsSaving(false);
          return;
        }
        await api.users.changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else if (activeTab === 'notifications') {
        await api.users.updateNotifications(notificationSettings);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newApiKeyName.trim()) return;

    try {
      const newKey = await api.apiKeys.create({ name: newApiKeyName });
      setApiKeys([...apiKeys, newKey]);
      setNewApiKeyName('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrorMessage('Failed to create API key');
    }
  };

  const handleRevokeApiKey = async (id: string) => {
    try {
      await api.apiKeys.revoke(id);
      setApiKeys(apiKeys.filter(k => k.id !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrorMessage('Failed to revoke API key');
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await api.users.revokeSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrorMessage('Failed to revoke session');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <LuxuryLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Manage your account settings and preferences
          </motion.p>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-8 z-50 flex items-center gap-3 bg-green-500/10 border border-green-500/20 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-glow-md"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Settings saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LuxuryCard className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                        isActive
                          ? 'bg-primary-500/10 text-primary-400 shadow-glow-sm'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </LuxuryCard>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <LuxuryCard className="p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Profile Information</h2>
                    <p className="text-gray-400">Update your personal details and preferences</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                        AJ
                      </div>
                      <button className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                        Change
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{profileData.fullName}</h3>
                      <p className="text-gray-400">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, fullName: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) =>
                          setProfileData({ ...profileData, company: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={profileData.role}
                        onChange={(e) =>
                          setProfileData({ ...profileData, role: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, timezone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      >
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC-6">Central Time (UTC-6)</option>
                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC+0">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Security Settings</h2>
                    <p className="text-gray-400">Manage your password and security preferences</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all pr-12"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/[0.05] pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Smartphone className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Authenticator App</p>
                          <p className="text-sm text-gray-400">Enabled</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-lg text-white text-sm font-medium transition-all">
                        Manage
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.05] pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      {[
                        { device: 'Chrome on Windows', location: 'New York, US', current: true },
                        { device: 'Safari on iPhone', location: 'New York, US', current: false },
                      ].map((session, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]"
                        >
                          <div>
                            <p className="text-white font-medium flex items-center gap-2">
                              {session.device}
                              {session.current && (
                                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-400">{session.location}</p>
                          </div>
                          {!session.current && (
                            <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
                    <p className="text-gray-400">Choose how you want to be notified</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: 'emailNotifications',
                        label: 'Email Notifications',
                        description: 'Receive notifications via email',
                        icon: Mail,
                      },
                      {
                        key: 'pushNotifications',
                        label: 'Push Notifications',
                        description: 'Receive push notifications in your browser',
                        icon: Bell,
                      },
                      {
                        key: 'weeklyReports',
                        label: 'Weekly Reports',
                        description: 'Get a summary of your activity every week',
                        icon: Globe,
                      },
                      {
                        key: 'securityAlerts',
                        label: 'Security Alerts',
                        description: 'Important security updates and alerts',
                        icon: Shield,
                      },
                      {
                        key: 'newConversations',
                        label: 'New Conversations',
                        description: 'Notify when new conversations are started',
                        icon: MessageSquare,
                      },
                      {
                        key: 'agentUpdates',
                        label: 'Agent Updates',
                        description: 'Updates about your AI agents',
                        icon: Zap,
                      },
                    ].map((setting) => {
                      const Icon = setting.icon;
                      return (
                        <div
                          key={setting.key}
                          className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:bg-white/[0.03] transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary-500/10 rounded-lg">
                              <Icon className="w-5 h-5 text-primary-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{setting.label}</p>
                              <p className="text-sm text-gray-400">{setting.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setNotificationSettings({
                                ...notificationSettings,
                                [setting.key]: !notificationSettings[
                                  setting.key as keyof typeof notificationSettings
                                ],
                              })
                            }
                            className={cn(
                              'relative w-12 h-6 rounded-full transition-all duration-300',
                              notificationSettings[
                                setting.key as keyof typeof notificationSettings
                              ]
                                ? 'bg-primary-500'
                                : 'bg-white/[0.1]'
                            )}
                          >
                            <motion.div
                              layout
                              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                              animate={{
                                x: notificationSettings[
                                  setting.key as keyof typeof notificationSettings
                                ]
                                  ? 24
                                  : 0,
                              }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
                    <p className="text-gray-400">Manage your subscription and payment methods</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">Professional Plan</h3>
                        <p className="text-gray-400">Billed monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-white">$299</p>
                        <p className="text-sm text-gray-400">/month</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all shadow-glow-sm">
                        Upgrade Plan
                      </button>
                      <button className="px-6 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] text-white rounded-xl font-medium transition-all">
                        Cancel Subscription
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/[0.05] rounded-lg">
                            <CreditCard className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-400">Expires 12/25</p>
                          </div>
                        </div>
                        <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-medium">
                          Default
                        </span>
                      </div>
                    </div>
                    <button className="mt-4 px-6 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] text-white rounded-xl font-medium transition-all">
                      Add Payment Method
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
                    <div className="space-y-2">
                      {[
                        { date: 'Jan 1, 2025', amount: '$299.00', status: 'Paid' },
                        { date: 'Dec 1, 2024', amount: '$299.00', status: 'Paid' },
                        { date: 'Nov 1, 2024', amount: '$299.00', status: 'Paid' },
                      ].map((invoice, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:bg-white/[0.03] transition-all"
                        >
                          <div>
                            <p className="text-white font-medium">{invoice.date}</p>
                            <p className="text-sm text-gray-400">{invoice.amount}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-medium">
                              {invoice.status}
                            </span>
                            <button className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* API Keys Tab */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">API Keys</h2>
                    <p className="text-gray-400">Manage your API keys for integrations</p>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium">Keep your API keys secure</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Never share your API keys publicly or commit them to version control
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Production API Key', created: 'Jan 15, 2025', lastUsed: '2 hours ago' },
                      { name: 'Development API Key', created: 'Dec 10, 2024', lastUsed: '1 day ago' },
                    ].map((key, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-white font-medium">{key.name}</p>
                            <p className="text-sm text-gray-400">Created {key.created}</p>
                          </div>
                          <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                            Revoke
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-2 bg-black/30 rounded-lg text-primary-400 font-mono text-sm">
                            sk_live_••••••••••••••••••••••••••••
                          </code>
                          <button className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-lg text-white text-sm font-medium transition-all">
                            Copy
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Last used {key.lastUsed}</p>
                      </div>
                    ))}
                  </div>

                  <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all shadow-glow-sm flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Generate New API Key
                  </button>
                </div>
              )}

              {/* Save Button */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/[0.05] mt-8">
                <button className="px-6 py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] text-white rounded-xl font-medium transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white rounded-xl font-medium transition-all shadow-glow-sm flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </LuxuryCard>
          </motion.div>
        </div>
      </div>
    </LuxuryLayout>
  );
}
