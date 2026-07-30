'use client';

import CrudPage from '@/components/admin/CrudPage';
import type { FieldDef, ColumnDef } from '@/components/admin/CrudPage';

const fields: FieldDef[] = [
  { name: 'stat_key', label: 'Stat Key', type: 'text', placeholder: 'subscribers', required: true },
  { name: 'stat_value', label: 'Stat Value', type: 'text', placeholder: '2,500+' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
];

const columns: ColumnDef[] = [
  { key: 'stat_key', label: 'Key' },
  { key: 'stat_value', label: 'Value' },
  { key: 'sort_order', label: 'Order' },
];

export default function NewsletterStatsPage() {
  return (
    <CrudPage
      title="Newsletter Stats"
      apiPath="/api/admin/newsletter-stats"
      fields={fields}
      columns={columns}
      defaultValues={{ stat_key: '', stat_value: '', sort_order: 0 }}
      addLabel="Add Stat"
    />
  );
}
