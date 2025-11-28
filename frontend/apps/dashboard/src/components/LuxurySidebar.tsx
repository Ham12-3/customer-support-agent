'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  Globe,
  FileText,
  Settings,
  Zap,
  LogOut,
  X,
  ChevronUp,
  ChevronDown,
  Search,
  Star,
  Bell,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface LuxurySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  favorite?: boolean;
}

interface MenuSection {
  label: string;
  items: MenuItem[];
  collapsible?: boolean;
}

const menuSections: MenuSection[] = [
  {
    label: '',
    items: [
      { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
      { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
    ],
  },
  {
    label: 'Main',
    items: [
      { icon: Globe, label: 'Domains', href: '/dashboard/domains', favorite: true },
      { icon: MessageSquare, label: 'Conversations', href: '/dashboard/conversations' },
      { icon: FileText, label: 'Knowledge Base', href: '/dashboard/knowledge-base', favorite: true },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
    collapsible: false,
  },
];

export default function LuxurySidebar({ isOpen, onClose }: LuxurySidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['/dashboard/domains', '/dashboard/knowledge-base']));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Main']));
  const [hoveredFavorite, setHoveredFavorite] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleFavorite = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(href)) {
        newFavs.delete(href);
      } else {
        newFavs.add(href);
      }
      return newFavs;
    });
  };

  const toggleSection = (sectionLabel: string) => {
    if (!sectionLabel) return;
    setExpandedSections(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(sectionLabel)) {
        newExpanded.delete(sectionLabel);
      } else {
        newExpanded.add(sectionLabel);
      }
      return newExpanded;
    });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? 80 : 280;

  // Filter items based on search
  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  // Get starred items
  const starredItems = filteredSections
    .flatMap(section => section.items)
    .filter(item => favorites.has(item.href));

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? 280 : sidebarWidth,
          x: isMobile && !isOpen ? -280 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 h-screen",
          "bg-gray-900 border-r border-gray-800",
          "flex flex-col shadow-lg",
          isMobile && "shadow-2xl"
        )}
      >
        {/* Header / Logo */}
        <div className={cn(
          "flex items-center p-4 border-b border-gray-800",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 shadow-md">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h1 className="text-lg font-semibold tracking-tight text-white">
                    Nexus<span className="text-primary-400">AI</span>
                  </h1>
                  <p className="text-xs text-gray-400">
                    Foundation
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapse Toggle */}
          <div className="hidden lg:flex flex-col gap-1">
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-300"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            {isCollapsed && (
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-300"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Close Button */}
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border-b border-gray-800"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-16 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-500 border border-gray-600 rounded px-1.5 py-0.5">
                  ⌘ K
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Starred Items Section */}
          {starredItems.length > 0 && !isCollapsed && (
            <div className="p-2 space-y-1">
              {starredItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => isMobile && onClose()}>
                    <div
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg transition-colors group",
                        isActive
                          ? "bg-primary-900/30 text-primary-400"
                          : "text-gray-300 hover:bg-gray-800"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <Star 
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        onMouseEnter={() => setHoveredFavorite(item.href)}
                        onMouseLeave={() => setHoveredFavorite(null)}
                        onClick={(e) => toggleFavorite(item.href, e)}
                      />
                      {hoveredFavorite === item.href && (
                        <div className="absolute right-0 mr-12 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                          Remove from Favourites
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Menu Sections */}
          <div className="p-2 space-y-1">
            {filteredSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section Header */}
                {section.label && !isCollapsed && (
                  <button
                    onClick={() => toggleSection(section.label)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
                  >
                    <span>{section.label}</span>
                    {section.collapsible !== false && (
                      expandedSections.has(section.label) ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    )}
                  </button>
                )}

                {/* Section Items */}
                <AnimatePresence>
                  {(!section.label || expandedSections.has(section.label) || isCollapsed) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1"
                    >
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        const isFavorite = favorites.has(item.href);
                        const Icon = item.icon;
                        
                        return (
                          <Link key={item.href} href={item.href} onClick={() => isMobile && onClose()}>
                            <div className="relative group">
                              <div
                                className={cn(
                                  "flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                                  isActive
                                    ? "bg-primary-900/30 text-primary-400"
                                    : "text-gray-300 hover:bg-gray-800"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className="w-4 h-4" />
                                  <AnimatePresence>
                                    {!isCollapsed && (
                                      <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="text-sm font-medium whitespace-nowrap"
                                      >
                                        {item.label}
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {/* Favorite Star */}
                                {!isCollapsed && (
                                  <button
                                    onClick={(e) => toggleFavorite(item.href, e)}
                                    onMouseEnter={() => setHoveredFavorite(item.href)}
                                    onMouseLeave={() => setHoveredFavorite(null)}
                                    className="p-1 rounded hover:bg-gray-800 transition-colors"
                                  >
                                    <Star
                                      className={cn(
                                        "w-4 h-4 transition-colors",
                                        isFavorite
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-600 hover:text-yellow-400"
                                      )}
                                    />
                                    {/* Tooltip */}
                                    {hoveredFavorite === item.href && (
                                      <div className="absolute right-0 mr-12 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                                        {isFavorite ? 'Remove from Favourites' : 'Mark as Favourite'}
                                      </div>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className={cn(
          "p-4 border-t border-gray-800",
          isCollapsed ? "flex justify-center" : "space-y-2"
        )}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <button className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white mx-auto">
              {user?.firstName?.[0] || 'U'}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
