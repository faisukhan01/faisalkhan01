'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

const SETTINGS_GROUPS: Record<string, string[]> = {
  'General': ['site_name', 'site_title', 'site_description', 'status_banner_text'],
  'Hero': ['hero_name', 'hero_title'],
  'Navigation': ['nav_logo_first', 'nav_logo_last'],
  'About': ['about_text', 'about_years', 'about_projects', 'about_technologies', 'about_cv_url'],
  'Contact': ['contact_heading', 'contact_subheading', 'contact_location', 'contact_email', 'contact_response_time'],
  'Services': ['services_metrics_projects', 'services_metrics_satisfaction'],
  'Work': ['work_summary_companies', 'work_summary_total'],
  'GitHub': ['github_stars', 'github_repos', 'github_contributions', 'github_followers', 'github_prs', 'github_forks'],
  'Newsletter': ['newsletter_subscribers', 'newsletter_issues', 'newsletter_open_rate'],
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      if (json.ok) {
        setSettings(json.data || {});
        setOriginalSettings(json.data || {});
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const changed: Record<string, string> = {};
      for (const [key, value] of Object.entries(settings)) {
        if (value !== originalSettings[key]) {
          changed[key] = value;
        }
      }
      if (Object.keys(changed).length === 0) {
        setSaving(false);
        toast.info('No changes to save');
        return;
      }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changed),
      });
      if (!res.ok) throw new Error('Save failed');
      setOriginalSettings({ ...settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success('Settings saved', {
        description: `${Object.keys(changed).length} field${Object.keys(changed).length !== 1 ? 's' : ''} updated.`,
      });
    } catch (err) {
      console.error('Save settings error:', err);
      toast.error('Failed to save settings', {
        description: 'Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({ ...originalSettings });
    setSaved(false);
    toast.info('Changes reverted', { description: 'Restored to last saved state.' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact header — page name is already shown in the top admin header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/90">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {Object.keys(settings).length} settings
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="rounded-xl text-white/85 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? '✓ Saved' : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(SETTINGS_GROUPS).map(([group, keys], gi) => (
          <motion.div
            key={group}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05 }}
            className="rounded-2xl border border-white/[0.15] bg-white/[0.05] p-6"
          >
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-emerald-400/80">{group}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {keys.map((key) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs font-medium text-white/90">{key}</Label>
                  <Input
                    value={settings[key] || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="rounded-xl border-white/[0.12] bg-white/[0.06] text-sm text-white placeholder:text-white/65 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                    placeholder={`Enter ${key.replace(/_/g, ' ')}...`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Catch-all for any settings not in our groups */}
      {Object.keys(settings).filter((k) => !Object.values(SETTINGS_GROUPS).flat().includes(k)).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.15] bg-white/[0.05] p-6"
        >
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-emerald-400/80">Other Settings</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(settings)
              .filter(([k]) => !Object.values(SETTINGS_GROUPS).flat().includes(k))
              .map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs font-medium text-white/90">{key}</Label>
                  <Input
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="rounded-xl border-white/[0.12] bg-white/[0.06] text-sm text-white placeholder:text-white/65 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  />
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
