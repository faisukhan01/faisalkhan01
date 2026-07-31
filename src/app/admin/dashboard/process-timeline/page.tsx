'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'step', label: 'Step Number', type: 'number', min: 1 },
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Discovery', required: true },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'What happens in this step...' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'step', label: 'Step' },
  { key: 'title', label: 'Title' },
  {
    key: 'description',
    label: 'Description',
    render: (v) => <span className="line-clamp-2 max-w-xs text-muted-foreground">{String(v ?? '')}</span>,
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

export default function ProcessTimelinePage() {
  return (
    <CrudPage
      title="Process Timeline"
      apiPath="/api/admin/process-timeline"
      fields={fields}
      columns={columns}
      defaultValues={{ step: 1, title: '', description: '', sort_order: 0, published: true }}
    />
  );
}
