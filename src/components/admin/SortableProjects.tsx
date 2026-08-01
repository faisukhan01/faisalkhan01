'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Image as ImageIcon } from 'lucide-react';

interface SortableProjectsProps {
  projects: Record<string, unknown>[];
  onReorder: (newOrder: Record<string, unknown>[]) => void;
}

interface SortableItemProps {
  project: Record<string, unknown>;
}

function SortableItem({ project }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(project.id) });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const title = String(project.title ?? 'Untitled');
  const tag = String(project.tag ?? '');
  const year = String(project.year ?? '');
  const image = project.image ? String(project.image) : '';
  const published = project.published;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-xl border bg-white/[0.03] p-3 transition-colors ${
        isDragging
          ? 'border-emerald-500/60 bg-emerald-500/[0.06] shadow-lg shadow-emerald-500/10'
          : 'border-white/[0.12] hover:border-white/[0.18] hover:bg-white/[0.05]'
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
        className="flex h-8 w-6 cursor-grab items-center justify-center text-white/40 transition-colors hover:text-white/80 active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Thumbnail */}
      <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.06]">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-4 w-4 text-white/40" />
        )}
      </div>

      {/* Title + tag */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{title}</p>
        {(tag || year) && (
          <p className="truncate text-xs text-white/60">
            {[tag, year].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      {/* Status badge */}
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
          published
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-white/[0.06] text-white/65'
        }`}
      >
        {published ? 'Published' : 'Draft'}
      </span>
    </div>
  );
}

export default function SortableProjects({ projects, onReorder }: SortableProjectsProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>(projects);

  // Keep local state in sync if the parent's projects prop changes (e.g. after fetch)
  // Use a key based on length + ids to detect external changes.
  const projectKey = projects.map((p) => p.id).join('|');
  const itemKey = items.map((p) => p.id).join('|');
  if (projectKey !== itemKey) {
    setItems(projects);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => String(p.id) === String(active.id));
    const newIndex = items.findIndex((p) => String(p.id) === String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    onReorder(next);
  };

  return (
    <div className="rounded-xl border border-white/[0.12] bg-white/[0.02] p-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((p) => String(p.id))}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((project) => (
              <SortableItem key={String(project.id)} project={project} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <div className="px-4 py-12 text-center text-sm text-white/60">
          No projects to reorder. Add some projects first.
        </div>
      )}
    </div>
  );
}
