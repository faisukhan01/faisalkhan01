'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Service name', required: true },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Service description' },
  { name: 'features', label: 'Features (comma-separated)', type: 'text', placeholder: 'Feature 1, Feature 2' },
  { name: 'icon', label: 'Icon', type: 'text', placeholder: 'code' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title' },
  { key: 'icon', label: 'Icon' },
  { key: 'sort_order', label: 'Order' },
  {
    key: 'published',
    label: 'Status',
    render: (v) => (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${v ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/30'}`}>
        {v ? 'Published' : 'Draft'}
      </span>
    ),
  },
];

export default function ServicesPage() {
  return (
    <CrudPage
      title="Services"
      apiPath="/api/admin/services"
      fields={fields}
      columns={columns}
      defaultValues={{ title: '', description: '', features: '', icon: 'code', sort_order: 0, published: true }}
      jsonFields={['features']}
      commaFields={['features']}
    />
  );
}
