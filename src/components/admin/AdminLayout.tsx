'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Mail,
  Server,
  Quote,
  Briefcase,
  Award,
  Code2,
  HelpCircle,
  Settings,
  BookOpen,
  Cpu,
  Link,
  User,
  Music,
  GitBranch,
  Radar,
  Clock,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Bell,
  Sparkles,
  Globe,
  Layers,
  Palette,
  Activity,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchCommand from '@/components/admin/SearchCommand';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Activity Log', href: '/admin/dashboard/activity', icon: Activity },
      { label: 'Form Submissions', href: '/admin/dashboard/contacts', icon: Mail },
    ],
  },
  {
    title: 'Content',
    icon: Layers,
    items: [
      { label: 'Projects', href: '/admin/dashboard/projects', icon: FolderKanban },
      { label: 'Articles', href: '/admin/dashboard/articles', icon: FileText },
      { label: 'Services', href: '/admin/dashboard/services', icon: Server },
      { label: 'Testimonials', href: '/admin/dashboard/testimonials', icon: Quote },
    ],
  },
  {
    title: 'Experience',
    icon: Briefcase,
    items: [
      { label: 'Work Experience', href: '/admin/dashboard/work-experience', icon: Briefcase },
      { label: 'Achievements', href: '/admin/dashboard/achievements', icon: Award },
      { label: 'Skills', href: '/admin/dashboard/skills', icon: Code2 },
      { label: 'Skills Radar', href: '/admin/dashboard/skills-radar', icon: Radar },
    ],
  },
  {
    title: 'Customization',
    icon: Palette,
    items: [
      { label: 'Hero Roles', href: '/admin/dashboard/hero-roles', icon: User },
      { label: 'Tech Stack', href: '/admin/dashboard/tech-stack', icon: Cpu },
      { label: 'Process Timeline', href: '/admin/dashboard/process-timeline', icon: GitBranch },
      { label: 'Now Playing', href: '/admin/dashboard/now-playing', icon: Music },
      { label: 'FAQ', href: '/admin/dashboard/faq', icon: HelpCircle },
    ],
  },
  {
    title: 'Connections',
    icon: Globe,
    items: [
      { label: 'Social Links', href: '/admin/dashboard/social-links', icon: Link },
      { label: 'Reading List', href: '/admin/dashboard/reading-list', icon: BookOpen },
      { label: 'Timezones', href: '/admin/dashboard/timezones', icon: Clock },
      { label: 'Newsletter Stats', href: '/admin/dashboard/newsletter-stats', icon: BarChart3 },
    ],
  },
  {
    title: 'System',
    icon: Settings,
    items: [
      { label: 'Profile', href: '/admin/dashboard/profile', icon: User },
      { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const sidebarRef = useRef<HTMLElement>(null);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Flatten all nav items for keyboard navigation
  const allNavItems = navSections.flatMap(s => s.items);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth && pathname !== '/admin') {
      router.replace('/admin');
    }
  }, [pathname, router]);

  // Keyboard navigation for sidebar
  const handleSidebarKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = Math.min(prev + 1, allNavItems.length - 1);
        navItemRefs.current[next]?.focus();
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = Math.max(prev - 1, 0);
        navItemRefs.current[next]?.focus();
        return next;
      });
    } else if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex < allNavItems.length) {
      e.preventDefault();
      router.push(allNavItems[focusedIndex].href);
      setSidebarOpen(false);
    } else if (e.key === 'Escape') {
      setSidebarOpen(false);
      // Return focus to the main content area
      const mainContent = document.querySelector('main');
      if (mainContent) (mainContent as HTMLElement).focus();
    }
  }, [allNavItems, focusedIndex, router]);

  // Global keyboard shortcut: Escape to close mobile sidebar
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [sidebarOpen]);

  // Fetch unread contacts count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/admin/contacts');
        const json = await res.json();
        if (json.ok) {
          setUnreadCount(json.unreadCount || 0);
        }
      } catch {
        // Silently fail
      }
    };
    fetchUnread();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.replace('/admin');
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-[#0c1222] text-white">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        onKeyDown={handleSidebarKeyDown}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.18] bg-[#111a2e] transition-all duration-300 lg:relative lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-[72px]' : 'w-64'}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.18] px-4">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                <span className="text-sm font-bold">FK</span>
              </div>
              <div>
                <span className="text-sm font-bold text-white">Admin Panel</span>
                <p className="text-[10px] text-emerald-400">Faisal Khan</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
              <span className="text-sm font-bold">FK</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 text-white/90 hover:text-white hover:bg-white/10 lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation with Sections */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-4" role="navigation" aria-label="Admin sidebar navigation">
            {navSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <div key={section.title}>
                  {/* Section header */}
                  {!collapsed && (
                    <div className="mb-2 flex items-center gap-2 px-3">
                      <SectionIcon className="h-3 w-3 text-white/70" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                        {section.title}
                      </span>
                    </div>
                  )}
                  {collapsed && (
                    <div className="mb-2 mx-auto h-px w-8 bg-white/[0.18]" />
                  )}
                  {/* Section items */}
                  <div className="space-y-0.5" role="group" aria-label={section.title}>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      const isContacts = item.href === '/admin/dashboard/contacts';
                      const badge = isContacts ? unreadCount : item.badge;
                      // Get the flat index for this item
                      const flatIndex = allNavItems.findIndex(n => n.href === item.href);
                      return (
                        <button
                          key={item.href}
                          ref={el => { navItemRefs.current[flatIndex] = el; }}
                          onClick={() => {
                            router.push(item.href);
                            setSidebarOpen(false);
                          }}
                          onFocus={() => setFocusedIndex(flatIndex)}
                          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                            active
                              ? 'bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/10'
                              : 'text-white hover:bg-white/[0.08] hover:text-white'
                          } ${collapsed ? 'justify-center' : ''}`}
                          title={collapsed ? item.label : undefined}
                          aria-current={active ? 'page' : undefined}
                        >
                          <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-emerald-400' : 'text-white/90 group-hover:text-white'}`} />
                          {!collapsed && <span>{item.label}</span>}
                          {!collapsed && active && (
                            <motion.div
                              layoutId="sidebar-active"
                              className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"
                            />
                          )}
                          {!collapsed && badge && badge > 0 ? (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500/20 px-1.5 text-[10px] font-bold text-rose-400">
                              {badge > 99 ? '99+' : badge}
                            </span>
                          ) : null}
                          {collapsed && badge && badge > 0 ? (
                            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white">
                              {badge > 9 ? '9+' : badge}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-white/[0.18] p-3">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 transition-all hover:bg-red-500/10 hover:text-red-400 ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.18] bg-[#0c1222] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/90 hover:text-white hover:bg-white/10 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-white">
                {navSections.flatMap(s => s.items).find((i) => isActive(i.href))?.label || 'Admin'}
              </h1>
              <p className="text-[10px] text-white/85 hidden sm:block">
                {pathname.replace('/admin/dashboard', '').replace('/', '') || 'Overview'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Search button */}
            <button
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true });
                document.dispatchEvent(event);
              }}
              className="flex h-9 items-center gap-2 rounded-xl bg-white/[0.06] px-3 text-white/90 transition-all hover:bg-white/[0.12] hover:text-white"
            >
              <Search className="h-4 w-4" />
              <span className="hidden text-xs sm:inline">Search</span>
              <kbd className="hidden rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-white/75 sm:inline">⌘K</kbd>
            </button>
            {/* Notification bell */}
            <button
              onClick={() => router.push('/admin/dashboard/contacts')}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/85 transition-all hover:bg-white/[0.12] hover:text-white"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white shadow-lg shadow-rose-500/30">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white shadow-lg shadow-emerald-500/25">
              A
            </div>
            <span className="hidden text-sm font-medium text-white sm:inline">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0c1222] p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Global Search Command Palette */}
      <SearchCommand />
    </div>
  );
}
