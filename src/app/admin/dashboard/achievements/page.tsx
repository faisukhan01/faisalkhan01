'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'value', label: 'Value', type: 'text', placeholder: '5+', required: true },
  { name: 'label', label: 'Label', type: 'text', placeholder: 'Years Experience' },
  { name: 'detail', label: 'Detail', type: 'text', placeholder: 'Building modern web apps' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'value', label: 'Value' },
  { key: 'label', label: 'Label' },
  { key: 'detail', label: 'Detail' },
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

export default function AchievementsPage() {
  return (
    <CrudPage
      title="Achievements"
      apiPath="/api/admin/achievements"
      fields={fields}
      columns={columns}
      defaultValues={{ value: '', label: '', detail: '', sort_order: 0, published: true }}
    />
  );
}
