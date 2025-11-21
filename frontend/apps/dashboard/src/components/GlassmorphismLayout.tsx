'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bell, Search, Moon, Sun, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ModernSidebar } from './ModernSidebar';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

interface GlassmorphismLayoutProps {
  children: ReactNode;
}

export default function GlassmorphismLayout({ children }: GlassmorphismLayoutProps) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { theme, setTheme, actualTheme } = useTheme();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-300',
      darkMode ? 'dark bg-gray-950' : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20'
    )}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-medium'
            : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg'
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Customer Support AI
                </h1>
              </motion.div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className={cn(
                    'w-full pl-10 pr-4 py-2 rounded-xl',
                    'bg-gray-100/50 dark:bg-gray-800/50',
                    'border border-gray-200/50 dark:border-gray-700/50',
                    'focus:border-primary-500 dark:focus:border-primary-400',
                    'focus:ring-2 focus:ring-primary-500/20',
                    'transition-all duration-200',
                    'placeholder:text-gray-500 dark:placeholder:text-gray-400'
                  )}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
  className={cn(
    'p-2 rounded-xl transition-colors',
    'bg-gray-100 dark:bg-gray-800',
    'hover:bg-gray-200 dark:hover:bg-gray-700'
  )}
>
  {actualTheme === 'dark' ? (
    <Sun className="w-5 h-5 text-yellow-500" />
  ) : (
    <Moon className="w-5 h-5 text-gray-700" />
  )}
</motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative p-2 rounded-xl transition-colors',
                  'bg-gray-100 dark:bg-gray-800',
                  'hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </motion.button>

              {/* User Menu */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role}
                  </p>
                </div>
              </motion.div>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium rounded-xl shadow-soft hover:shadow-medium transition-all duration-200"
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Layout */}
      <div className="flex relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ModernSidebar />
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-40 lg:hidden"
          >
            <ModernSidebar />
          </motion.div>
        )}

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}