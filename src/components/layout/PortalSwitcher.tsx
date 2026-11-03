"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Building2, Shield, Radio } from "lucide-react";

export function PortalSwitcher() {
  const pathname = usePathname();

  const portals = [
    {
      name: "Civilian Portal",
      href: "/citizen",
      role: "Citizens & Families",
      theme: "Warm Peach Light",
      icon: Users,
      badge: "Peach & Cream",
      bgClass: "hover:bg-peach-surface/50",
      activeBg: "bg-peach-primary text-peach-text font-bold shadow-sm",
    },
    {
      name: "NGO Portal",
      href: "/ngo",
      role: "Humanitarian NGOs",
      theme: "Coral Professional",
      icon: Building2,
      badge: "Relief Logistics",
      bgClass: "hover:bg-peach-surface/50",
      activeBg: "bg-peach-accent text-white font-bold shadow-sm",
    },
    {
      name: "Authority Portal",
      href: "/authority",
      role: "NDMA / State Govt",
      theme: "Dark Command Grid",
      icon: Shield,
      badge: "Command Center",
      bgClass: "hover:bg-navy-elevated/70",
      activeBg: "bg-navy-cyan text-navy-bg font-extrabold shadow-sm",
    },
    {
      name: "Field Rescue Portal",
      href: "/field",
      role: "NDRF / SDRF Squads",
      theme: "Tactical High-Contrast",
      icon: Radio,
      badge: "Offline Ready",
      bgClass: "hover:bg-navy-elevated/70",
      activeBg: "bg-navy-blue text-white font-extrabold shadow-sm",
    },
  ];

  return (
    <div className="w-full border-b px-4 py-2 flex items-center justify-between text-xs overflow-x-auto bg-slate-900/40 backdrop-blur-md border-slate-800">
      <div className="flex items-center gap-2 shrink-0 pr-3">
        <span className="font-extrabold tracking-wider uppercase text-[10px] text-slate-400">
          ReliefLink Portals:
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-0.5">
        {portals.map((p) => {
          const isActive = pathname === p.href || pathname?.startsWith(`${p.href}/`);
          const Icon = p.icon;

          return (
            <Link
              key={p.href}
              href={p.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition text-xs shrink-0 ${
                isActive
                  ? p.activeBg
                  : "bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="font-semibold">{p.name}</span>
              <span className="text-[9px] opacity-75 hidden sm:inline">({p.role})</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 shrink-0 pl-3">
        <span>Unified India Emergency Backbone</span>
      </div>
    </div>
  );
}
