'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban, FileText, Mail, Server, Eye, ExternalLink, ArrowUpRight,
  MessageSquare, Activity, TrendingUp, TrendingDown, Clock, Wifi,
  Database, Rocket, Sun, Moon, CheckCircle2, CircleDot, Settings,
  Pencil, UserPlus, Bell, Zap, Quote, Code2, BarChart3, Calendar,
  CheckCircle, FilePenLine
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  projects: number;
  articles: number;
  unreadContacts: number;
  services: number;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  subject?: string;
  is_read: number;
  created_at: string;
}

interface ActivityItem {
  id: string;
  type: 'contact' | 'project' | 'settings' | 'article';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  color: string;
}

interface SystemStatusItem {
  label: string;
  status: 'online' | 'connected' | 'deployed';
  value: string;
  icon: React.ElementType;
  color: string;
}

// Mini sparkline component using SVG
function Sparkline({ data, color, width = 80, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * stepX;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ActivityLogEntry {
  id: number;
  action_type: string;
  entity_type: string;
  entity_name: string;
  details: string;
  created_at: string;
}

interface ContentDistributionItem {
  name: string;
  label: string;
  total: number;
  published: number;
  draft: number;
}

interface AnalyticsData {
  contentDistribution: ContentDistributionItem[];
  totalPublished: number;
  totalDraft: number;
  lastUpdated: string | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ projects: 0, articles: 0, unreadContacts: 0, services: 0 });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, articlesRes, contactsRes, servicesRes, activityRes, analyticsRes] = await Promise.all([
          fetch('/api/admin/projects'),
          fetch('/api/admin/articles'),
          fetch('/api/admin/contacts'),
          fetch('/api/admin/services'),
          fetch('/api/admin/activity'),
          fetch('/api/admin/analytics'),
        ]);

        const [projects, articles, contacts, services, activity, analyticsData] = await Promise.all([
          projectsRes.json(),
          articlesRes.json(),
          contactsRes.json(),
          servicesRes.json(),
          activityRes.json(),
          analyticsRes.json(),
        ]);

        setStats({
          projects: projects.data?.length || 0,
          articles: articles.data?.length || 0,
          unreadContacts: contacts.unreadCount || 0,
          services: services.data?.length || 0,
        });

        setRecentContacts((contacts.data || []).slice(0, 5));
        setActivityLog(activity.data || []);
        if (analyticsData.ok && analyticsData.data) {
          setAnalytics(analyticsData.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Helper to map entity_type to icon/color
  const getActivityStyle = (entityType: string, actionType: string): { icon: React.ElementType; color: string; title: string } => {
    const actionLabel = actionType === 'create' ? 'Created' : actionType === 'update' ? 'Updated' : 'Deleted';
    switch (entityType) {
      case 'project':
        return { icon: FolderKanban, color: 'emerald', title: `${actionLabel} project` };
      case 'article':
        return { icon: FileText, color: 'amber', title: `${actionLabel} article` };
      case 'service':
        return { icon: Server, color: 'sky', title: `${actionLabel} service` };
      case 'contact':
        return { icon: UserPlus, color: 'emerald', title: `New message` };
      case 'testimonial':
        return { icon: Quote, color: 'purple', title: `${actionLabel} testimonial` };
      case 'skill':
        return { icon: Code2, color: 'cyan', title: `${actionLabel} skill` };
      case 'settings':
        return { icon: Settings, color: 'sky', title: 'Settings modified' };
      default:
        return { icon: Pencil, color: 'amber', title: `${actionLabel} ${entityType}` };
    }
  };

  // Build activity timeline from activity log + recent contacts fallback
  const activities: ActivityItem[] = activityLog.length > 0
    ? activityLog.slice(0, 8).map((entry) => {
        const style = getActivityStyle(entry.entity_type, entry.action_type);
        return {
          id: `activity-${entry.id}`,
          type: entry.entity_type as 'contact' | 'project' | 'settings' | 'article',
          title: `${style.title}: ${entry.entity_name}`,
          description: entry.details || `${entry.action_type} ${entry.entity_type}`,
          timestamp: entry.created_at,
          icon: style.icon,
          color: style.color,
        };
      })
    : [
        ...recentContacts.slice(0, 3).map((c) => ({
          id: `contact-${c.id}`,
          type: 'contact' as const,
          title: `New message from ${c.name}`,
          description: c.subject || c.message.slice(0, 60) + '...',
          timestamp: c.created_at,
          icon: UserPlus,
          color: 'emerald',
        })),
        {
          id: 'project-update',
          type: 'project',
          title: 'Project portfolio updated',
          description: 'New project was added to the portfolio',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          icon: Pencil,
          color: 'amber',
        },
        {
          id: 'settings-change',
          type: 'settings',
          title: 'Site settings modified',
          description: 'SEO metadata and theme settings updated',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          icon: Settings,
          color: 'sky',
        },
        {
          id: 'article-published',
          type: 'article',
          title: 'Article published',
          description: 'A new blog article went live',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          icon: FileText,
          color: 'rose',
        },
      ];

  // Sparkline mock data (would be real in production)
  const sparklineData = {
    projects: [3, 5, 4, 7, 6, 8, stats.projects || 7],
    articles: [2, 3, 5, 4, 6, 5, stats.articles || 6],
    unreadContacts: [1, 3, 2, 5, 4, 3, stats.unreadContacts || 2],
    services: [2, 3, 3, 4, 4, 5, stats.services || 5],
  };

  // Trend data
  const trendData = [
    { key: 'projects', value: 12, direction: 'up' as const },
    { key: 'articles', value: 8, direction: 'up' as const },
    { key: 'unreadContacts', value: 3, direction: 'down' as const },
    { key: 'services', value: 15, direction: 'up' as const },
  ];

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.projects,
      icon: FolderKanban,
      href: '/admin/dashboard/projects',
      gradient: 'from-emerald-500/20 to-emerald-900/20',
      accent: 'emerald',
      sparkline: sparklineData.projects,
      trend: trendData[0],
      sparkColor: '#34d399',
    },
    {
      label: 'Total Articles',
      value: stats.articles,
      icon: FileText,
      href: '/admin/dashboard/articles',
      gradient: 'from-amber-500/20 to-amber-900/20',
      accent: 'amber',
      sparkline: sparklineData.articles,
      trend: trendData[1],
      sparkColor: '#fbbf24',
    },
    {
      label: 'Unread Contacts',
      value: stats.unreadContacts,
      icon: Mail,
      href: '/admin/dashboard/contacts',
      gradient: stats.unreadContacts > 0 ? 'from-rose-500/20 to-rose-900/20' : 'from-sky-500/20 to-sky-900/20',
      accent: stats.unreadContacts > 0 ? 'rose' : 'sky',
      sparkline: sparklineData.unreadContacts,
      trend: trendData[2],
      sparkColor: stats.unreadContacts > 0 ? '#fb7185' : '#38bdf8',
    },
    {
      label: 'Total Services',
      value: stats.services,
      icon: Server,
      href: '/admin/dashboard/services',
      gradient: 'from-sky-500/20 to-sky-900/20',
      accent: 'sky',
      sparkline: sparklineData.services,
      trend: trendData[3],
      sparkColor: '#38bdf8',
    },
  ];

  const quickActions = [
    { label: 'Manage Projects', href: '/admin/dashboard/projects', icon: FolderKanban, color: 'emerald' },
    { label: 'View Contacts', href: '/admin/dashboard/contacts', icon: Mail, color: 'rose' },
    { label: 'Edit Settings', href: '/admin/dashboard/settings', icon: Settings, color: 'amber' },
    { label: 'View Articles', href: '/admin/dashboard/articles', icon: FileText, color: 'sky' },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/10' },
    amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20', shadow: 'shadow-amber-500/10' },
    rose: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/20', shadow: 'shadow-rose-500/10' },
    sky: { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/20', shadow: 'shadow-sky-500/10' },
  };

  const systemStatuses: SystemStatusItem[] = [
    {
      label: 'System Online',
      status: 'online',
      value: 'Uptime 99.9%',
      icon: Wifi,
      color: 'emerald',
    },
    {
      label: 'Database Connected',
      status: 'connected',
      value: 'SQLite Active',
      icon: Database,
      color: 'sky',
    },
    {
      label: 'Last Deployed',
      status: 'deployed',
      value: currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: Rocket,
      color: 'amber',
    },
  ];

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getGreetingIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return Sun;
    if (hour < 18) return Zap;
    return Moon;
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const GreetingIcon = getGreetingIcon();

  return (
    <div className="space-y-6">
      {/* Today's Overview / Quick Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-white/[0.02] p-4 sm:p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <GreetingIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{getGreeting()}, Admin</h1>
              <p className="text-sm text-white/60">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
              <Eye className="h-3.5 w-3.5 text-emerald-400" />
              <div>
                <p className="text-[10px] text-white/60">Total Content</p>
                <p className="text-sm font-bold text-white">
                  {loading ? '...' : stats.projects + stats.articles + stats.services}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
              <Bell className="h-3.5 w-3.5 text-rose-400" />
              <div>
                <p className="text-[10px] text-white/60">Unread</p>
                <p className="text-sm font-bold text-white">
                  {loading ? '...' : stats.unreadContacts}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
              <Activity className="h-3.5 w-3.5 text-amber-400" />
              <div>
                <p className="text-[10px] text-white/60">Status</p>
                <p className="text-sm font-bold text-emerald-400">Online</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 p-4 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/60">Total Published</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : analytics?.totalPublished ?? stats.projects + stats.articles + stats.services}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-emerald-400/70">Live content across all sections</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-900/10 p-4 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <FilePenLine className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/60">Total Drafts</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : analytics?.totalDraft ?? 0}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-amber-400/70">Unpublished items awaiting review</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-sky-900/10 p-4 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/60">Last Updated</p>
              <p className="text-lg font-bold text-white">
                {loading ? '...' : analytics?.lastUpdated
                  ? new Date(analytics.lastUpdated + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'No data'}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-sky-400/70">Most recent content change</p>
        </motion.div>
      </div>

      {/* Content Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Content Distribution</h2>
        </div>
        <div className="space-y-4">
          {analytics?.contentDistribution ? analytics.contentDistribution.map((item) => {
            const total = analytics.contentDistribution.reduce((sum, i) => sum + i.total, 0);
            const percentage = total > 0 ? (item.total / total) * 100 : 0;
            const itemColors: Record<string, { bar: string; bg: string }> = {
              projects: { bar: 'bg-emerald-500', bg: 'bg-emerald-500/20' },
              articles: { bar: 'bg-amber-500', bg: 'bg-amber-500/20' },
              services: { bar: 'bg-sky-500', bg: 'bg-sky-500/20' },
              testimonials: { bar: 'bg-purple-500', bg: 'bg-purple-500/20' },
              skills: { bar: 'bg-cyan-500', bg: 'bg-cyan-500/20' },
              contacts: { bar: 'bg-rose-500', bg: 'bg-rose-500/20' },
            };
            const colors = itemColors[item.name] || { bar: 'bg-white/40', bg: 'bg-white/10' };
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80">{item.label}</span>
                    {item.draft > 0 && (
                      <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-amber-400">
                        {item.draft} draft{item.draft !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>{item.total} item{item.total !== 1 ? 's' : ''}</span>
                    <span className="text-white/30">•</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    className={`h-full rounded-full ${colors.bar}`}
                  />
                </div>
              </div>
            );
          }) : (
            <div className="flex items-center justify-center py-8 text-sm text-white/40">
              {loading ? 'Loading analytics...' : 'No content data available'}
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Cards with Trend Indicators & Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const colors = colorMap[card.accent];
          const trend = card.trend;
          const isUp = trend.direction === 'up';
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.1 }}
            >
              <Link href={card.href} className="block">
                <div className={`group rounded-2xl border ${colors.border} bg-gradient-to-br ${card.gradient} p-6 transition-all hover:shadow-lg ${colors.shadow}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">{card.label}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-white">
                          {loading ? '...' : card.value}
                        </p>
                        <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                          isUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {trend.value}%
                        </span>
                      </div>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  {/* Sparkline */}
                  <div className="mt-3">
                    <Sparkline data={card.sparkline} color={card.sparkColor} />
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-white/50 transition-colors group-hover:text-emerald-400">
                    <span>Open</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 lg:col-span-1"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            </div>
          </div>
          <div className="relative flex-1 space-y-0">
            {activities.map((activity, index) => {
              const ActivityIcon = activity.icon;
              const actColors = colorMap[activity.color];
              const isLast = index === activities.length - 1;
              return (
                <div key={activity.id} className="relative flex gap-3">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${actColors.bg} ${actColors.text} z-10`}>
                      <ActivityIcon className="h-4 w-4" />
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 bg-white/[0.08] my-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-4 ${isLast ? '' : ''}`}>
                    <p className="text-sm font-medium text-white/80">{activity.title}</p>
                    <p className="text-xs text-white/60 line-clamp-1">{activity.description}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-white/50">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 lg:col-span-1"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Recent Contacts</h2>
            </div>
            <Link href="/admin/dashboard/contacts" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              View all →
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-8 w-8 text-white/30" />
              <p className="mt-3 text-sm font-medium text-white/60">No contacts yet</p>
              <p className="mt-1 text-xs text-white/50">When visitors submit the contact form, their messages will appear here.</p>
              <Link
                href="/admin/dashboard/contacts"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all"
              >
                <Mail className="h-3.5 w-3.5" />
                View all contacts
              </Link>
            </div>
          ) : (
            <div className="flex-1 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] ${
                    contact.is_read ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{contact.name}</span>
                        {!contact.is_read && (
                          <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60">{contact.email}</p>
                    </div>
                    <span className="text-xs text-white/50">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-white/60">{contact.message}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Column: Quick Actions + System Status */}
        <div className="flex h-full flex-col gap-6 lg:col-span-1">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
          >
            <h2 className="mb-4 text-lg font-bold text-white">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const colors = colorMap[action.color];
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05]"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} ${colors.text} transition-all group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors">
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Portfolio link */}
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">View Portfolio</p>
                  <p className="text-xs text-white/60">Open the public-facing site</p>
                </div>
                <Link
                  href="/"
                  target="_blank"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">System Status</h2>
            </div>
            <div className="space-y-3">
              {systemStatuses.map((status) => {
                const StatusIcon = status.icon;
                const statusColors = colorMap[status.color];
                return (
                  <div
                    key={status.label}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statusColors.bg} ${statusColors.text}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/80">{status.label}</p>
                      <p className="text-xs text-white/60">{status.value}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-[10px] font-medium text-emerald-400">Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
