'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  /** Optional colored dot rendered before the cell content (e.g. for status columns). */
  dotColor?: (value: unknown, row: Record<string, unknown>) => string | undefined;
}

export interface FilterDef {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface DataTableProps {
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (row: Record<string, unknown>) => void;
  searchPlaceholder?: string;
  searchKeys?: string[];
  pageSize?: number;
  /** Enable zebra striping for alternating rows. */
  zebra?: boolean;
  /** Optional filter dropdowns rendered above the table. */
  filter?: FilterDef[];
}

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
  searchKeys,
  pageSize = 10,
  zebra = true,
  filter,
}: DataTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const keys = searchKeys || columns.map((c) => c.key);

  const filtered = useMemo(() => {
    let result = data;

    // Apply filters (skip 'all' or empty values)
    const activeFilters = Object.entries(filters).filter(
      ([, v]) => v && v !== 'all' && v !== ''
    );
    if (activeFilters.length > 0) {
      result = result.filter((row) =>
        activeFilters.every(([key, val]) => String(row[key] ?? '') === val)
      );
    }

    // Apply search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q))
      );
    }

    return result;
  }, [data, search, keys, filters]);

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(0);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v && v !== 'all' && v !== ''
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder={searchPlaceholder}
          className="rounded-xl border-white/[0.15] bg-white/[0.06] pl-10 text-sm text-white placeholder:text-white/75 focus:border-emerald-500/50 focus:ring-emerald-500/20"
        />
      </div>

      {/* Filters */}
      {filter && filter.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filter.map((f) => (
            <div key={f.key} className="flex items-center gap-2">
              <label className="text-xs font-medium text-white/70">{f.label}:</label>
              <select
                value={filters[f.key] || 'all'}
                onChange={(e) => handleFilterChange(f.key, e.target.value)}
                className="rounded-lg border border-white/[0.15] bg-white/[0.06] px-2.5 py-1.5 text-xs font-medium text-white outline-none transition-colors hover:border-white/[0.25] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              >
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0f1629] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 gap-1 rounded-lg px-2 text-xs font-medium text-white/90 hover:text-white hover:bg-white/10"
            >
              <X className="h-3 w-3" />
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.15]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.15] bg-white/[0.05]">
              {columns.map((col) => {
                const isSortable = col.sortable !== false;
                const isActive = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left font-semibold text-white ${isSortable ? 'cursor-pointer select-none hover:text-emerald-400' : ''}`}
                    onClick={() => isSortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {isSortable && (
                        isActive ? (
                          sortDir === 'asc' ? <ChevronUp className="h-3 w-3 text-emerald-400" /> : <ChevronDown className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <ChevronDown className="h-3 w-3 text-white/50" />
                        )
                      )}
                    </div>
                  </th>
                );
              })}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right font-semibold text-white">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-4 py-12 text-center text-white/90"
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
                  className={`group relative border-b border-white/[0.1] transition-colors ${
                    zebra && i % 2 === 1 ? 'bg-white/[0.05]' : ''
                  } hover:bg-emerald-500/[0.08]`}
                >
                  {/* Left accent on hover */}
                  <td className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {columns.map((col) => {
                    const dot = col.dotColor ? col.dotColor(row[col.key], row) : undefined;
                    return (
                      <td key={col.key} className="px-4 py-3 text-white/90">
                        <div className="flex items-center gap-2">
                          {dot && (
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: dot }}
                              aria-hidden
                            />
                          )}
                          <span className="min-w-0">
                            {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1 rounded-lg border border-transparent bg-white/[0.06] p-0.5 opacity-50 transition-opacity group-hover:opacity-100 group-hover:border-white/[0.1]">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(row)}
                            className="h-8 w-8 rounded-md text-white/90 hover:text-emerald-400 hover:bg-emerald-500/10"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && onDelete && (
                          <span className="mx-0.5 h-4 w-px bg-white/[0.12]" aria-hidden />
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(row)}
                            className="h-8 w-8 rounded-md text-white/90 hover:text-red-400 hover:bg-red-500/10"
                            title="Delete"
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
        <div className="flex items-center justify-between text-sm text-white/85">
          <span>
            {sorted.length} item{sorted.length !== 1 ? 's' : ''} &middot; Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={page === 0}
              onClick={() => setPage(0)}
              className="h-8 w-8 text-white/85 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 w-8 text-white/85 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 w-8 text-white/85 hover:text-white hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
              className="h-8 w-8 text-white/85 hover:text-white hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
