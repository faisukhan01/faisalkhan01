'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'name', label: 'Display Name', type: 'text', placeholder: 'GitHub', required: true },
  { name: 'platform', label: 'Platform', type: 'text', placeholder: 'github' },
  { name: 'url', label: 'URL', type: 'text', placeholder: 'https://github.com/...' },
  { name: 'icon', label: 'Icon', type: 'text', placeholder: 'github' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'name', label: 'Name' },
  { key: 'platform', label: 'Platform' },
  { key: 'url', label: 'URL', render: (v) => <span className="max-w-[200px] truncate text-muted-foreground">{String(v ?? '')}</span> },
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

export default function SocialLinksPage() {
  return (
    <CrudPage
      title="Social Links"
      apiPath="/api/admin/social-links"
      fields={fields}
      columns={columns}
      defaultValues={{ name: '', platform: '', url: '', icon: '', sort_order: 0, published: true }}
    />
  );
}
