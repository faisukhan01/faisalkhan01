'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable, { ColumnDef } from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import FormBuilder, { FieldDef } from '@/components/admin/FormBuilder';

interface UseCrudPageOptions {
  apiPath: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  defaultValues: Record<string, unknown>;
  jsonFields?: string[];
  commaFields?: string[];
  idType?: 'string' | 'number';
}

export function useCrudPage({
  apiPath,
  fields,
  defaultValues,
  jsonFields = [],
  commaFields = [],
  idType = 'number',
}: UseCrudPageOptions) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>(defaultValues);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiPath);
      const json = await res.json();
      if (json.ok) setData(json.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiPath]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      if (jsonFields.includes(f.name) && typeof v === 'string') {
        try { v = JSON.parse(v); } catch { /* keep as string */ }
      }
      // Convert array fields to comma-separated string for editing
      if (commaFields.includes(f.name) && Array.isArray(v)) {
        v = v.join(', ');
      }
      // Convert JSON arrays to comma-separated for editing
      if (jsonFields.includes(f.name) && Array.isArray(v)) {
        v = v.map((item: unknown) => typeof item === 'object' ? JSON.stringify(item) : String(item)).join('\n');
      }
      vals[f.name] = v;
    }
    setFormValues(vals);
    setModalOpen(true);
  };

  const handleDelete = async (row: Record<string, unknown>) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const id = row.id;
      await fetch(`${apiPath}?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
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
      for (const f of commaFields) {
        const v = payload[f];
        if (typeof v === 'string') {
          payload[f] = v.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }

      // Convert JSON fields to JSON strings
      for (const f of jsonFields) {
        const v = payload[f];
        if (typeof v === 'string') {
          // Try to parse as JSON first, if it fails, split by newlines
          try {
            const parsed = JSON.parse(v);
            payload[f] = parsed;
          } catch {
            // Split by newlines for array content
            payload[f] = v.split('\n').map((s: string) => s.trim()).filter(Boolean);
          }
        }
      }

      // Convert switch fields
      for (const f of fields) {
        if (f.type === 'switch') {
          payload[f.name] = payload[f.name] ? 1 : 0;
        }
      }

      if (editing) {
        // Update
        payload.id = editing.id;
        await fetch(apiPath, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        await fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return {
    data,
    loading,
    modalOpen,
    setModalOpen,
    editing,
    formValues,
    saving,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFieldChange,
    handleSave,
    fetchData,
  };
}

interface CrudPageProps {
  title: string;
  apiPath: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  defaultValues: Record<string, unknown>;
  jsonFields?: string[];
  commaFields?: string[];
  idType?: 'string' | 'number';
  addLabel?: string;
}

export default function CrudPage({
  title,
  apiPath,
  fields,
  columns,
  defaultValues,
  jsonFields,
  commaFields,
  idType,
  addLabel,
}: CrudPageProps) {
  const {
    data,
    loading,
    modalOpen,
    setModalOpen,
    editing,
    formValues,
    saving,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFieldChange,
    handleSave,
  } = useCrudPage({
    apiPath,
    fields,
    defaultValues,
    jsonFields,
    commaFields,
    idType,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-white/40">
            {data.length} item{data.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          {addLabel || `Add ${title.slice(0, -1)}`}
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
          searchPlaceholder={`Search ${title.toLowerCase()}...`}
        />
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}
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
            className="rounded-xl text-white/40 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? 'Update' : 'Create'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
