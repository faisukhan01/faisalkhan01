'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, FileText, Mail, Server, Eye, ExternalLink, ArrowUpRight } from 'lucide-react';
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
    { label: 'Total Projects', value: stats.projects, icon: FolderKanban, href: '/admin/dashboard/projects', color: 'from-emerald-500/20 to-emerald-900/20' },
    { label: 'Total Articles', value: stats.articles, icon: FileText, href: '/admin/dashboard/articles', color: 'from-amber-500/20 to-amber-900/20' },
    { label: 'Unread Contacts', value: stats.unreadContacts, icon: Mail, href: '/admin/dashboard/contacts', color: 'from-rose-500/20 to-rose-900/20' },
    { label: 'Total Services', value: stats.services, icon: Server, href: '/admin/dashboard/services', color: 'from-sky-500/20 to-sky-900/20' },
  ];

  const quickActions = [
    { label: 'Manage Projects', href: '/admin/dashboard/projects', icon: FolderKanban },
    { label: 'View Contacts', href: '/admin/dashboard/contacts', icon: Mail },
    { label: 'Edit Settings', href: '/admin/dashboard/settings', icon: Server },
    { label: 'View Articles', href: '/admin/dashboard/articles', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={card.href} className="block">
                <div className={`group rounded-2xl border border-outline-2 bg-gradient-to-br ${card.color} p-6 transition-all hover:border-outline-4 hover:shadow-lg`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                      <p className="mt-2 text-3xl font-bold text-foreground">
                        {loading ? '...' : card.value}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/10 text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
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
          className="rounded-2xl border border-slate-700 bg-[#1E293B] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Contacts</h2>
            <Link href="/admin/dashboard/contacts" className="text-xs text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No contacts yet</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`rounded-xl border border-outline-1 p-4 transition-colors hover:bg-surface-2 ${
                    contact.is_read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{contact.name}</span>
                        {!contact.is_read && (
                          <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-medium text-rose-400">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{contact.message}</p>
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
          className="rounded-2xl border border-slate-700 bg-[#1E293B] p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-outline-2 bg-surface-2 p-5 transition-all hover:border-outline-4 hover:bg-surface-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/10 text-foreground transition-colors group-hover:bg-foreground/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Portfolio link */}
          <div className="mt-6 rounded-xl border border-outline-2 bg-surface-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">View Portfolio</p>
                <p className="text-xs text-muted-foreground">Open the public-facing site</p>
              </div>
              <Link
                href="/"
                target="_blank"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/10 text-foreground transition-colors hover:bg-foreground/15"
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
