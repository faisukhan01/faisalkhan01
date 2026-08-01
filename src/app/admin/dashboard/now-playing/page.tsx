'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'type', label: 'Type', type: 'select', options: [
    { label: 'Learning', value: 'learning' },
    { label: 'Listening', value: 'listening' },
    { label: 'Reading', value: 'reading' },
    { label: 'Building', value: 'building' },
  ]},
  { name: 'label', label: 'Label', type: 'text', placeholder: 'Currently learning' },
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Advanced TypeScript' },
  { name: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Course on Udemy' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'type', label: 'Type' },
  { key: 'title', label: 'Title' },
  { key: 'subtitle', label: 'Subtitle' },
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

export default function NowPlayingPage() {
  return (
    <CrudPage
      title="Now Playing"
      apiPath="/api/admin/now-playing"
      fields={fields}
      columns={columns}
      defaultValues={{ type: 'learning', label: '', title: '', subtitle: '', sort_order: 0, published: true }}
    />
  );
}
