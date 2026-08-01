'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Article title', required: true },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'Short excerpt' },
  { name: 'content', label: 'Content (one paragraph per line)', type: 'textarea', placeholder: 'Paragraph 1\nParagraph 2' },
  { name: 'tag', label: 'Tag', type: 'text', placeholder: 'General' },
  { name: 'date', label: 'Date', type: 'text', placeholder: 'Jan 2025' },
  { name: 'read_time', label: 'Read Time', type: 'text', placeholder: '5 min' },
  { name: 'author', label: 'Author', type: 'text', placeholder: 'Faisal Khan' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title' },
  { key: 'tag', label: 'Tag' },
  { key: 'date', label: 'Date' },
  { key: 'read_time', label: 'Read Time' },
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

export default function ArticlesPage() {
  return (
    <CrudPage
      title="Articles"
      apiPath="/api/admin/articles"
      fields={fields}
      columns={columns}
      defaultValues={{ title: '', excerpt: '', content: '', tag: 'General', date: '', read_time: '5 min', author: 'Faisal Khan', sort_order: 0, published: true }}
      jsonFields={['content']}
      idType="string"
      siteSection="articles"
    />
  );
}
