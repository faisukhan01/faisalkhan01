'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'skill', label: 'Skill', type: 'text', placeholder: 'React', required: true },
  { name: 'value', label: 'Value', type: 'slider', min: 0, max: 100 },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'skill', label: 'Skill' },
  {
    key: 'value',
    label: 'Value',
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 rounded-full bg-white/[0.08]">
          <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${Number(v || 0)}%` }} />
        </div>
        <span className="text-xs text-white/60">{String(v ?? 0)}</span>
      </div>
    ),
  },
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

export default function SkillsRadarPage() {
  return (
    <CrudPage
      title="Skills Radar"
      apiPath="/api/admin/skills-radar"
      fields={fields}
      columns={columns}
      defaultValues={{ skill: '', value: 50, sort_order: 0, published: true }}
    />
  );
}
