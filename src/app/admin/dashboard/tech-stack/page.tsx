'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'React', required: true },
  { name: 'icon', label: 'Icon', type: 'text', placeholder: 'react' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'name', label: 'Name' },
  { key: 'icon', label: 'Icon' },
  { key: 'sort_order', label: 'Order' },
  {
    key: 'published',
    label: 'Status',
    render: (v) => (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${v ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/55'}`}>
        {v ? 'Published' : 'Draft'}
      </span>
    ),
  },
];

export default function TechStackPage() {
  return (
    <CrudPage
      title="Tech Stack"
      apiPath="/api/admin/tech-stack"
      fields={fields}
      columns={columns}
      defaultValues={{ name: '', icon: '', sort_order: 0, published: true }}
    />
  );
}
