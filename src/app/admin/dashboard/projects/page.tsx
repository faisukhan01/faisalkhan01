'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  Table as TableIcon,
  GripVertical,
  Search,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  FolderOpen,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Modal from '@/components/admin/Modal';
import FormBuilder, { FieldDef } from '@/components/admin/FormBuilder';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import SortableProjects from '@/components/admin/SortableProjects';

const fields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'My Awesome Project', required: true },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of the project...' },
  { name: 'image', label: 'Thumbnail / Visual', type: 'file', placeholder: 'Upload project thumbnail...', accept: 'image/*' },
  { name: 'gallery', label: 'Gallery Images', type: 'file', multiple: true, accept: 'image/*' },
  { name: 'tag', label: 'Tag', type: 'text', placeholder: 'Full-Stack' },
  { name: 'year', label: 'Year', type: 'text', placeholder: '2025' },
  { name: 'client', label: 'Client', type: 'text', placeholder: 'Client name...' },
  { name: 'duration', label: 'Duration', type: 'text', placeholder: '3 months' },
  { name: 'role', label: 'Role', type: 'text', placeholder: 'Full-Stack Developer' },
  { name: 'overview', label: 'Overview', type: 'textarea', placeholder: 'Project overview...' },
  { name: 'challenge', label: 'Challenge', type: 'textarea', placeholder: 'What was the challenge?' },
  { name: 'solution', label: 'Solution', type: 'textarea', placeholder: 'What was the solution?' },
  { name: 'tech_stack', label: 'Tech Stack (comma-separated)', type: 'text', placeholder: 'React, Node.js, PostgreSQL' },
  { name: 'results', label: 'Results (comma-separated)', type: 'text', placeholder: 'Improved performance, Better UX' },
  { name: 'live_url', label: 'Live URL', type: 'text', placeholder: 'https://example.com' },
  { name: 'repo_url', label: 'Repo URL', type: 'text', placeholder: 'https://github.com/...' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const defaultValues = {
  title: '',
  description: '',
  image: '',
  gallery: '[]',
  tag: 'Full-Stack',
  year: '2025',
  client: '',
  duration: '',
  role: 'Full-Stack Developer',
  overview: '',
  challenge: '',
  solution: '',
  tech_stack: '',
  results: '',
  live_url: '#',
  repo_url: '#',
  sort_order: 0,
  published: true,
};

type StatusFilter = 'all' | 'published' | 'draft';
type ViewMode = 'table' | 'reorder';
type SortKey = 'sort_order' | 'title' | 'tag' | 'year' | 'published';

type ProjectRow = Record<string, unknown>;

export default function ProjectsPage() {
  const [data, setData] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>(defaultValues);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProjectRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [reordering, setReordering] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('sort_order');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'delete' | 'togglePublished' | null>(null);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/projects');
      const json = await res.json();
      if (json.ok) setData(json.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset selection when status filter changes (avoids stale selection across views)
  useEffect(() => {
    setSelectedIds(new Set());
  }, [statusFilter]);

  const publishedCount = useMemo(
    () => data.filter((p) => !!p.published).length,
    [data]
  );
  const draftCount = data.length - publishedCount;

  // Filtered data based on statusFilter (used by both table view and counts)
  const filteredByStatus = useMemo(() => {
    if (statusFilter === 'all') return data;
    return data.filter((row) => {
      const published = !!row.published;
      return statusFilter === 'published' ? published : !published;
    });
  }, [data, statusFilter]);

  // Apply search + sort for table display
  const tableRows = useMemo(() => {
    let result = filteredByStatus;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        ['title', 'tag', 'year', 'client', 'role'].some((k) =>
          String(row[k] ?? '').toLowerCase().includes(q)
        )
      );
    }
    if (sortKey === 'sort_order') {
      // Preserve API order (already sorted by sort_order ASC)
      return result;
    }
    return [...result].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av ?? '').localeCompare(String(bv ?? ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredByStatus, search, sortKey, sortDir]);

  // ── Selection helpers ──
  const tableIds = tableRows.map((r) => String(r.id));
  const allTableSelected =
    tableIds.length > 0 && tableIds.every((id) => selectedIds.has(id));
  const someTableSelected = tableIds.some((id) => selectedIds.has(id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allTableSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of tableIds) next.delete(id);
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of tableIds) next.add(id);
        return next;
      });
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setFormValues({ ...defaultValues });
    setModalOpen(true);
  };

  const handleEdit = (row: ProjectRow) => {
    setEditing(row);
    const vals: Record<string, unknown> = {};
    for (const f of fields) {
      let v = row[f.name];
      // Parse JSON fields for display
      if (['gallery', 'tech_stack', 'results'].includes(f.name) && typeof v === 'string') {
        try {
          v = JSON.parse(v);
        } catch {
          /* keep as string */
        }
      }
      // Convert JSON arrays to comma-separated for editing
      if (['tech_stack', 'results'].includes(f.name) && Array.isArray(v)) {
        v = v.join(', ');
      }
      // Gallery is handled by FileField component
      if (f.name === 'gallery' && Array.isArray(v)) {
        v = JSON.stringify(v);
      }
      vals[f.name] = v;
    }
    setFormValues(vals);
    setModalOpen(true);
  };

  const handleDelete = (row: ProjectRow) => {
    setPendingDelete(row);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const id = String(pendingDelete.id);
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      fetchData();
      toast.success('Project deleted', {
        description: 'The project has been permanently removed.',
      });
      setConfirmOpen(false);
      setPendingDelete(null);
    } catch {
      toast.error('Failed to delete project', {
        description: 'Please try again.',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleFieldChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...formValues };

      // Convert comma-separated fields to JSON arrays
      for (const f of ['tech_stack', 'results']) {
        const v = payload[f];
        if (typeof v === 'string') {
          payload[f] = v.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }

      // Convert switch fields
      if (payload.published !== undefined) {
        payload.published = payload.published ? 1 : 0;
      }

      // Ensure sort_order is a number
      if (payload.sort_order !== undefined) {
        payload.sort_order = Number(payload.sort_order) || 0;
      }

      let result: 'created' | 'updated';
      if (editing) {
        payload.id = editing.id;
        const res = await fetch('/api/admin/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        result = 'updated';
      } else {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Create failed');
        result = 'created';
      }

      setModalOpen(false);
      fetchData();
      return result;
    } catch (err) {
      console.error('Save error:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = async () => {
    try {
      const result = await handleSave();
      if (result === 'updated') {
        toast.success('Project updated', { description: 'Your changes have been saved.' });
      } else if (result === 'created') {
        toast.success('Project created', { description: 'A new project has been added.' });
      }
    } catch {
      toast.error('Failed to save project', { description: 'Something went wrong. Please try again.' });
    }
  };

  const handleReorder = async (newOrder: ProjectRow[]) => {
    // Optimistically update local state
    setData(newOrder);
    setReordering(true);
    try {
      const reorder = newOrder.map((p, idx) => ({
        id: String(p.id),
        sort_order: idx,
      }));
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder }),
      });
      if (!res.ok) throw new Error('Reorder failed');
      toast.success('Order updated', { description: 'Project order saved to the database.' });
    } catch (err) {
      console.error('Reorder error:', err);
      toast.error('Failed to save order', { description: 'Reverted to previous order. Please try again.' });
      // Revert by refetching
      fetchData();
    } finally {
      setReordering(false);
    }
  };

  const performBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    setBulkActionLoading(true);
    const ids = Array.from(selectedIds);
    try {
      if (bulkAction === 'delete') {
        for (const id of ids) {
          const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error(`Failed to delete ${id}`);
        }
        toast.success('Projects deleted', {
          description: `${ids.length} project${ids.length !== 1 ? 's' : ''} permanently removed.`,
        });
      } else if (bulkAction === 'togglePublished') {
        for (const id of ids) {
          const project = data.find((p) => String(p.id) === id);
          if (!project) continue;
          const newPublished = project.published ? 0 : 1;
          const res = await fetch('/api/admin/projects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, published: newPublished }),
          });
          if (!res.ok) throw new Error(`Failed to update ${id}`);
        }
        toast.success('Status toggled', {
          description: `${ids.length} project${ids.length !== 1 ? 's' : ''} publication status flipped.`,
        });
      }
      setSelectedIds(new Set());
      setBulkAction(null);
      fetchData();
    } catch (err) {
      console.error('Bulk action error:', err);
      toast.error('Bulk action failed', {
        description: 'Some changes may not have been applied. Please refresh.',
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const triggerGlobalSearch = () => {
    // Dispatch Cmd+K to open the global search palette (handled by SearchCommand)
    if (typeof document !== 'undefined') {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
      );
    }
  };

  const statusFilterButtons: { label: string; value: StatusFilter; count: number }[] = [
    { label: 'All', value: 'all', count: data.length },
    { label: 'Published', value: 'published', count: publishedCount },
    { label: 'Draft', value: 'draft', count: draftCount },
  ];

  const sortableColumns: { key: SortKey; label: string; align?: 'left' | 'right' }[] = [
    { key: 'title', label: 'Title' },
    { key: 'tag', label: 'Tag' },
    { key: 'year', label: 'Year', align: 'right' },
    { key: 'published', label: 'Status' },
  ];

  // ── Friendly empty state (no projects at all) ──
  if (!loading && data.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md text-center"
        >
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.05] blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.03] blur-2xl" />
          </div>

          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', damping: 12 }}
            className="relative mx-auto mb-6 w-fit"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 shadow-2xl shadow-emerald-500/10">
              <FolderOpen className="h-12 w-12 text-emerald-400" />
            </div>
            {/* Floating dots */}
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-3 top-2 h-3 w-3 rounded-full bg-emerald-400/40 shadow-lg shadow-emerald-400/20"
            />
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -left-3 bottom-3 h-2 w-2 rounded-full bg-sky-400/40"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-1 -bottom-1 h-1.5 w-1.5 rounded-full bg-amber-400/40"
            />
          </motion.div>

          <h2 className="text-2xl font-bold text-white">No projects yet</h2>
          <p className="mt-2 text-sm text-white/80 leading-relaxed">
            Add your first project to showcase your work. You can include a thumbnail,
            description, tech stack, live URL, and reorder them anytime.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/85 hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <Loader2 className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact header — page name is already shown in the top admin header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.15] bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {data.length} project{data.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => window.open('/#projects', '_blank')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.15] bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/90 transition-all hover:bg-white/[0.08] hover:text-white hover:border-white/[0.18]"
            title="Open the projects section on the live site"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on Site
          </button>
        </div>
        <Button
          onClick={handleAdd}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* View toggle + status filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* View mode toggle */}
        <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.15] bg-white/[0.05] p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            Table
          </button>
          <button
            onClick={() => setViewMode('reorder')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'reorder'
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <GripVertical className="h-3.5 w-3.5" />
            Reorder
          </button>
        </div>

        {/* Status filter button group with counts (only shown in table view) */}
        {viewMode === 'table' && (
          <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.15] bg-white/[0.05] p-1">
            {statusFilterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setStatusFilter(btn.value)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === btn.value
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {btn.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    statusFilter === btn.value
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/[0.08] text-white/80'
                  }`}
                >
                  {btn.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reorder helper hint */}
      {viewMode === 'reorder' && (
        <div className="rounded-xl border border-white/[0.15] bg-white/[0.05] px-4 py-3 text-xs text-white/80">
          <span className="font-semibold text-emerald-400">Tip:</span> Drag projects by their handle
          (six-dot grip) to reorder. Changes are saved automatically when you drop.
          {reordering && <span className="ml-2 text-emerald-400">Saving…</span>}
        </div>
      )}

      {/* Bulk action bar */}
      {viewMode === 'table' && (
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
                  onClick={clearSelection}
                  className="text-xs text-white/85 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => setBulkAction('togglePublished')}
                  variant="ghost"
                  className="rounded-xl text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Toggle published
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
      )}

      {/* Main content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
        </div>
      ) : viewMode === 'reorder' ? (
        <SortableProjects projects={data} onReorder={handleReorder} />
      ) : (
        <div className="space-y-3">
          {/* Search bar with ⌘K hint */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/75" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, tag, year, client, role…"
              className="rounded-xl border-white/[0.15] bg-white/[0.06] py-2 pl-10 pr-16 text-sm text-white placeholder:text-white/75 focus:border-emerald-500/50 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={triggerGlobalSearch}
              title="Open global search (⌘K)"
              aria-label="Open global search"
              className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-white/[0.15] bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-semibold text-white/80 transition-colors hover:border-white/[0.25] hover:bg-white/[0.12] hover:text-white"
            >
              ⌘K
            </button>
          </div>

          {/* Custom table with checkbox column, status dots, narrow right-aligned year, aspect-square thumbnails */}
          <div className="overflow-x-auto rounded-xl border border-white/[0.15]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.15] bg-white/[0.05]">
                  <th className="w-10 px-3 py-3">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={
                          allTableSelected
                            ? true
                            : someTableSelected
                            ? 'indeterminate'
                            : false
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all visible projects"
                        className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/80">
                    Thumbnail
                  </th>
                  {sortableColumns.map((col) => {
                    const isActive = sortKey === col.key;
                    const align = col.align ?? 'left';
                    const isYear = col.key === 'year';
                    return (
                      <th
                        key={col.key}
                        className={`px-4 py-3 text-${align} font-semibold text-white cursor-pointer select-none hover:text-emerald-400 transition-colors ${
                          isYear ? 'max-w-[80px] w-[80px]' : ''
                        }`}
                        onClick={() => handleSort(col.key)}
                      >
                        <div
                          className={`flex items-center gap-1 ${
                            align === 'right' ? 'justify-end' : ''
                          }`}
                        >
                          <span>{col.label}</span>
                          {isActive ? (
                            sortDir === 'asc' ? (
                              <ChevronUp className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <ChevronDown className="h-3 w-3 text-emerald-400" />
                            )
                          ) : (
                            <ChevronDown className="h-3 w-3 text-white/75" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                  <th className="px-4 py-3 text-right font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={sortableColumns.length + 3}
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-white/80" />
                        <p className="text-sm font-medium text-white/90">No matches found</p>
                        <p className="text-xs text-white/80">
                          No projects match your search or filter. Try a different term or clear filters.
                        </p>
                        {(search || statusFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setSearch('');
                              setStatusFilter('all');
                            }}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-white/[0.15] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/90 hover:bg-white/[0.08] hover:text-white transition-all"
                          >
                            <X className="h-3.5 w-3.5" />
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  tableRows.map((row, i) => {
                    const id = String(row.id);
                    const isSelected = selectedIds.has(id);
                    const published = !!row.published;
                    const title = String(row.title ?? 'Untitled');
                    const tag = row.tag ? String(row.tag) : '';
                    const year = row.year ? String(row.year) : '';
                    const image = row.image ? String(row.image) : '';
                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className={`group relative border-b border-white/[0.1] transition-colors ${
                          i % 2 === 1 ? 'bg-white/[0.05]' : ''
                        } hover:bg-emerald-500/[0.08] ${
                          isSelected ? 'bg-emerald-500/[0.06]' : ''
                        }`}
                      >
                        {/* Left accent on hover */}
                        <td className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
                        {/* Checkbox */}
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelect(id)}
                              aria-label={`Select ${title}`}
                              className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            />
                          </div>
                        </td>
                        {/* Thumbnail (aspect-square) */}
                        <td className="px-2 py-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white/[0.08] ring-1 ring-white/[0.12]">
                            {image ? (
                              <img
                                src={image}
                                alt=""
                                className="aspect-square h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-white/80" />
                            )}
                          </div>
                        </td>
                        {/* Title */}
                        <td className="px-4 py-3 text-white">
                          <span className="font-medium">{title}</span>
                        </td>
                        {/* Tag */}
                        <td className="px-4 py-3 text-white/85">
                          {tag || <span className="text-white/75">—</span>}
                        </td>
                        {/* Year (narrow, right-aligned) */}
                        <td className="max-w-[80px] px-4 py-3 text-right text-white/85 tabular-nums">
                          {year || <span className="text-white/75">—</span>}
                        </td>
                        {/* Status (dot with hover tooltip) */}
                        <td className="px-4 py-3">
                          <span className="group/status relative inline-flex items-center">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                published
                                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                                  : 'border-2 border-white/50 bg-transparent'
                              }`}
                              aria-label={published ? 'Published' : 'Draft'}
                            />
                            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/[0.15] bg-[#0f1629] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover/status:opacity-100">
                              {published ? 'Published' : 'Draft'}
                            </span>
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center justify-end gap-1 rounded-lg border border-transparent bg-white/[0.06] p-0.5 opacity-60 transition-opacity group-hover:opacity-100 group-hover:border-white/[0.12]">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(row)}
                              className="h-8 w-8 rounded-md text-white/90 hover:text-emerald-400 hover:bg-emerald-500/10"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <span className="mx-0.5 h-4 w-px bg-white/[0.15]" aria-hidden />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(row)}
                              className="h-8 w-8 rounded-md text-white/90 hover:text-red-400 hover:bg-red-500/10"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          {tableRows.length > 0 && (
            <div className="flex items-center justify-between text-xs text-white/80">
              <span>
                Showing {tableRows.length} of {filteredByStatus.length} project
                {tableRows.length !== 1 ? 's' : ''}
                {statusFilter !== 'all' && ` · ${statusFilter} only`}
              </span>
              {selectedIds.size > 0 && (
                <span className="text-emerald-400">{selectedIds.size} selected</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Project' : 'Add Project'}
        maxWidth="max-w-3xl"
      >
        <FormBuilder fields={fields} values={formValues} onChange={handleFieldChange} />
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.15] pt-4">
          <Button
            variant="ghost"
            onClick={() => setModalOpen(false)}
            className="rounded-xl text-white/85 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? 'Update' : 'Create'}
          </Button>
        </div>
      </Modal>

      {/* Delete confirmation (single) */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(o) => {
          setConfirmOpen(o);
          if (!o) setPendingDelete(null);
        }}
        title="Delete this project?"
        description="This action cannot be undone. The project will be permanently removed from your database."
        confirmText="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={performDelete}
      />

      {/* Bulk action confirmation */}
      <ConfirmDialog
        open={bulkAction !== null}
        onOpenChange={(o) => {
          if (!o) setBulkAction(null);
        }}
        title={
          bulkAction === 'delete'
            ? `Delete ${selectedIds.size} project${selectedIds.size !== 1 ? 's' : ''}?`
            : `Toggle published status for ${selectedIds.size} project${selectedIds.size !== 1 ? 's' : ''}?`
        }
        description={
          bulkAction === 'delete'
            ? 'This action cannot be undone. All selected projects will be permanently removed from your database.'
            : 'Each selected project will have its publication status flipped (Published ↔ Draft).'
        }
        confirmText={bulkAction === 'delete' ? 'Delete' : 'Toggle'}
        variant={bulkAction === 'delete' ? 'danger' : 'default'}
        loading={bulkActionLoading}
        onConfirm={performBulkAction}
      />
    </div>
  );
}
