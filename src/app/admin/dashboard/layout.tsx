// Dashboard layout — the admin root layout already wraps children in AdminLayout.
// We just pass through here to avoid double-wrapping (which causes the 2-sidebar bug).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
