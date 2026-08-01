'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: 'danger' | 'default';
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  const isDanger = variant === 'danger';

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-white/[0.08] bg-[#0f1629] p-6 text-white shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-white">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-sm text-white/70">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl border-white/[0.08] bg-transparent text-white/75 hover:bg-white/10 hover:text-white">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={
              isDanger
                ? 'rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/25 hover:from-red-400 hover:to-red-500 disabled:opacity-60'
                : 'rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60'
            }
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
