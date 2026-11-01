import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar fixed to left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-w-0 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
