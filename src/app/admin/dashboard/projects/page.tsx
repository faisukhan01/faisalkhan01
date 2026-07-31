'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Project title', required: true },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Short description' },
  { name: 'image', label: 'Image URL', type: 'text', placeholder: '/project-1.jpg' },
  { name: 'gallery', label: 'Gallery (comma-separated URLs)', type: 'textarea', placeholder: 'url1, url2, url3' },
  { name: 'tag', label: 'Tag', type: 'text', placeholder: 'Full-Stack' },
  { name: 'year', label: 'Year', type: 'text', placeholder: '2025' },
  { name: 'client', label: 'Client', type: 'text', placeholder: 'Client name' },
  { name: 'duration', label: 'Duration', type: 'text', placeholder: '3 months' },
  { name: 'role', label: 'Role', type: 'text', placeholder: 'Full-Stack Developer' },
  { name: 'overview', label: 'Overview', type: 'textarea', placeholder: 'Project overview' },
  { name: 'challenge', label: 'Challenge', type: 'textarea', placeholder: 'The challenge' },
  { name: 'solution', label: 'Solution', type: 'textarea', placeholder: 'The solution' },
  { name: 'tech_stack', label: 'Tech Stack (comma-separated)', type: 'text', placeholder: 'React, TypeScript, Node.js' },
  { name: 'results', label: 'Results (JSON or one per line)', type: 'textarea', placeholder: 'Result 1\nResult 2' },
  { name: 'live_url', label: 'Live URL', type: 'text', placeholder: 'https://...' },
  { name: 'repo_url', label: 'Repo URL', type: 'text', placeholder: 'https://github.com/...' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
  { name: 'published', label: 'Published', type: 'switch' },
];

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title' },
  { key: 'tag', label: 'Tag' },
  { key: 'year', label: 'Year' },
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

export default function ProjectsPage() {
  return (
    <CrudPage
      title="Projects"
      apiPath="/api/admin/projects"
      fields={fields}
      columns={columns}
      defaultValues={{ title: '', description: '', image: '/project-1.jpg', gallery: '', tag: 'Full-Stack', year: '2025', client: '', duration: '', role: 'Full-Stack Developer', overview: '', challenge: '', solution: '', tech_stack: '', results: '', live_url: '#', repo_url: '#', sort_order: 0, published: true }}
      jsonFields={['gallery', 'tech_stack', 'results']}
      commaFields={['tech_stack']}
      idType="string"
    />
  );
}
