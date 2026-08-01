'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, FileText, Mail, Server, Eye, ExternalLink, ArrowUpRight, MessageSquare } from 'lucide-react';
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

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ projects: 0, articles: 0, unreadContacts: 0, services: 0 });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, articlesRes, contactsRes, servicesRes] = await Promise.all([
          fetch('/api/admin/projects'),
          fetch('/api/admin/articles'),
          fetch('/api/admin/contacts'),
          fetch('/api/admin/services'),
        ]);

        const [projects, articles, contacts, services] = await Promise.all([
          projectsRes.json(),
          articlesRes.json(),
          contactsRes.json(),
          servicesRes.json(),
        ]);

        setStats({
          projects: projects.data?.length || 0,
          articles: articles.data?.length || 0,
          unreadContacts: contacts.unreadCount || 0,
          services: services.data?.length || 0,
        });

        setRecentContacts((contacts.data || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderKanban, href: '/admin/dashboard/projects', gradient: 'from-emerald-500/20 to-emerald-900/20', accent: 'emerald' },
    { label: 'Total Articles', value: stats.articles, icon: FileText, href: '/admin/dashboard/articles', gradient: 'from-amber-500/20 to-amber-900/20', accent: 'amber' },
    { label: 'Unread Contacts', value: stats.unreadContacts, icon: Mail, href: '/admin/dashboard/contacts', gradient: 'from-rose-500/20 to-rose-900/20', accent: 'rose' },
    { label: 'Total Services', value: stats.services, icon: Server, href: '/admin/dashboard/services', gradient: 'from-sky-500/20 to-sky-900/20', accent: 'sky' },
  ];

  const quickActions = [
    { label: 'Manage Projects', href: '/admin/dashboard/projects', icon: FolderKanban, color: 'emerald' },
    { label: 'View Contacts', href: '/admin/dashboard/contacts', icon: Mail, color: 'rose' },
    { label: 'Edit Settings', href: '/admin/dashboard/settings', icon: Server, color: 'amber' },
    { label: 'View Articles', href: '/admin/dashboard/articles', icon: FileText, color: 'sky' },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/10' },
    amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20', shadow: 'shadow-amber-500/10' },
    rose: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/20', shadow: 'shadow-rose-500/10' },
    sky: { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/20', shadow: 'shadow-sky-500/10' },
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const colors = colorMap[card.accent];
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={card.href} className="block">
                <div className={`group rounded-2xl border ${colors.border} bg-gradient-to-br ${card.gradient} p-6 transition-all hover:shadow-lg ${colors.shadow}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/50">{card.label}</p>
                      <p className="mt-2 text-3xl font-bold text-white">
                        {loading ? '...' : card.value}
                      </p>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                    <span>View details</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
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
            <p className="py-8 text-center text-sm text-white/30">No contacts yet</p>
          ) : (
            <div className="space-y-3">
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
                      <p className="text-xs text-white/40">{contact.email}</p>
                    </div>
                    <span className="text-xs text-white/30">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-white/40">{contact.message}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
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
                  <span className="text-xs font-medium text-white/40 group-hover:text-white/80 transition-colors">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Portfolio link */}
          <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">View Portfolio</p>
                <p className="text-xs text-white/40">Open the public-facing site</p>
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
      </div>
    </div>
  );
}
