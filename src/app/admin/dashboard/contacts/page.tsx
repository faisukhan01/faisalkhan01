'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable, { ColumnDef } from '@/components/admin/DataTable';

export default function ContactsPage() {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/contacts');
      const json = await res.json();
      if (json.ok) setData(json.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleMarkRead = async (row: Record<string, unknown>) => {
    try {
      await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id }),
      });
      fetchData();
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleDelete = async (row: Record<string, unknown>) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await fetch(`/api/admin/contacts?id=${row.id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const columns: ColumnDef[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'message',
      label: 'Message',
      render: (v) => (
        <span className="line-clamp-2 max-w-xs text-muted-foreground">{String(v ?? '')}</span>
      ),
    },
    {
      key: 'is_read',
      label: 'Status',
      render: (v) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v ? 'bg-surface-4 text-muted-foreground' : 'bg-rose-500/20 text-rose-400'}`}>
          {v ? 'Read' : 'Unread'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (v) => <span className="text-muted-foreground">{v ? new Date(String(v)).toLocaleDateString() : ''}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contacts</h2>
          <p className="text-sm text-muted-foreground">
            {data.filter((d) => !d.is_read).length} unread &middot; {data.length} total
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search contacts..."
          onEdit={handleMarkRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
