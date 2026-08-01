'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DataTable, { ColumnDef } from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import FormBuilder, { FieldDef } from '@/components/admin/FormBuilder';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

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

const columns: ColumnDef[] = [
  {
    key: 'image',
    label: 'Thumbnail',
    render: (v) => (
      <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-lg bg-white/[0.04]">
        {v ? (
          <img src={String(v)} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-4 w-4 text-white/40" />
        )}
      </div>
    ),
  },
  { key: 'title', label: 'Title' },
  { key: 'tag', label: 'Tag' },
  { key: 'year', label: 'Year' },
  {
    key: 'published',
    label: 'Status',
    dotColor: (v) => (v ? '#34d399' : '#64748b'),
    render: (v) => (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${v ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/50'}`}>
        {v ? 'Published' : 'Draft'}
      </span>
    ),
  },
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

export default function ProjectsPage() {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>(defaultValues);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditing(null);
    setFormValues({ ...defaultValues });
    setModalOpen(true);
  };

  const handleEdit = (row: Record<string, unknown>) => {
    setEditing(row);
    const vals: Record<string, unknown> = {};
    for (const f of fields) {
      let v = row[f.name];
      // Parse JSON fields for display
      if (['gallery', 'tech_stack', 'results'].includes(f.name) && typeof v === 'string') {
        try { v = JSON.parse(v); } catch { /* keep as string */ }
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

  const handleDelete = (row: Record<string, unknown>) => {
    setPendingDelete(row);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const id = pendingDelete.id;
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
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

  return (
    <div className="space-y-5">
      {/* Compact header — page name is already shown in the top admin header */}
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {data.length} project{data.length !== 1 ? 's' : ''}
        </span>
        <Button
          onClick={handleAdd}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search projects..."
        />
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Project' : 'Add Project'}
        maxWidth="max-w-3xl"
      >
        <FormBuilder
          fields={fields}
          values={formValues}
          onChange={handleFieldChange}
        />
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
          <Button
            variant="ghost"
            onClick={() => setModalOpen(false)}
            className="rounded-xl text-white/60 hover:text-white hover:bg-white/10"
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

      {/* Delete confirmation */}
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
    </div>
  );
}
