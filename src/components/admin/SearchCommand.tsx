'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  FolderKanban, FileText, Mail, Server, Quote, Code2, Briefcase, Search,
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}

interface SearchResults {
  projects?: SearchResult[];
  articles?: SearchResult[];
  services?: SearchResult[];
  contacts?: SearchResult[];
  testimonials?: SearchResult[];
  skills?: SearchResult[];
  work?: SearchResult[];
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  projects: { label: 'Projects', icon: FolderKanban, color: 'text-emerald-400' },
  articles: { label: 'Articles', icon: FileText, color: 'text-amber-400' },
  services: { label: 'Services', icon: Server, color: 'text-sky-400' },
  contacts: { label: 'Contacts', icon: Mail, color: 'text-rose-400' },
  testimonials: { label: 'Testimonials', icon: Quote, color: 'text-purple-400' },
  skills: { label: 'Skills', icon: Code2, color: 'text-cyan-400' },
  work: { label: 'Work Experience', icon: Briefcase, color: 'text-orange-400' },
};

// Quick navigation items
const quickNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Projects', href: '/admin/dashboard/projects', icon: 'FolderKanban' },
  { label: 'Articles', href: '/admin/dashboard/articles', icon: 'FileText' },
  { label: 'Services', href: '/admin/dashboard/services', icon: 'Server' },
  { label: 'Form Submissions', href: '/admin/dashboard/contacts', icon: 'Mail' },
  { label: 'Testimonials', href: '/admin/dashboard/testimonials', icon: 'Quote' },
  { label: 'Work Experience', href: '/admin/dashboard/work-experience', icon: 'Briefcase' },
  { label: 'Achievements', href: '/admin/dashboard/achievements', icon: 'Award' },
  { label: 'Skills', href: '/admin/dashboard/skills', icon: 'Code2' },
  { label: 'Skills Radar', href: '/admin/dashboard/skills-radar', icon: 'Radar' },
  { label: 'Hero Roles', href: '/admin/dashboard/hero-roles', icon: 'User' },
  { label: 'Tech Stack', href: '/admin/dashboard/tech-stack', icon: 'Cpu' },
  { label: 'Process Timeline', href: '/admin/dashboard/process-timeline', icon: 'GitBranch' },
  { label: 'Now Playing', href: '/admin/dashboard/now-playing', icon: 'Music' },
  { label: 'FAQ', href: '/admin/dashboard/faq', icon: 'HelpCircle' },
  { label: 'Social Links', href: '/admin/dashboard/social-links', icon: 'Link' },
  { label: 'Reading List', href: '/admin/dashboard/reading-list', icon: 'BookOpen' },
  { label: 'Timezones', href: '/admin/dashboard/timezones', icon: 'Clock' },
  { label: 'Newsletter Stats', href: '/admin/dashboard/newsletter-stats', icon: 'BarChart3' },
  { label: 'Profile', href: '/admin/dashboard/profile', icon: 'User' },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: 'Settings' },
];

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({});
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`);
        const json = await res.json();
        if (json.ok) {
          setResults(json.results || {});
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback((href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  }, [router]);

  const hasResults = Object.values(results).some((arr) => arr && arr.length > 0);

  // Filter quick nav items based on query
  const filteredNav = query.trim()
    ? quickNav.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : quickNav;

  return (
    <CommandDialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery('');
      }}
      title="Search"
      description="Search across all content and navigate to admin pages"
      className="bg-[#0f1629] border-white/[0.08] text-white"
    >
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search projects, articles, contacts..."
        className="text-white placeholder:text-white/30"
      />
      <CommandList className="max-h-[400px]">
        {query.trim() && !loading && !hasResults && filteredNav.length === 0 && (
          <CommandEmpty className="text-white/40">No results found.</CommandEmpty>
        )}

        {/* Quick Navigation (shown when no query or filtered) */}
        {filteredNav.length > 0 && (
          <CommandGroup heading="Navigation" className="text-white/20">
            {filteredNav.slice(0, 8).map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => handleSelect(item.href)}
                className="text-white/70 hover:text-white hover:bg-white/[0.06] cursor-pointer"
              >
                <Search className="h-4 w-4 text-white/30" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Search Results */}
        {Object.entries(results).map(([category, items]) => {
          if (!items || items.length === 0) return null;
          const config = categoryConfig[category];
          if (!config) return null;
          const Icon = config.icon;

          return (
            <CommandGroup key={category} heading={config.label} className="text-white/20">
              {items.map((item) => (
                <CommandItem
                  key={`${category}-${item.id}`}
                  value={`${item.title} ${item.subtitle || ''}`}
                  onSelect={() => handleSelect(item.href)}
                  className="text-white/70 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <div className="flex flex-col">
                    <span className="text-sm">{item.title}</span>
                    {item.subtitle && (
                      <span className="text-xs text-white/30">{item.subtitle}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            <span className="ml-2 text-xs text-white/30">Searching...</span>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
