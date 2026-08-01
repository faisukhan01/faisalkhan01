'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, FolderKanban, FileText, Mail, Server, Settings,
  Pencil, UserPlus, Quote, Code2, Trash2, Plus, RefreshCw,
  Clock, Filter, ChevronDown, Award, Briefcase, HelpCircle,
  Music, Cpu, GitBranch, Link, BookOpen, Clock as ClockIcon,
  BarChart3, User, X, Loader2
} from 'lucide-react';

interface ActivityLogEntry {
  id: number;
  action_type: string;
  entity_type: string;
  entity_name: string;
  details: string;
  created_at: string;
}

interface ActivityFilters {
  actionTypes: string[];
  entityTypes: string[];
}

// Map entity_type to icon
const entityIconMap: Record<string, React.ElementType> = {
  project: FolderKanban,
  article: FileText,
  service: Server,
  contact: Mail,
  testimonial: Quote,
  skill: Code2,
  settings: Settings,
  achievement: Award,
  work_experience: Briefcase,
  faq: HelpCircle,
  now_playing: Music,
  tech_stack: Cpu,
  process_timeline: GitBranch,
  social_link: Link,
  reading_list: BookOpen,
  timezone: ClockIcon,
  newsletter_stats: BarChart3,
  hero_role: User,
  profile: User,
};

// Map action_type to color
const actionColorMap: Record<string, { bg: string; text: string; border: string }> = {
  create: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  update: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20' },
  delete: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/20' },
};

// Map action_type to label
const actionLabelMap: Record<string, string> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
};

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [filters, setFilters] = useState<ActivityFilters>({ actionTypes: [], entityTypes: [] });
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>('');
  const [entityFilter, setEntityFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.set('action_type', actionFilter);
      if (entityFilter) params.set('entity_type', entityFilter);
      params.set('limit', '200');

      const res = await fetch(`/api/admin/activity?${params.toString()}`);
      const json = await res.json();
      if (json.ok) {
        setActivities(json.data || []);
        if (json.filters) {
          setFilters(json.filters);
        }
      }
    } catch (err) {
      console.error('Failed to fetch activity log:', err);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, entityFilter]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp + 'Z').getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  const formatFullDate = (timestamp: string) => {
    return new Date(timestamp + 'Z').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group activities by date
  const groupedActivities = activities.reduce<Record<string, ActivityLogEntry[]>>((acc, activity) => {
    const date = new Date(activity.created_at + 'Z').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  const clearFilters = () => {
    setActionFilter('');
    setEntityFilter('');
  };

  const hasActiveFilters = actionFilter || entityFilter;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {activities.length} entr{activities.length !== 1 ? 'ies' : 'y'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400 transition-all hover:bg-rose-500/20"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
              showFilters
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-white/[0.12] bg-white/[0.06] text-white/90 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white">
                {(actionFilter ? 1 : 0) + (entityFilter ? 1 : 0)}
              </span>
            )}
            <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={fetchActivities}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/90 transition-all hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-2xl border border-white/[0.15] bg-white/[0.05] p-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-white/85">Action Type</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full rounded-xl border border-white/[0.12] bg-white/[0.06] px-3 py-2 text-sm text-white/90 outline-none transition-colors focus:border-emerald-500/30"
              >
                <option value="">All actions</option>
                {filters.actionTypes.map((type) => (
                  <option key={type} value={type}>
                    {actionLabelMap[type] || type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-white/85">Entity Type</label>
              <select
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
                className="w-full rounded-xl border border-white/[0.12] bg-white/[0.06] px-3 py-2 text-sm text-white/90 outline-none transition-colors focus:border-emerald-500/30"
              >
                <option value="">All entities</option>
                {filters.entityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity Timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
        </div>
      ) : activities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.15] bg-white/[0.05] py-16 text-center"
        >
          <Activity className="h-12 w-12 text-white/65" />
          <h3 className="mt-4 text-lg font-semibold text-white/85">No activity yet</h3>
          <p className="mt-1 text-sm text-white/60">
            {hasActiveFilters
              ? 'No activities match your current filters. Try clearing them.'
              : 'Activity will appear here when you create, update, or delete content.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, entries]) => (
            <div key={date}>
              {/* Date header */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.1] px-3 py-1">
                  <Clock className="h-3 w-3 text-white/60" />
                  <span className="text-xs font-medium text-white/85">{date}</span>
                </div>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {/* Timeline entries */}
              <div className="space-y-0">
                {entries.map((entry, index) => {
                  const Icon = entityIconMap[entry.entity_type] || Pencil;
                  const actionColors = actionColorMap[entry.action_type] || actionColorMap.update;
                  const actionLabel = actionLabelMap[entry.action_type] || entry.action_type;
                  const isLast = index === entries.length - 1;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="relative flex gap-4"
                    >
                      {/* Timeline line + dot */}
                      <div className="flex flex-col items-center">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${actionColors.border} ${actionColors.bg} z-10`}>
                          <Icon className={`h-4 w-4 ${actionColors.text}`} />
                        </div>
                        {!isLast && (
                          <div className="w-px flex-1 bg-white/[0.06] my-1" />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-4 flex-1 min-w-0 ${isLast ? '' : ''}`}>
                        <div className="rounded-xl border border-white/[0.1] bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.06]">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${actionColors.bg} ${actionColors.text}`}>
                                  {entry.action_type === 'create' && <Plus className="h-2.5 w-2.5" />}
                                  {entry.action_type === 'delete' && <Trash2 className="h-2.5 w-2.5" />}
                                  {entry.action_type === 'update' && <Pencil className="h-2.5 w-2.5" />}
                                  {actionLabel}
                                </span>
                                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/75">
                                  {entry.entity_type.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="mt-1.5 text-sm font-medium text-white/90 truncate">
                                {entry.entity_name}
                              </p>
                              {entry.details && (
                                <p className="mt-1 text-xs text-white/75 line-clamp-2">
                                  {entry.details}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0" title={formatFullDate(entry.created_at)}>
                              <span className="text-[10px] text-white/75">
                                {formatTimeAgo(entry.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
