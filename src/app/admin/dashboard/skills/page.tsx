'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'category', label: 'Category', type: 'text', placeholder: 'Frontend', required: true },
  { name: 'count', label: 'Count', type: 'text', placeholder: '12' },
  { name: 'proficiency', label: 'Proficiency', type: 'slider', min: 0, max: 100 },
  { name: 'technologies', label: 'Technologies (comma-separated)', type: 'text', placeholder: 'React, Vue, Angular' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'category', label: 'Category' },
  { key: 'count', label: 'Count' },
  {
    key: 'proficiency',
    label: 'Proficiency',
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 rounded-full bg-white/[0.08]">
          <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${Number(v || 0)}%` }} />
        </div>
        <span className="text-xs text-white/40">{String(v ?? 0)}%</span>
      </div>
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

export default function SkillsPage() {
  return (
    <CrudPage
      title="Skills"
      apiPath="/api/admin/skills"
      fields={fields}
      columns={columns}
      defaultValues={{ category: '', count: '0', proficiency: 50, technologies: '', sort_order: 0, published: true }}
      jsonFields={['technologies']}
      commaFields={['technologies']}
    />
  );
}
