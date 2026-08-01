'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MailOpen, Trash2, Search, Loader2, MessageSquare, Clock,
  MailCheck, FileDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  subject?: string;
  is_read: number;
  created_at: string;
}

// Escape a value for CSV (RFC 4180-style): wrap in quotes if it contains
// commas, quotes, or newlines, and double any internal quotes.
function csvEscape(value: unknown): string {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState<'markRead' | 'delete' | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const performSingleDelete = async (id: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
      toast.success('Contact deleted', {
        description: 'The submission has been removed.',
      });
      setSingleDeleteId(null);
    } catch {
      toast.error('Failed to delete contact', {
        description: 'Please try again.',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = (id: number) => {
    setSingleDeleteId(id);
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = contacts.filter(c => !c.is_read);
      if (unread.length === 0) return;
      await Promise.all(unread.map(c =>
        fetch('/api/admin/contacts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: c.id }),
        })
      ));
      fetchContacts();
      toast.success(`${unread.length} contact${unread.length !== 1 ? 's' : ''} marked as read`);
    } catch (err) {
      console.error('Mark all read error:', err);
      toast.error('Failed to mark contacts as read');
    }
  };

  const filtered = useMemo(
    () =>
      search
        ? contacts.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.message.toLowerCase().includes(search.toLowerCase())
          )
        : contacts,
    [contacts, search],
  );

  // Selection helpers operate on the filtered list (what's actually visible).
  const filteredIds = useMemo(() => filtered.map(c => c.id), [filtered]);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.has(id));
  const someFilteredSelected = filteredIds.some(id => selectedIds.has(id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        for (const id of filteredIds) next.delete(id);
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        for (const id of filteredIds) next.add(id);
        return next;
      });
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExportCSV = () => {
    try {
      const rows = filtered.length > 0 ? filtered : contacts;
      const header = ['Name', 'Email', 'Message', 'Subject', 'Date', 'Status'];
      const lines = [header.join(',')];
      for (const c of rows) {
        lines.push([
          csvEscape(c.name),
          csvEscape(c.email),
          csvEscape(c.message),
          csvEscape(c.subject || ''),
          csvEscape(new Date(c.created_at).toISOString()),
          csvEscape(c.is_read ? 'Read' : 'Unread'),
        ].join(','));
      }
      const csv = lines.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const stamp = new Date().toISOString().slice(0, 10);
      link.download = `form-submissions-${stamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('CSV exported', {
        description: `${rows.length} contact${rows.length !== 1 ? 's' : ''} exported.`,
      });
    } catch (err) {
      console.error('CSV export error:', err);
      toast.error('Failed to export CSV');
    }
  };

  const performBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    setBulkBusy(true);
    const ids = Array.from(selectedIds);
    try {
      if (bulkAction === 'markRead') {
        await Promise.all(ids.map(id =>
          fetch('/api/admin/contacts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          }),
        ));
        await fetchContacts();
        toast.success(`${ids.length} contact${ids.length !== 1 ? 's' : ''} marked as read`);
        setSelectedIds(new Set());
      } else if (bulkAction === 'delete') {
        let okCount = 0;
        let failCount = 0;
        await Promise.all(ids.map(async id => {
          try {
            const res = await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
            if (res.ok) okCount++;
            else failCount++;
          } catch {
            failCount++;
          }
        }));
        await fetchContacts();
        if (selectedContact && ids.includes(selectedContact.id)) {
          setSelectedContact(null);
        }
        if (okCount > 0) {
          toast.success(`${okCount} contact${okCount !== 1 ? 's' : ''} deleted`, {
            description: failCount > 0 ? `${failCount} failed to delete.` : undefined,
          });
        } else if (failCount > 0) {
          toast.error('Failed to delete contacts');
        }
        setSelectedIds(new Set());
      }
      setBulkAction(null);
    } catch (err) {
      console.error('Bulk action error:', err);
      toast.error('Bulk action failed');
    } finally {
      setBulkBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact header — page name is already in the top admin header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {contacts.length} total
          </span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="ghost"
            className="rounded-xl text-white/60 hover:text-white hover:bg-white/10"
            title="Download all submissions as a CSV file"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllRead}
              variant="ghost"
              className="rounded-xl text-white/60 hover:text-white hover:bg-white/10"
            >
              <MailOpen className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or message..."
          className="rounded-xl border-white/[0.12] bg-white/[0.04] pl-10 text-sm text-white placeholder:text-white/45 focus:border-emerald-500/50 focus:ring-emerald-500/20"
        />
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3"
          >
            <div className="flex items-center gap-3 px-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-white/60 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => setBulkAction('markRead')}
                variant="ghost"
                className="rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
              >
                <MailCheck className="mr-2 h-4 w-4" />
                Mark selected as read
              </Button>
              <Button
                onClick={() => setBulkAction('delete')}
                variant="ghost"
                className="rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Contact list */}
        <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {/* Select-all header */}
          {filtered.length > 0 && (
            <div className="sticky top-0 z-10 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0f1629]/95 px-3 py-2 backdrop-blur">
              <Checkbox
                checked={allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all visible contacts"
                className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <span className="text-xs font-medium text-white/70">
                {allFilteredSelected ? 'All selected' : 'Select all visible'}
              </span>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare className="h-10 w-10 text-white/40" />
              <p className="mt-3 text-sm font-medium text-white/75">No form submissions yet</p>
              <p className="mt-1 text-xs text-white/65">When visitors submit the contact form, their messages will appear here.</p>
              <Link
                href="/"
                target="_blank"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all"
              >
                <Mail className="h-3.5 w-3.5" />
                Open contact form
              </Link>
            </div>
          ) : (
            filtered.map((contact, i) => {
              const isSelected = selectedIds.has(contact.id);
              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedContact?.id === contact.id
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
                  } ${!contact.is_read ? 'border-l-2 border-l-emerald-400' : ''} ${isSelected ? 'ring-1 ring-emerald-500/40' : ''}`}
                >
                  <div
                    className="flex items-start gap-3"
                    onClick={() => {
                      setSelectedContact(contact);
                      if (!contact.is_read) handleMarkRead(contact.id);
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(contact.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${contact.name}`}
                      className="mt-1 border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${!contact.is_read ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/40'}`}>
                            <span className="text-xs font-bold">{contact.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${!contact.is_read ? 'text-white' : 'text-white/60'}`}>
                              {contact.name}
                            </p>
                            <p className="text-[11px] text-white/65">{contact.email}</p>
                          </div>
                        </div>
                        {!contact.is_read && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs text-white/65">{contact.message}</p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-white/55">
                        <Clock className="h-3 w-3" />
                        {new Date(contact.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
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
                    <p className="text-sm text-white/75">{selectedContact.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(selectedContact.id)}
                  className="h-8 w-8 rounded-lg text-white/65 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {selectedContact.subject && (
                <div className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-xs font-medium text-white/80">Subject</p>
                  <p className="text-sm text-white/80">{selectedContact.subject}</p>
                </div>
              )}

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-xs font-medium text-white/80 mb-2">Message</p>
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-white/65">
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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
              {/* Visual illustration */}
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <MessageSquare className="h-10 w-10 text-emerald-400/60" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/15">
                  <Mail className="h-4 w-4 text-rose-400/60" />
                </div>
                <div className="absolute -bottom-1 -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15">
                  <MailOpen className="h-3.5 w-3.5 text-amber-400/60" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white/80">Contact Details</h3>
              <p className="mt-1 text-sm text-white/45">Select a contact from the list to view details</p>

              {/* Stats summary */}
              <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-sm">
                <div className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <span className="text-xl font-bold text-white">{contacts.length}</span>
                  <span className="text-[10px] text-white/45">Total</span>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-rose-500/10 bg-rose-500/[0.04] p-3">
                  <span className="text-xl font-bold text-rose-400">{unreadCount}</span>
                  <span className="text-[10px] text-white/45">Unread</span>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <span className="text-xl font-bold text-emerald-400">~2h</span>
                  <span className="text-[10px] text-white/45">Avg. Response</span>
                </div>
              </div>

              {/* Quick tips */}
              <div className="mt-6 w-full max-w-sm space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Quick Tips</p>
                <div className="flex items-start gap-2 rounded-lg border border-white/[0.04] bg-white/[0.01] p-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/10">
                    <MessageSquare className="h-3 w-3 text-emerald-400" />
                  </div>
                  <p className="text-xs text-white/45">Click on a contact to view their full message and details</p>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-white/[0.04] bg-white/[0.01] p-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/10">
                    <Checkbox checked={false} className="h-3 w-3 border-white/20" />
                  </div>
                  <p className="text-xs text-white/45">Use checkboxes for bulk actions like marking as read or deleting</p>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-white/[0.04] bg-white/[0.01] p-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/10">
                    <FileDown className="h-3 w-3 text-emerald-400" />
                  </div>
                  <p className="text-xs text-white/45">Export CSV to backup your data or import into other tools</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Single delete confirmation */}
      <ConfirmDialog
        open={singleDeleteId !== null}
        onOpenChange={(o) => { if (!o) setSingleDeleteId(null); }}
        title="Delete this contact?"
        description="This will permanently remove the submission from your database. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={() => { if (singleDeleteId !== null) performSingleDelete(singleDeleteId); }}
      />

      {/* Bulk action confirmation */}
      <ConfirmDialog
        open={bulkAction !== null}
        onOpenChange={(o) => { if (!o) setBulkAction(null); }}
        title={bulkAction === 'delete'
          ? `Delete ${selectedIds.size} contact${selectedIds.size !== 1 ? 's' : ''}?`
          : `Mark ${selectedIds.size} contact${selectedIds.size !== 1 ? 's' : ''} as read?`}
        description={bulkAction === 'delete'
          ? 'This will permanently remove all selected submissions. This action cannot be undone.'
          : 'All selected contacts will be marked as read.'}
        confirmText={bulkAction === 'delete' ? 'Delete' : 'Mark read'}
        variant={bulkAction === 'delete' ? 'danger' : 'default'}
        loading={bulkBusy}
        onConfirm={performBulkAction}
      />
    </div>
  );
}
