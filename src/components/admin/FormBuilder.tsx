'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export type FieldDef = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'switch' | 'slider' | 'select' | 'file';
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: unknown;
  required?: boolean;
  multiple?: boolean;
  accept?: string;
};

interface FormBuilderProps {
  fields: FieldDef[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
}

/* ── File upload field ── */
function FileField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUrl = typeof value === 'string' ? value : '';

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.ok) {
        onChange(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleUpload = async (files: FileList) => {
    setUploading(true);
    setError('');
    try {
      const urls: string[] = [];
      // Parse existing URLs
      if (typeof value === 'string' && value.trim()) {
        try {
          const existing = JSON.parse(value);
          if (Array.isArray(existing)) {
            urls.push(...existing);
          }
        } catch {
          // If it's comma-separated, split it
          urls.push(...value.split(',').map((s: string) => s.trim()).filter(Boolean));
        }
      }

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.ok) {
          urls.push(data.url);
        } else {
          setError(data.error || 'Upload failed for one file');
        }
      }
      onChange(JSON.stringify(urls));
    } catch {
      setError('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (field.multiple) {
      handleMultipleUpload(files);
    } else {
      handleUpload(files[0]);
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    try {
      const urls: string[] = typeof value === 'string' && value.trim() ? JSON.parse(value) : [];
      urls.splice(index, 1);
      onChange(JSON.stringify(urls));
    } catch {
      onChange('[]');
    }
  };

  // Parse gallery images for preview
  const galleryImages: string[] = (() => {
    if (!field.multiple) return [];
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Try comma-separated
        return value.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }
    return [];
  })();

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-white/80">
        {field.label}
      </Label>

      {/* Upload area */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] bg-white/[0.03] p-6 transition-all cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] ${
          uploading ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <p className="text-xs text-white/50">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-white/30" />
            <p className="text-xs text-white/50">
              Click to upload {field.multiple ? 'images' : 'an image'}
            </p>
            <p className="text-[10px] text-white/25">PNG, JPG, GIF, WebP, SVG up to 5MB</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={field.accept || 'image/*'}
          multiple={field.multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Single image preview */}
      {!field.multiple && currentUrl && (
        <div className="relative group rounded-xl border border-white/[0.1] bg-white/[0.03] p-2">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/[0.06]">
              <img
                src={currentUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs text-white/60">{currentUrl}</p>
              <p className="text-[10px] text-emerald-400/60">Image uploaded</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/20 text-red-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/30"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Gallery images preview */}
      {field.multiple && galleryImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-white/40">{galleryImages.length} image(s) uploaded</p>
          <div className="flex flex-wrap gap-2">
            {galleryImages.map((url, index) => (
              <div key={index} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-white/[0.1] bg-white/[0.06]">
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(index)}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {/* Add more button */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/[0.12] bg-white/[0.03] transition-colors hover:border-emerald-500/40"
            >
              <ImageIcon className="h-6 w-6 text-white/30" />
            </div>
          </div>
        </div>
      )}

      {/* Manual URL fallback */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-[10px] text-white/25">or enter URL manually</span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>
      <Input
        value={currentUrl}
        onChange={(e) => {
          if (field.multiple) {
            // For gallery, allow manual comma-separated URLs
            onChange(e.target.value);
          } else {
            onChange(e.target.value);
          }
        }}
        placeholder={field.placeholder || 'Enter image URL...'}
        className="rounded-xl border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/25 focus:border-emerald-500/50 focus:ring-emerald-500/20"
      />
    </div>
  );
}

export default function FormBuilder({ fields, values, onChange }: FormBuilderProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const val = values[field.name];

        if (field.type === 'file') {
          return (
            <FileField
              key={field.name}
              field={field}
              value={val}
              onChange={(v) => onChange(field.name, v)}
            />
          );
        }

        if (field.type === 'switch') {
          return (
            <div key={field.name} className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <Label htmlFor={field.name} className="text-sm font-medium text-white/80">
                {field.label}
              </Label>
              <Switch
                id={field.name}
                checked={!!val}
                onCheckedChange={(checked) => onChange(field.name, checked)}
              />
            </div>
          );
        }

        if (field.type === 'slider') {
          const numVal = typeof val === 'number' ? val : Number(val) || 0;
          return (
            <div key={field.name} className="space-y-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name} className="text-sm font-medium text-white/80">
                  {field.label}
                </Label>
                <span className="text-sm font-mono text-emerald-400">{numVal}</span>
              </div>
              <Slider
                id={field.name}
                min={field.min ?? 0}
                max={field.max ?? 100}
                step={field.step ?? 1}
                value={[numVal]}
                onValueChange={([v]) => onChange(field.name, v)}
                className="w-full"
              />
            </div>
          );
        }

        if (field.type === 'select') {
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm font-medium text-white/80">
                {field.label}
              </Label>
              <select
                id={field.name}
                value={String(val ?? '')}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm font-medium text-white/80">
                {field.label}
              </Label>
              <Textarea
                id={field.name}
                value={String(val ?? '')}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className="rounded-xl border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/25 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>
          );
        }

        // text, number
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-medium text-white/80">
              {field.label}
            </Label>
            <Input
              id={field.name}
              type={field.type === 'number' ? 'number' : 'text'}
              value={String(val ?? '')}
              onChange={(e) => onChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              min={field.min}
              max={field.max}
              step={field.step}
              className="rounded-xl border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/25 focus:border-emerald-500/50 focus:ring-emerald-500/20"
            />
          </div>
        );
      })}
    </div>
  );
}
