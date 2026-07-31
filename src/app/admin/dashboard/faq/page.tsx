'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'question', label: 'Question', type: 'text', placeholder: 'What is your question?', required: true },
  { name: 'answer', label: 'Answer', type: 'textarea', placeholder: 'The answer...' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  {
    key: 'question',
    label: 'Question',
    render: (v) => <span className="max-w-xs truncate">{String(v ?? '')}</span>,
  },
  {
    key: 'answer',
    label: 'Answer',
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

export default function FAQPage() {
  return (
    <CrudPage
      title="FAQ"
      apiPath="/api/admin/faq"
      fields={fields}
      columns={columns}
      defaultValues={{ question: '', answer: '', sort_order: 0, published: true }}
    />
  );
}
