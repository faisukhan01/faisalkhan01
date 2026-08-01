'use client';

import { Toaster } from '@/components/ui/sonner';

// Dashboard layout — the admin root layout already wraps children in AdminLayout.
// We just pass through here to avoid double-wrapping (which causes the 2-sidebar bug),
// and mount the Sonner toaster so every dashboard page has toast notifications.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(15, 22, 41, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#fff',
          },
        }}
      />
    </>
  );
}
