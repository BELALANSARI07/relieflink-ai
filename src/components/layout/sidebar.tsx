"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Flame,
  LifeBuoy,
  Building2,
  Users2,
  Home,
  Hospital,
  Boxes,
  HandHeart,
  MapPin,
  Bot,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentRole?: string;
}

export function Sidebar({ currentRole = "GOVERNMENT_AUTHORITY" }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Command Center", href: "/dashboard", icon: Radio },
    { name: "Active Disasters", href: "/disasters", icon: Flame },
    { name: "Emergency SOS", href: "/sos", icon: LifeBuoy, badge: "Live" },
    { name: "Interactive Map", href: "/map", icon: MapPin },
    { name: "NGO Coordination", href: "/ngos", icon: Building2 },
    { name: "Rescue Squads", href: "/rescue-teams", icon: Users2 },
    { name: "Shelters & Camps", href: "/shelters", icon: Home },
    { name: "Hospitals & Trauma", href: "/hospitals", icon: Hospital },
    { name: "Relief Resources", href: "/resources", icon: Boxes },
    { name: "Volunteers Network", href: "/volunteers", icon: HandHeart },
    { name: "AI Decision Support", href: "/ai", icon: Bot, badge: "AI" },
    { name: "Analytics & Reports", href: "/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-slate-950/50">
        <div className="h-9 w-9 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
            ReliefLink <span className="text-sky-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800">AI</span>
          </span>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Disaster Response Grid</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sky-600/20 text-sky-300 border border-sky-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4", isActive ? "text-sky-400" : "text-slate-400")} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider",
                    item.badge === "Live"
                      ? "bg-red-950 text-red-400 border border-red-800 animate-pulse"
                      : "bg-sky-950 text-sky-400 border border-sky-800"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Role Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-sky-400">
              CR
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200">Col. R. Verma</p>
              <p className="text-[10px] text-sky-400 font-medium">NDMA Incident Commander</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 text-xs text-slate-400">
          <Link href="/sos/new" className="flex-1 py-1 px-2 text-center rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-700/50 font-semibold text-[11px] transition">
            🚨 Direct SOS
          </Link>
          <Link href="/login" className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition">
            <LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
