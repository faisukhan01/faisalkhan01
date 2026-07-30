'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Book title', required: true },
  { name: 'author', label: 'Author', type: 'text', placeholder: 'Author name' },
  { name: 'progress', label: 'Progress', type: 'slider', min: 0, max: 100 },
  { name: 'gradient', label: 'Gradient', type: 'text', placeholder: 'from-emerald-700/40 to-teal-900/40' },
  { name: 'accent', label: 'Accent', type: 'text', placeholder: 'bg-emerald-500/60' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  {
    key: 'progress',
    label: 'Progress',
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 rounded-full bg-surface-4">
          <div className="h-1.5 rounded-full bg-foreground" style={{ width: `${Number(v || 0)}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{String(v ?? 0)}%</span>
      </div>
    ),
  },
  {
    key: 'published',
    label: 'Status',
    render: (v) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface-4 text-muted-foreground'}`}>
        {v ? 'Published' : 'Draft'}
      </span>
    ),
  },
];

export default function ReadingListPage() {
  return (
    <CrudPage
      title="Reading List"
      apiPath="/api/admin/reading-list"
      fields={fields}
      columns={columns}
      defaultValues={{ title: '', author: '', progress: 0, gradient: 'from-emerald-700/40 to-teal-900/40', accent: 'bg-emerald-500/60', sort_order: 0, published: true }}
    />
  );
}
