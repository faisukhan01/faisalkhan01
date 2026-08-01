'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/dashboard/projects', icon: FolderKanban },
  { label: 'Articles', href: '/admin/dashboard/articles', icon: FileText },
  { label: 'Contacts', href: '/admin/dashboard/contacts', icon: Mail },
  { label: 'Services', href: '/admin/dashboard/services', icon: Server },
  { label: 'Testimonials', href: '/admin/dashboard/testimonials', icon: Quote },
  { label: 'Work Experience', href: '/admin/dashboard/work-experience', icon: Briefcase },
  { label: 'Achievements', href: '/admin/dashboard/achievements', icon: Award },
  { label: 'Skills', href: '/admin/dashboard/skills', icon: Code2 },
  { label: 'FAQ', href: '/admin/dashboard/faq', icon: HelpCircle },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
  { label: 'Reading List', href: '/admin/dashboard/reading-list', icon: BookOpen },
  { label: 'Tech Stack', href: '/admin/dashboard/tech-stack', icon: Cpu },
  { label: 'Social Links', href: '/admin/dashboard/social-links', icon: Link },
  { label: 'Hero Roles', href: '/admin/dashboard/hero-roles', icon: User },
  { label: 'Now Playing', href: '/admin/dashboard/now-playing', icon: Music },
  { label: 'Process Timeline', href: '/admin/dashboard/process-timeline', icon: GitBranch },
  { label: 'Skills Radar', href: '/admin/dashboard/skills-radar', icon: Radar },
  { label: 'Timezones', href: '/admin/dashboard/timezones', icon: Clock },
  { label: 'Newsletter Stats', href: '/admin/dashboard/newsletter-stats', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth && pathname !== '/admin') {
      router.replace('/admin');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.replace('/admin');
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-[#0a0f1a] text-white">
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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.08] bg-[#0f1629] transition-all duration-300 lg:relative lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-[72px]' : 'w-64'}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-4">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                <span className="text-sm font-bold">FK</span>
              </div>
              <div>
                <span className="text-sm font-bold text-white">Admin Panel</span>
                <p className="text-[10px] text-emerald-400/80">Faisal Khan</p>
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
            className="hidden h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/10'
                      : 'text-white/50 hover:bg-white/[0.06] hover:text-white/90'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-emerald-400' : 'text-white/40 group-hover:text-white/80'}`} />
                  {!collapsed && <span>{item.label}</span>}
                  {active && !collapsed && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-white/[0.08] p-3">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-red-500/10 hover:text-red-400 ${collapsed ? 'justify-center' : ''}`}
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
        <header className="flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#0a0f1a] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/50 hover:text-white hover:bg-white/10 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-white">
              {navItems.find((i) => isActive(i.href))?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white shadow-lg shadow-emerald-500/25">
              A
            </div>
            <span className="hidden text-sm font-medium text-white/70 sm:inline">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0f1a] p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
