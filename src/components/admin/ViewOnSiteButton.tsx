'use client';

import { ExternalLink } from 'lucide-react';

interface ViewOnSiteButtonProps {
  sectionId: string;
  label?: string;
}

export default function ViewOnSiteButton({ sectionId, label = 'View on Site' }: ViewOnSiteButtonProps) {
  const handleClick = () => {
    window.open(`/#${sectionId}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15]"
      title={`Open the ${sectionId} section on the live site`}
    >
      <ExternalLink className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
