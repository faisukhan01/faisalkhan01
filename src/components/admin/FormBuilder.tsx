'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export type FieldDef = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'switch' | 'slider' | 'select';
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: unknown;
  required?: boolean;
};

interface FormBuilderProps {
  fields: FieldDef[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
}

export default function FormBuilder({ fields, values, onChange }: FormBuilderProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const val = values[field.name];

        if (field.type === 'switch') {
          return (
            <div key={field.name} className="flex items-center justify-between rounded-xl border border-outline-2 bg-surface-2 p-4">
              <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
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
            <div key={field.name} className="space-y-2 rounded-xl border border-outline-2 bg-surface-2 p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                  {field.label}
                </Label>
                <span className="text-sm font-mono text-muted-foreground">{numVal}</span>
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
              <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                {field.label}
              </Label>
              <select
                id={field.name}
                value={String(val ?? '')}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="w-full rounded-xl border border-outline-2 bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-outline-4 focus:ring-1 focus:ring-outline-4"
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
              <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                {field.label}
              </Label>
              <Textarea
                id={field.name}
                value={String(val ?? '')}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className="rounded-xl border-outline-2 bg-surface-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-outline-4 focus:ring-outline-4"
              />
            </div>
          );
        }

        // text, number
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
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
              className="rounded-xl border-outline-2 bg-surface-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-outline-4 focus:ring-outline-4"
            />
          </div>
        );
      })}
    </div>
  );
}
