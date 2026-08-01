'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'year', label: 'Year', type: 'text', placeholder: '2024' },
  { name: 'duration', label: 'Duration', type: 'text', placeholder: '6 months' },
  { name: 'company', label: 'Company', type: 'text', placeholder: 'Company name' },
  { name: 'role', label: 'Role', type: 'text', placeholder: 'Full-Stack Developer' },
  { name: 'tech', label: 'Tech', type: 'text', placeholder: 'React, Node.js' },
  { name: 'is_ongoing', label: 'Ongoing', type: 'switch' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'year', label: 'Year' },
  { key: 'company', label: 'Company' },
  { key: 'role', label: 'Role' },
  { key: 'duration', label: 'Duration' },
  {
    key: 'is_ongoing',
    label: 'Ongoing',
    render: (v) => (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${v ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/30'}`}>
        {v ? 'Yes' : 'No'}
      </span>
    ),
  },
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

export default function WorkExperiencePage() {
  return (
    <CrudPage
      title="Work Experience"
      apiPath="/api/admin/work-experience"
      fields={fields}
      columns={columns}
      defaultValues={{ year: '', duration: '', company: '', role: '', tech: '', is_ongoing: false, sort_order: 0, published: true }}
    />
  );
}
