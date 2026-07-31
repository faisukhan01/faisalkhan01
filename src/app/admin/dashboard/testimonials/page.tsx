'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'author', label: 'Author', type: 'text', placeholder: 'Author name', required: true },
  { name: 'role', label: 'Role', type: 'text', placeholder: 'CEO at Company' },
  { name: 'quote', label: 'Quote', type: 'textarea', placeholder: 'Testimonial quote' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'author', label: 'Author' },
  { key: 'role', label: 'Role' },
  {
    key: 'quote',
    label: 'Quote',
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

export default function TestimonialsPage() {
  return (
    <CrudPage
      title="Testimonials"
      apiPath="/api/admin/testimonials"
      fields={fields}
      columns={columns}
      defaultValues={{ author: '', role: '', quote: '', sort_order: 0, published: true }}
    />
  );
}
