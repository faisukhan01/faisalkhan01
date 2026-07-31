'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'label', label: 'Label', type: 'text', placeholder: 'Local', required: true },
  { name: 'timezone', label: 'Timezone', type: 'text', placeholder: 'Asia/Karachi' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'label', label: 'Label' },
  { key: 'timezone', label: 'Timezone' },
  { key: 'sort_order', label: 'Order' },
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

export default function TimezonesPage() {
  return (
    <CrudPage
      title="Timezones"
      apiPath="/api/admin/timezones"
      fields={fields}
      columns={columns}
      defaultValues={{ label: '', timezone: '', sort_order: 0, published: true }}
    />
  );
}
