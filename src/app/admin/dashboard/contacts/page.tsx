'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Trash2, Eye, Search, Loader2, MessageSquare, Clock, User, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  subject?: string;
  is_read: number;
  created_at: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/contacts');
      const json = await res.json();
      if (json.ok) {
        setContacts(json.data || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch (err) {
      console.error('Fetch contacts error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleMarkRead = async (id: number) => {
    try {
      await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, is_read: 1 });
      }
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
      fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = contacts.filter(c => !c.is_read);
      await Promise.all(unread.map(c => 
        fetch('/api/admin/contacts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: c.id }),
        })
      ));
      fetchContacts();
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const filtered = search
    ? contacts.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.message.toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Form Submissions</h2>
          <p className="text-sm text-white/40">
            {contacts.length} total &middot; {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllRead}
              variant="ghost"
              className="rounded-xl text-white/40 hover:text-white hover:bg-white/10"
            >
              <MailOpen className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or message..."
          className="rounded-xl border-white/[0.08] bg-white/[0.04] pl-10 text-sm text-white placeholder:text-white/30 focus:border-emerald-500/50 focus:ring-emerald-500/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Contact list */}
        <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-white/20" />
              <p className="mt-2 text-sm text-white/30">No form submissions yet</p>
              <p className="text-xs text-white/20">When visitors submit the contact form, their messages will appear here.</p>
            </div>
          ) : (
            filtered.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  setSelectedContact(contact);
                  if (!contact.is_read) handleMarkRead(contact.id);
                }}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedContact?.id === contact.id
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
                } ${!contact.is_read ? 'border-l-2 border-l-emerald-400' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${!contact.is_read ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/40'}`}>
                      <span className="text-xs font-bold">{contact.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${!contact.is_read ? 'text-white' : 'text-white/60'}`}>
                        {contact.name}
                      </p>
                      <p className="text-[11px] text-white/30">{contact.email}</p>
                    </div>
                  </div>
                  {!contact.is_read && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      NEW
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-white/30">{contact.message}</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-white/20">
                  <Clock className="h-3 w-3" />
                  {new Date(contact.created_at).toLocaleString()}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact detail */}
        <div className="lg:col-span-3">
          {selectedContact ? (
            <motion.div
              key={selectedContact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                    <span className="text-lg font-bold">{selectedContact.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedContact.name}</h3>
                    <p className="text-sm text-white/40">{selectedContact.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(selectedContact.id)}
                  className="h-8 w-8 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {selectedContact.subject && (
                <div className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-xs font-medium text-white/50">Subject</p>
                  <p className="text-sm text-white/80">{selectedContact.subject}</p>
                </div>
              )}

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-xs font-medium text-white/50 mb-2">Message</p>
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-white/30">
                  <Clock className="h-3 w-3" />
                  {new Date(selectedContact.created_at).toLocaleString()}
                </div>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  <Mail className="h-3 w-3" />
                  Reply via Email
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-white/15" />
                <p className="mt-2 text-sm text-white/30">Select a contact to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
