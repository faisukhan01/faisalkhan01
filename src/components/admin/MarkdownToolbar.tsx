'use client';

import { Bold, Italic, Heading, List, Link as LinkIcon, Code } from 'lucide-react';

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}

type Action =
  | { type: 'wrap'; before: string; after: string }
  | { type: 'linePrefix'; prefix: string }
  | { type: 'link' };

const ACTIONS: Record<string, { label: string; icon: React.ElementType; action: Action }> = {
  bold: { label: 'Bold', icon: Bold, action: { type: 'wrap', before: '**', after: '**' } },
  italic: { label: 'Italic', icon: Italic, action: { type: 'wrap', before: '*', after: '*' } },
  heading: { label: 'Heading', icon: Heading, action: { type: 'linePrefix', prefix: '## ' } },
  list: { label: 'List', icon: List, action: { type: 'linePrefix', prefix: '- ' } },
  link: { label: 'Link', icon: LinkIcon, action: { type: 'link' } },
  code: { label: 'Code', icon: Code, action: { type: 'wrap', before: '`', after: '`' } },
};

export default function MarkdownToolbar({ textareaRef, value, onChange }: MarkdownToolbarProps) {
  const apply = (action: Action) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.slice(0, start);
    const selectedText = value.slice(start, end) || '';
    const after = value.slice(end);

    let newValue: string;
    let newCursorStart: number;
    let newCursorEnd: number;

    if (action.type === 'wrap') {
      const placeholder = selectedText || 'text';
      newValue = before + action.before + placeholder + action.after + after;
      newCursorStart = start + action.before.length;
      newCursorEnd = newCursorStart + placeholder.length;
    } else if (action.type === 'linePrefix') {
      // Find start of the current line and prepend the prefix
      const lineStart = before.lastIndexOf('\n') + 1;
      newValue = value.slice(0, lineStart) + action.prefix + value.slice(lineStart);
      // Shift cursor positions by the prefix length to preserve the selection
      newCursorStart = start + action.prefix.length;
      newCursorEnd = end + action.prefix.length;
    } else {
      // link — wrap selection (or 'text' placeholder) in [text](url)
      const placeholder = selectedText || 'text';
      const insert = `[${placeholder}](url)`;
      newValue = before + insert + after;
      // Select the 'url' part so the user can quickly type the destination
      const urlStart = start + 1 + placeholder.length + 2; // after `[text](`
      newCursorStart = urlStart;
      newCursorEnd = urlStart + 3; // select 'url'
    }

    onChange(newValue);

    // Restore focus and selection after React re-renders
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(newCursorStart, newCursorEnd);
    });
  };

  return (
    <div
      role="toolbar"
      aria-label="Markdown formatting"
      className="flex items-center gap-1 rounded-xl border border-white/[0.12] bg-white/[0.03] p-1 mb-2"
    >
      {Object.entries(ACTIONS).map(([key, { label, icon: Icon, action }]) => (
        <button
          key={key}
          type="button"
          title={label}
          aria-label={label}
          onClick={() => apply(action)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
