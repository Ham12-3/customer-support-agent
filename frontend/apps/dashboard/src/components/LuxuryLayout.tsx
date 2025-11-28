'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LuxurySidebar from './LuxurySidebar';
import { Bell, Search, Menu, Settings, LogOut, User, Shield, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LuxuryLayoutProps {
  children: React.ReactNode;
}

export default function LuxuryLayout({ children }: LuxuryLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-primary-500/30 selection:text-primary-200 overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] opacity-30 animate-float" />
        <div className="absolute inset-0 bg-noise z-10 opacity-[0.03]" />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <LuxurySidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Top Navigation Bar */}
          <header className="h-16 px-6 border-b border-white/[0.05] flex items-center justify-between bg-[#050507]/80 backdrop-blur-xl z-30 sticky top-0">
            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Breadcrumb / Page Title Area */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
              <span className="text-sm font-medium text-gray-400 tracking-wide">SYSTEM OPERATIONAL</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="hidden md:flex relative group">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-white/[0.03] border border-white/[0.05] rounded-full px-4 py-1.5 focus-within:border-primary-500/50 focus-within:bg-white/[0.05] transition-all w-64">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search ecosystem..." 
                    className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder-gray-600 w-full p-0"
                  />
                  <div className="text-[10px] font-mono text-gray-600 border border-gray-800 rounded px-1.5 py-0.5">⌘K</div>
                </div>
              </div>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={toggleNotifications}
                  className={cn(
                    "relative p-2 text-gray-400 hover:text-white transition-all rounded-full hover:bg-white/[0.05]",
                    showNotifications && "bg-white/[0.05] text-white"
                  )}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] border border-[#050507]" />
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-80 bg-[#0A0A0E]/90 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-white/[0.05] flex justify-between items-center">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <span className="text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full">3 New</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer group">
                            <div className="flex gap-3">
                              <div className="h-2 w-2 mt-2 rounded-full bg-primary-500 shrink-0" />
                              <div>
                                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">New conversation started on <span className="font-medium text-primary-400">example.com</span></p>
                                <p className="text-xs text-gray-500 mt-1">2 mins ago</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center border-t border-white/[0.05]">
                        <button className="text-xs text-gray-400 hover:text-white transition-colors">Mark all as read</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div className={cn(
                    "h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 p-[1px] transition-transform duration-300",
                    showProfileMenu && "scale-110 shadow-glow-sm"
                  )}>
                    <div className="h-full w-full rounded-full bg-[#0A0A0E] flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-64 bg-[#0A0A0E]/90 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-white/[0.05] bg-white/[0.02]">
                        <p className="font-medium text-white">Alex Johnson</p>
                        <p className="text-xs text-gray-500">alex@nexus.ai</p>
                      </div>
                      
                      <div className="p-2 space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors">
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors">
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors">
                          <CreditCard className="w-4 h-4" />
                          Billing
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors">
                          <Shield className="w-4 h-4" />
                          Security
                        </button>
                      </div>

                      <div className="p-2 border-t border-white/[0.05]">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Content Scroll Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 scroll-smooth relative z-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}