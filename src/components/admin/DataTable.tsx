'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (row: Record<string, unknown>) => void;
  searchPlaceholder?: string;
  searchKeys?: string[];
  pageSize?: number;
}

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
  searchKeys,
  pageSize = 10,
}: DataTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const keys = searchKeys || columns.map((c) => c.key);

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q))
    );
  }, [data, search, keys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av ?? '').localeCompare(String(bv ?? ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder={searchPlaceholder}
          className="rounded-xl border-outline-2 bg-surface-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-outline-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-2 bg-surface-2">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium text-muted-foreground ${col.sortable !== false ? 'cursor-pointer select-none hover:text-foreground' : ''}`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <motion.tr
                  key={String(row.id ?? i)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-outline-1 transition-colors hover:bg-surface-2"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-foreground">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(row)}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(row)}
                            className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {sorted.length} item{sorted.length !== 1 ? 's' : ''} &middot; Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={page === 0}
              onClick={() => setPage(0)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
