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
      className={`group flex items-center gap-3 rounded-xl border bg-white/[0.05] p-3 transition-all ${
        isDragging
          ? 'border-emerald-500/60 bg-emerald-500/[0.08] shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/30'
          : 'border-white/[0.15] hover:border-white/[0.18] hover:bg-white/[0.05]'
      }`}
    >
      {/* Drag handle (six-dot grip) — always visible, emphasized in reorder mode */}
      <button
        type="button"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
        className={`flex h-8 w-7 cursor-grab items-center justify-center rounded-md transition-colors touch-none ${
          isDragging
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'text-white/80 hover:bg-white/[0.08] hover:text-emerald-400 active:cursor-grabbing'
        }`}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Thumbnail (aspect-square) */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.08] ring-1 ring-white/[0.12]">
        {image ? (
          <img src={image} alt="" className="aspect-square h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-4 w-4 text-white/80" />
        )}
      </div>

      {/* Title + tag */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{title}</p>
        {(tag || year) && (
          <p className="truncate text-xs text-white/80">
            {[tag, year].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      {/* Status dot with hover tooltip (matches table view) */}
      <span className="group/status relative inline-flex items-center">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            published
              ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
              : 'border-2 border-white/50 bg-transparent'
          }`}
          aria-label={published ? 'Published' : 'Draft'}
        />
        <span className="pointer-events-none absolute right-0 top-full z-20 mt-1.5 whitespace-nowrap rounded-md border border-white/[0.15] bg-[#0f1629] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover/status:opacity-100">
          {published ? 'Published' : 'Draft'}
        </span>
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
    <div className="rounded-xl border border-white/[0.15] bg-white/[0.04] p-3">
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
        <div className="px-4 py-12 text-center text-sm text-white/80">
          No projects to reorder. Add some projects first.
        </div>
      )}
    </div>
  );
}
